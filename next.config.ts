import type { NextConfig } from "next";
import { apiOrigin } from "./src/lib/api-origin";

// API_URL is read at build time, both for this rewrite and for prerendering service pages, so set it
// in the hosting environment and make sure the API is reachable before building for production.

const nextConfig: NextConfig = {
  // Proxy /api/* to Express so the browser only talks to this origin and auth cookies stay first-party.
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${apiOrigin}/api/:path*` }];
  },
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
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
