import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  serverExternalPackages: [],
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig