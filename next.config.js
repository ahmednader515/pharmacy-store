const nextConfig = {
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
  // ESLint configuration
  eslint: {
    // Only run ESLint on these directories during build
    dirs: ['app', 'components', 'lib', 'hooks'],
    // Don't fail the build on ESLint errors in production
    ignoreDuringBuilds: process.env.NODE_ENV === 'production',
  },
  // TypeScript configuration
  typescript: {
    // Don't fail the build on TypeScript errors in production
    ignoreBuildErrors: process.env.NODE_ENV === 'production',
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
  // Exclude [locale] directory from build
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'app/[locale]': false,
    }
    return config
  },
}

module.exports = nextConfig
