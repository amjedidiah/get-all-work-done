/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: [
      "sequelize",
      "@types/sequelize",
      "sequelize-cli",
    ],
  },
};

module.exports = nextConfig
