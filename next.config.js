/** @type {import('next').NextConfig} */
const nextConfig = {
  // Asset prefix for Vercel environment
  assetPrefix: process.env.VERCEL ? '/_next' : '',

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