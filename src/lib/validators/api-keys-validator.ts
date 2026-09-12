import { z } from "zod";

export const apiKeysFormSchema = z.object({
  openaiApiKey: z
    .string()
    .trim()
    .min(12, { message: "Invalid OpenAI API key." })
    .startsWith("sk-", { message: "Invalid OpenAI API key." }),
  pineconeApiKey: z
    .string()
    .trim()
    .min(12, { message: "Invalid Pinecone API key." })
    .startsWith("pcsk_", { message: "Invalid Pinecone API key." }),
  pineconeIndex: z.string().trim().min(1, {
    message: "Pinecone index name is required.",
  }),
});

export type ApiKeysFormValues = z.infer<typeof apiKeysFormSchema>;
