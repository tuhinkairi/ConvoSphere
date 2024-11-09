import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns:
      [{ hostname: "wry-herring-194.convex.cloud" }]
  }
};

export default nextConfig;
