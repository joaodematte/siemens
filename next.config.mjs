/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingIncludes: {
      '/generate': ['assets/**']
    }
  }
};

export default nextConfig;
