/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    LIFF_ID: process.env.NEXT_PUBLIC_LIFF_ID,
  },
};

export default nextConfig;
