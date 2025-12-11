/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // We need to ensure that dynamic routes are not used in a way that breaks static export, 
  // or handled correctly. For a desktop app, static export is preferred.
};

export default nextConfig;
