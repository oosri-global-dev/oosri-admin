/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Pre-existing violations are being fixed incrementally (see Phase 1+ branches).
    // Remove this once `npm run lint` reports 0 errors.
    ignoreDuringBuilds: true,
  },
  reactStrictMode: false,
  compiler: {
    styledComponents: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
      { protocol: "https", hostname: "placehold.co", pathname: "/**" },
    ],
  },
};

module.exports = nextConfig

