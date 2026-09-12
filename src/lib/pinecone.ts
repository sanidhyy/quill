import { Pinecone } from "@pinecone-database/pinecone";

export const getPineconeClient = (apiKey: string) => {
  return new Pinecone({ apiKey });
};
