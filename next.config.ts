import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Railway-specific optimizations
  output: 'standalone', // For better Railway compatibility and smaller deployments
  
  // Using webpack for more stable HMR (Turbopack can have file watching issues)
  // To use webpack, run: npm run dev -- --webpack
};

export default nextConfig;
