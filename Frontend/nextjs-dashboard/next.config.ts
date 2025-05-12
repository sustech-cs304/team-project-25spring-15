import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },

  // 转发api请求到后端，解决CORS问题
  async rewrites() {
    return [
      {
        source: '/api/:path*',                            // 客户端请求 /api/xxx
        destination: 'http://47.117.144.50:8000/api/:path*', // 内部转给这个地址
      },
    ];
  },
};

export default nextConfig;
