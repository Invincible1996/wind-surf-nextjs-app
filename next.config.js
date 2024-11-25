/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove assetPrefix as it's causing script loading issues
  output: 'standalone',
  
  // Image optimization settings
  images: {
    unoptimized: true,
    domains: [], // Add your image domains here
  },

  // Experimental features
  experimental: {
    // Enable new app directory
    appDir: true,
  },

  // Build logging
  logging: {
    level: 'verbose',
  }
};

module.exports = nextConfig;