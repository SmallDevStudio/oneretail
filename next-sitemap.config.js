/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://localhost:3000',
  generateRobotsTxt: true,
  exclude: ['/server-sitemap.xml'], // ไม่ให้ sitemap API ไปอยู่ในไฟล์
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://localhost:3000/server-sitemap.xml', // Sitemap ที่สร้างแบบ dynamic
    ],
  },
};
