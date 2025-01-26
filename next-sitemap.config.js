/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.VERCEL_URL || 'https://localhost:3000',
    generateRobotsTxt: true,
    exclude: ['/server-sitemap-index.xml'], // <= exclude here
    robotsTxtOptions: {
      additionalSitemaps: [
        'https://localhost:3000/server-sitemap-index.xml', // <==== Add here
      ],
    },
  }