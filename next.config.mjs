/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'localhost:3000',
          },
          {
            protocol: 'https',
            hostname: 'firebasestorage.googleapis.com',
          },
          {
            protocol: 'https',
            hostname: 'profile.line-scdn.net',
          },
          {
            protocol: 'https',
            hostname: 'one-retail.vercel.app',
          },
        ],
        
      },
  env: {
    LINE_LIFF_ID: process.env.LINE_LIFF_ID,
    NEXT_PUBLIC_MONGODB_URL: process.env.NEXT_PUBLIC_MONGODB_URL,
  },
};

export default nextConfig;
