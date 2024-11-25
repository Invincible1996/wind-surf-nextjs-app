/** @type {import('next').NextConfig} */
const nextConfig = {
  // 检测是否在 Vercel 环境
  assetPrefix: process.env.VERCEL ? '/_next' : '',

  // 确保静态资源正确处理
  images: {
    unoptimized: true,
    domains: [], // 添加你的图片域名
  },

  // 实验性选项
  experimental: {
    // 优化 CSS 加载
    optimizeCss: true,
    // 启用新的静态导出特性
    appDir: true,
  },

  // 输出详细构建信息
  logging: {
    level: 'verbose',
  }
};

module.exports = nextConfig;