import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
        port: '',
        pathname: '/**',
      }
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't attempt to bundle Node.js built-in modules for the client
      config.resolve.fallback = {
        ...config.resolve.fallback,
        async_hooks: false,
        fs: false, // Often another one that can cause issues if pulled client-side
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

export default nextConfig;
