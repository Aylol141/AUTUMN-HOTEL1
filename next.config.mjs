/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  // هذا الجزء سيسمح برفع الموقع حتى لو وجد أخطاء TypeScript
  typescript: {
    ignoreBuildErrors: true,
  },
  // وأيضاً تجاهل أخطاء الـ Linting
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig