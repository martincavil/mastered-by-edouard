import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'dl.dropboxusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.dropbox.com',
        pathname: '/**',
      },
    ],
  },
  reactStrictMode: true,
  poweredByHeader: false,

  // Optimisations pour réduire la consommation mémoire
  // Note: Turbopack gère déjà efficacement la mémoire

  // Limite le nombre de workers
  webpack: (config, { isServer, dev }) => {
    if (dev) {
      // Réduit l'utilisation de la mémoire en dev
      config.watchOptions = {
        ...config.watchOptions,
        ignored: [
          '**/node_modules/**',
          '**/.git/**',
          '**/.next/**',
          '**/public/**',
        ],
        // Réduit la fréquence de polling
        aggregateTimeout: 300,
        poll: 1000,
      };

      // Limite le nombre de chunks pour réduire la mémoire
      config.optimization = {
        ...config.optimization,
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false,
      };
    }
    return config;
  },
};

export default nextConfig;
