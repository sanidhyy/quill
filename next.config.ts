import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/sign-in",
        destination: "/api/auth/login",
        permanent: true,
      },
      {
        source: "/sign-up",
        destination: "/api/auth/register",
        permanent: true,
      },
    ];
  },
  devIndicators: false,
  turbopack: {
    resolveAlias: {
      canvas: "false",
      encoding: "false",
    },
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "ufs.sh",
        pathname: "/f/**",
      },
    ],
    qualities: [100, 75],
  },
};

export default nextConfig;
