/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: ["res.cloudinary.com", "placehold.co"],
  },
};

module.exports = nextConfig

