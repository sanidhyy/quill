import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

import { procedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
  authCallback: procedure.query(async () => {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id || !user.email)
      throw new TRPCError({ code: "UNAUTHORIZED" });

    // check if user is in the database

    return {
      success: true,
    };
  }),
});

export type AppRouter = typeof appRouter;
