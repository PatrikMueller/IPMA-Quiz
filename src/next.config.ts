import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static export for GitHub Pages
  output: 'export',
  
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  
  // Configure base path for branch deployments
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  
  // Configure asset prefix for GitHub Pages - this fixes SVG/image loading!
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '',
  
  // Ensure trailing slashes are handled correctly
  trailingSlash: true,
};

export default nextConfig;
