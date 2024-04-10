import { createRouteHandler } from "uploadthing/next";

import { ourFileRouter } from "./core";

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  config: {
    uploadthingId: process.env.UPLOADTHING_APP_ID!,
    uploadthingSecret: process.env.UPLOADTHING_SECRET!,
    callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/uploadthing`,
  },
});
