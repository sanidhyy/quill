import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
import { type NextRequest } from "next/server";

export default function proxy(req: NextRequest) {
  return withAuth(req, {
    isReturnToCurrentPage: true,
  });
}
export const config = {
  matcher: ["/dashboard/:path*", "/auth-callback"],
};
