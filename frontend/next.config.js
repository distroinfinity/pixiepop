/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // https://replicate.delivery/pbxt/bgY2jxtYRRYWI5jcYSVyeWKnl0n0SsUpJ6fQGnXg9Gm5OQgQA/out-0.png
  images: {
    domains: [
      // "img.freepik.com",
      "oaidalleapiprodscus.blob.core.windows.net",
      "replicate.delivery",
    ],
  },
};

module.exports = nextConfig;
