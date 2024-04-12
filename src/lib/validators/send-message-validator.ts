import * as z from "zod";

export const sendMessageValidator = z.object({
  fileId: z.string(),
  message: z.string(),
});
