import {
  LoginLink,
  RegisterLink,
  getKindeServerSession,
} from "@kinde-oss/kinde-auth-nextjs/server";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

import { MaxWidthWrapper } from "./max-width-wrapper";
import { MobileNav } from "./mobile-nav";
import { UserAccountNav } from "./user-account-nav";
import { SOURCE_CODE } from "@/config/links";
import Image from "next/image";

export const Navbar = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return (
    <nav className="sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <Link href="/" className="flex z-40 font-semibold">
            <span>quill.</span>
          </Link>

          <div className="flex items-center justify-center space-x-4">
            <MobileNav isAuth={!!user} />

            <div className="hidden sm:flex">
              {!user ? (
                <>
                  <Link
                    href="/pricing"
                    className={buttonVariants({
                      variant: "ghost",
                      size: "sm",
                    })}
                  >
                    Pricing
                  </Link>

                  <LoginLink
                    className={buttonVariants({
                      variant: "ghost",
                      size: "sm",
                    })}
                  >
                    Sign in
                  </LoginLink>
                  <RegisterLink
                    className={buttonVariants({
                      size: "sm",
                    })}
                  >
                    Get started <ArrowRight className="ml-1.5 h-5 w-5" />
                  </RegisterLink>
                </>
              ) : (
                <>
                  <Link
                    href="/dashboard"
                    className={buttonVariants({
                      variant: "ghost",
                      size: "sm",
                    })}
                  >
                    Dashboard
                  </Link>

                  <UserAccountNav
                    name={
                      !user.given_name || !user.family_name
                        ? "Your Account"
                        : `${user.given_name} ${user.family_name}`
                    }
                    email={user.email ?? ""}
                    imageUrl={user.picture ?? ""}
                  />
                </>
              )}
            </div>

            <Link href={SOURCE_CODE} target="_blank" rel="noreferrer noopener">
              <Image src="/github.svg" alt="GitHub" height={25} width={25} />
            </Link>
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};
