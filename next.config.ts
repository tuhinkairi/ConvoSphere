import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns:
      [
        { hostname: "wry-herring-194.convex.cloud" },
        { hostname: "d14uq1pz7dzsdq.cloudfront.net" }

      ]
  }
};
export default nextConfig;
