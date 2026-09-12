import { type ClassValue, clsx } from "clsx";
import { type Metadata } from "next";
import {
  APIError,
  AuthenticationError,
  OpenAIError,
  RateLimitError,
} from "openai";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_BASE_URL}${path}`;
}

export function getSecureCookieName(cookieName: string) {
  const baseUrl = absoluteUrl("");
  const isSecure = baseUrl.startsWith("https://");

  return isSecure ? `__Secure-${cookieName}` : cookieName;
}

export const getAISettingsErrorMessage = (error: unknown): string => {
  if (
    error instanceof AuthenticationError ||
    (error instanceof APIError && error.status === 401)
  ) {
    return "Invalid API key. Please check your key and try again";
  }

  if (
    error instanceof RateLimitError ||
    (error instanceof APIError && error.status === 429)
  ) {
    const code = error instanceof APIError ? error.code : null;
    const message = error instanceof Error ? error.message : "";
    const isQuota =
      code === "insufficient_quota" ||
      /insufficient_quota|exceeded your current quota|quota|billing/i.test(
        message,
      );

    if (isQuota)
      return "Not enough credits. Please purchase more credits and try again";

    return "Rate limit reached. Please try again in a moment";
  }

  if (error instanceof OpenAIError)
    return error.message || "Failed to verify API key";

  if (error instanceof Error) return error.message;

  return "Failed to verify API key";
};

export function constructMetadata({
  title = "Quill - The SaaS for Students",
  description = "Quill is an open-source software to make chatting to your PDF files easy.",
  image = "/thumbnail.png",
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
} = {}): Metadata {
  return {
    title,
    description,
    keywords: [
      "reactjs",
      "nextjs",
      "vercel",
      "react",
      "ai",
      "artificial-intelligence",
      "machine-learning",
      "ai-chat",
      "shadcn",
      "shadcn-ui",
      "radix-ui",
      "cn",
      "clsx",
      "quill",
      "realtime-chat",
      "summarize-pdf",
      "pdf-ai",
      "langchain",
      "openai",
      "neon-db",
      "sonner",
      "zustand",
      "zod",
      "sql",
      "postgresql",
      "aiven",
      "lucide-react",
      "next-themes",
      "postcss",
      "prettier",
      "react-dom",
      "tailwindcss",
      "tailwindcss-animate",
      "ui/ux",
      "js",
      "javascript",
      "typescript",
      "eslint",
      "html",
      "css",
    ] as Array<string>,
    authors: {
      name: "Sanidhya Kumar Verma",
      url: "https://github.com/sanidhyy",
    },
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@_sanidhyy",
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
