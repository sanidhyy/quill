import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

import { db } from "@/db";
import { File } from "@/generated/prisma/client";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import { PLANS } from "@/config/stripe";

const f = createUploadthing();

const middleware = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) throw new UploadThingError("Unauthorized.");

  const subscriptionPlan = await getUserSubscriptionPlan();

  return { subscriptionPlan, userId: user.id };
};

const onUploadComplete = async ({
  metadata,
  file,
}: {
  metadata: Awaited<ReturnType<typeof middleware>>;
  file: {
    key: string;
    name: string;
    url: string;
  };
}) => {
  let createdFile: File | null;

  createdFile = await db.file.findUnique({
    where: {
      key: file.key,
      userId: metadata.userId,
    },
  });

  // Check if the file is already processed
  if (!createdFile) {
    createdFile = await db.file.create({
      data: {
        key: file.key,
        name: file.name,
        userId: metadata.userId,
        url: `https://utfs.io/f/${file.key}`,
        uploadStatus: "PROCESSING",
      },
    });
  }

  try {
    const { getUserApiKeys } = await import("@/lib/user-api-keys");
    const apiKeys = await getUserApiKeys();

    if (!apiKeys) {
      await db.file.update({
        data: {
          uploadStatus: "FAILED",
        },
        where: {
          id: createdFile.id,
          userId: metadata.userId,
        },
      });
      return;
    }

    // Lazy-load so layout/SSR (extractRouterConfig) never pulls pdfjs/canvas
    const [{ Document }, { OpenAIEmbeddings }, { PineconeStore }, { PDFParse }] =
      await Promise.all([
        import("@langchain/core/documents"),
        import("@langchain/openai"),
        import("@langchain/pinecone"),
        import("pdf-parse/worker").then(async () => import("pdf-parse")),
      ]);
    const { getPineconeClient } = await import("@/lib/pinecone");

    const response = await fetch(createdFile.url);
    const data = new Uint8Array(await response.arrayBuffer());

    // load pdf into memory and extract page-level text
    const parser = new PDFParse({ data });
    const textResult = await parser.getText();
    await parser.destroy();

    const pageLevelDocs = textResult.pages.map(
      (page) =>
        new Document({
          pageContent: page.text,
          metadata: {
            source: createdFile!.url,
            loc: { pageNumber: page.num },
          },
        }),
    );

    // pdf page length
    const pageAmt = pageLevelDocs.length;
    const { subscriptionPlan, userId } = metadata;
    const { isSubscribed } = subscriptionPlan;

    const isProExceeded =
      pageAmt > PLANS.find((plan) => plan.name === "Pro")!.pagesPerPdf;
    const isFreeExceeded =
      pageAmt > PLANS.find((plan) => plan.name === "Free")!.pagesPerPdf;

    // limit exceeded
    if ((isSubscribed && isProExceeded) || (!isSubscribed && isFreeExceeded)) {
      await db.file.update({
        data: {
          uploadStatus: "FAILED",
        },
        where: {
          id: createdFile.id,
          userId,
        },
      });
      return;
    }

    // vectorize and index entire document
    const pinecone = getPineconeClient(apiKeys.pineconeApiKey);
    const pineconeIndex = pinecone.index(apiKeys.pineconeIndex);

    const embeddings = new OpenAIEmbeddings({
      apiKey: apiKeys.openaiApiKey,
    });

    await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
      pineconeIndex,
      namespace: createdFile.id,
    });

    await db.file.update({
      data: {
        uploadStatus: "SUCCESS",
      },
      where: {
        id: createdFile.id,
        userId: metadata.userId,
      },
    });
  } catch (error) {
    await db.file.update({
      data: {
        uploadStatus: "FAILED",
      },
      where: {
        id: createdFile.id,
        userId: metadata.userId,
      },
    });
  }
};

export const ourFileRouter = {
  freePlanUploader: f({ pdf: { maxFileSize: "4MB" } })
    .middleware(middleware)
    .onUploadComplete(onUploadComplete),
  proPlanUploader: f({ pdf: { maxFileSize: "16MB" } })
    .middleware(middleware)
    .onUploadComplete(onUploadComplete),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
