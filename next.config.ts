
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
      // Ensure config.resolve and config.resolve.fallback exist
      if (!config.resolve) {
        config.resolve = {};
      }
      if (!config.resolve.fallback) {
        config.resolve.fallback = {};
      }

      // Don't attempt to bundle Node.js built-in modules for the client
      config.resolve.fallback.async_hooks = false;
      config.resolve.fallback.fs = false;
      config.resolve.fallback.net = false;
      config.resolve.fallback.tls = false;
      config.resolve.fallback.child_process = false;
      config.resolve.fallback.path = false;
      config.resolve.fallback.os = false;
      config.resolve.fallback.crypto = false; // Can sometimes be polyfilled by browsers, but explicit false is safer here.
      config.resolve.fallback.stream = false;
      config.resolve.fallback.http = false;
      config.resolve.fallback.https = false;
      config.resolve.fallback.zlib = false;
      config.resolve.fallback.url = false; // Browsers have URL, but Node's `url` is different.
    }
    return config;
  },
};

export default nextConfig;
