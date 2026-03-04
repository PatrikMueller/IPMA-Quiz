import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static export for GitHub Pages
  output: 'export',
  
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  
  // Configure base path for branch deployments (clean version)
  basePath: process.env.NEXT_PUBLIC_BASE_PATH?.replace(/\/$/, '') || '',
  
  // Use relative asset paths - no assetPrefix needed!
  // Assets will automatically load relative to the current URL
  // This works for both main branch and feature branches automatically
  
  // Ensure trailing slashes for GitHub Pages
  trailingSlash: true,
};

export default nextConfig;
