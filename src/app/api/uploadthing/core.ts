import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

import { db } from "@/db";
import { getPineconeClient } from "@/lib/pinecone";
import { File } from "@prisma/client";

const f = createUploadthing();

export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: "4MB" } })
    .middleware(async () => {
      const { getUser } = getKindeServerSession();
      const user = await getUser();

      if (!user || !user.id) throw new UploadThingError("Unauthorized.");

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
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
        const response = await fetch(createdFile.url);
        const blob = await response.blob();

        // load pdf into memory
        const loader = new PDFLoader(blob);

        // extract pdf page level text
        const pageLevelDocs = await loader.load();

        // pdf page length
        const pageAmt = pageLevelDocs.length;

        // vectorize and index entire document
        const pinecone = getPineconeClient();
        const pineconeIndex = pinecone.Index("quill");

        const embeddings = new OpenAIEmbeddings({
          openAIApiKey: process.env.OPENAI_API_KEY!,
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
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
