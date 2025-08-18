const withNextIntl = require('next-intl/plugin')

const nextConfig = withNextIntl()({
  /* config options here */

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: '',
      },
    ],
  },
  // Performance optimizations
  experimental: {
    optimizePackageImports: ['@prisma/client'],
  },
  // Reduce bundle size and improve loading
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Enable compression
  compress: true,
  // Optimize for faster navigation
  poweredByHeader: false,
})

module.exports = nextConfig
