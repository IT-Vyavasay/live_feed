/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  env: {
    ADMFLDR: process.env.ADMFLDR,
    SITENAME: process.env.SITENAME,
    PAGE: "10",
    API_ENDPOINT: process.env.API_ENDPOINT,
    TESTNET: process.env.TESTNET,
    FRONT_URL: process.env.FRONT_URL,
    FILTER_MONTH: "36",
    SITE_KEY: process.env.SITE_KEY,
    SECRET_KEY: process.env.SECRET_KEY,
    PAGELIMIT: 10,
    FILTERDAYS: 365,
    SCH_EXP_URL: process.env.SCH_EXP_URL,
    NFT_EXP_URL: process.env.NFT_EXP_URL,
    MAINTENANCE_FILE_PATH: process.env.MAINTENANCE_FILE_PATH,
  },
  images: {
    domains: ["localhost"],

  }
}

module.exports = nextConfig


