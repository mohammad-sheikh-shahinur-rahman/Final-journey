
import type {NextConfig} from 'next';
// webpack will be provided by Next.js in the webpack function arguments

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
  webpack: (config, { isServer, webpack }) => { // Added 'webpack' to destructured arguments
    if (!isServer) {
      // Add IgnorePlugin for async_hooks to prevent it from being bundled on the client
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^async_hooks$/,
        })
      );

      // Ensure config.resolve exists
      config.resolve = config.resolve || {};
      // Ensure config.resolve.fallback exists
      config.resolve.fallback = config.resolve.fallback || {};

      // Set specific fallbacks to false (keeping these as defense-in-depth)
      // The async_hooks fallback might be redundant due to IgnorePlugin, but it's harmless.
      config.resolve.fallback.async_hooks = false;
      config.resolve.fallback.fs = false;
      config.resolve.fallback.net = false;
      config.resolve.fallback.tls = false;
      config.resolve.fallback.child_process = false;
      config.resolve.fallback.path = false;
      config.resolve.fallback.os = false;
      config.resolve.fallback.crypto = false;
      config.resolve.fallback.stream = false;
      config.resolve.fallback.http = false;
      config.resolve.fallback.https = false;
      config.resolve.fallback.http2 = false;
      config.resolve.fallback.zlib = false;
      config.resolve.fallback.url = false;
      config.resolve.fallback.dns = false; // Added dns
    }
    return config;
  },
};

export default nextConfig;
