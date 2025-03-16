import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['huggingface.co'],
  },
};

export default nextConfig;
