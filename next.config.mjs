/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    reactCompiler: true
  },
  outputFileTracingIncludes: {
    '/generate': ['assets/**']
  }
};

export default nextConfig;
