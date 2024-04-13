import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import type { Viewport } from "next";
import { Inter } from "next/font/google";
import type { PropsWithChildren } from "react";
import { Toaster } from "sonner";
import { extractRouterConfig } from "uploadthing/server";

import "react-loading-skeleton/dist/skeleton.css";
import "simplebar-react/dist/simplebar.min.css";

import { ourFileRouter } from "@/app/api/uploadthing/core";
import { Navbar } from "@/components/navbar";
import { Providers } from "@/components/providers";
import { cn, constructMetadata } from "@/lib/utils";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = constructMetadata();

export const viewport: Viewport = {
  themeColor: "#FFF",
};

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <html lang="en" className="light">
      <Providers>
        <body
          className={cn(
            "min-h-screen font-sans antialiased grainy",
            inter.className,
          )}
        >
          <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
          <Toaster richColors />

          <Navbar />
          {children}
        </body>
      </Providers>
    </html>
  );
}
