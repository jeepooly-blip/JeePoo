const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
    ],
  },
  // Enable experimental features for better subdomain handling
  experimental: {
    serverActions: {
      allowedOrigins: ['*.jeepoo.com', 'localhost:3000'],
    },
  },
}

module.exports = withNextIntl(nextConfig);
