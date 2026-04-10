import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
  env: {
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_SESSION_MAX_AGE: process.env.AUTH_SESSION_MAX_AGE,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_BACKEND_APP_URL: process.env.NEXT_PUBLIC_BACKEND_APP_URL,
    DEBUG: process.env.DEBUG,
  },
};

export default nextConfig;
