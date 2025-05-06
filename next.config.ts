import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  // basePath: "/github-blog",
  // assetPrefix: "/github-blog",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
