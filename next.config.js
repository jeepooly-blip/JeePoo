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

module.exports = nextConfig
