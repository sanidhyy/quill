import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { NextResponse, type NextRequest } from "next/server";

import { db } from "@/db";
import { openai } from "@/lib/openai";
import { getPineconeClient } from "@/lib/pinecone";
import { sendMessageValidator } from "@/lib/validators/send-message-validator";

export async function POST(req: NextRequest) {
  // endpoint for asking a question to a PDF file

  const body = await req.json();

  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user?.id) return new NextResponse("Unauthorized.", { status: 401 });

  const { id: userId } = user;

  const { fileId, message } = sendMessageValidator.parse(body);

  const file = await db.file.findUnique({
    where: {
      id: fileId,
      userId,
    },
  });

  if (!file) return new NextResponse("Not Found.", { status: 404 });

  await db.message.create({
    data: {
      text: message,
      isUserMessage: true,
      userId,
      fileId,
    },
  });

  // vectorize message
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY!,
  });

  const pinecone = getPineconeClient();
  const pineconeIndex = pinecone.Index("quill");

  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,
    namespace: fileId,
  });

  const results = await vectorStore.similaritySearch(message, 4);

  const prevMessages = await db.message.findMany({
    where: {
      fileId,
      userId: user.id,
    },
    orderBy: {
      createdAt: "asc",
    },
    take: 6, // display last 6 messages
  });

  const formattedPrevMessages = prevMessages.map((msg) => ({
    role: msg.isUserMessage ? ("user" as const) : ("assistant" as const),
    content: msg.text,
  }));

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    temperature: 0,
    stream: true,
    messages: [
      {
        role: "system",
        content:
          "Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format.",
      },
      {
        role: "user",
        content: `Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.
        
  \n----------------\n
  
  PREVIOUS CONVERSATION:
  ${formattedPrevMessages.map((message) => {
    if (message.role === "user") return `User: ${message.content}\n`;
    return `Assistant: ${message.content}\n`;
  })}
  
  \n----------------\n
  
  CONTEXT:
  ${results.map((r) => r.pageContent).join("\n\n")}
  
  USER INPUT: ${message}`,
      },
    ],
  });

  const stream = OpenAIStream(response, {
    async onCompletion(completion) {
      await db.message.create({
        data: {
          text: completion,
          isUserMessage: false,
          fileId,
          userId,
        },
      });
    },
  });

  return new StreamingTextResponse(stream);
}
