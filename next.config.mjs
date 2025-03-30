/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingIncludes: {
    '/generate': ['assets/**']
  }
};

export default nextConfig;
