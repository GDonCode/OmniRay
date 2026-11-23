import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets a phone on the LAN load the dev server's JS (otherwise hydration is blocked and nothing client-side runs).
  allowedDevOrigins: ["192.168.39.102"],
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
