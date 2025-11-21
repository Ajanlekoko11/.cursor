import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Using webpack for more stable HMR (Turbopack can have file watching issues)
  // To use webpack, run: npm run dev -- --webpack
};

export default nextConfig;
