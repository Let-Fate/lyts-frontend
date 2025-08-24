import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "export",
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  },
  /* config options here */
  experimental: {
    // 确保没有启用 Turbopack
    turbopack: false,
  },
};

export default nextConfig;