/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  trailingSlash: true, // ใช้สำหรับให้ Sitemap ถูกต้อง
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'localhost:3000',
      },
      {
        protocol: 'http',
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
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'scdn.line-apps.com',
      },
      {
        protocol: 'https',
        hostname: 'p16-sign-sg.tiktokcdn.com',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'e8p8e6g1rockgoc5.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'drive.google.com',
      },
    ],
  },

  sassOptions: {
    includePaths: ['./styles'],
  },
};

export default nextConfig;
