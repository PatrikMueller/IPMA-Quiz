import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static export for GitHub Pages
  output: 'export',
  
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  
  // Configure base path for branch deployments
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ? 
    (process.env.NEXT_PUBLIC_BASE_PATH === '/' ? '' : process.env.NEXT_PUBLIC_BASE_PATH.replace(/\/$/, '')) : 
    '',
  
  // Configure asset prefix for GitHub Pages
  assetPrefix: process.env.NODE_ENV === 'production' && process.env.GITHUB_REPOSITORY ? 
    `https://${process.env.GITHUB_REPOSITORY.split('/')[0]}.github.io/${process.env.GITHUB_REPOSITORY.split('/')[1]}${process.env.NEXT_PUBLIC_BASE_PATH || ''}` : 
    undefined,
  
  // Ensure trailing slashes are handled correctly
  trailingSlash: true,
};

export default nextConfig;
