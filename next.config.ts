import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '/github-blog',
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '/github-blog',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
