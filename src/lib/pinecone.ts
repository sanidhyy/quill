import { Pinecone } from "@pinecone-database/pinecone";

export const getPineconeClient = () => {
  const client = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
  });

  return client;
};
