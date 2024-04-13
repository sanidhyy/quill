"use client";

import { ArrowRight, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export const MobileNav = ({ isAuth }: { isAuth: boolean }) => {
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    toggleOpen();
  }, [pathname]);

  const closeOnCurrent = (href: string) => {
    if (pathname === href) {
      toggleOpen();
    }
  };

  return (
    <div className="sm:hidden">
      <button onClick={toggleOpen} aria-label="Menu" title="Menu">
        <Menu className="relative z-50 h-5 w-5 text-zinc-700" />
      </button>

      {isOpen ? (
        <div className="fixed animate-in slide-in-from-top-5 fade-in-20 inset-0 z-0 w-full">
          <ul className="absolute bg-white border-b border-zinc-200 shadow-xl grid w-full gap-3 px-10 pt-20 pb-8">
            {!isAuth ? (
              <>
                <li>
                  <Link
                    href="/sign-up"
                    onClick={() => closeOnCurrent("/sign-up")}
                    className="flex items-center w-full font-semibold text-green-600"
                  >
                    Get started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </li>

                <li aria-hidden className="my-3 h-px w-full bg-gray-300" />

                <li>
                  <Link
                    href="/sign-in"
                    onClick={() => closeOnCurrent("/sign-in")}
                    className="flex items-center w-full font-semibold"
                  >
                    Sign in
                  </Link>
                </li>

                <li aria-hidden className="my-3 h-px w-full bg-gray-300" />

                <li>
                  <Link
                    href="/pricing"
                    onClick={() => closeOnCurrent("/pricing")}
                    className="flex items-center w-full font-semibold"
                  >
                    Pricing
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    href="/dashboard"
                    onClick={() => closeOnCurrent("/dashboard")}
                    className="flex items-center w-full font-semibold"
                  >
                    Dashboard
                  </Link>
                </li>

                <li aria-hidden className="my-3 h-px w-full bg-gray-300" />

                <li>
                  <Link
                    href="/sign-out"
                    className="flex items-center w-full font-semibold"
                  >
                    Sign out
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
};
