/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Make sure outputs are accurate
  output: "standalone",
  experimental: {
    // This is experimental but can help prevent fast refresh issues
    esmExternals: "loose",
  },
};

module.exports = nextConfig;
