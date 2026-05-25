/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'sgimage.netmarble.com' },
      { protocol: 'https', hostname: 'images.pexels.com' },
    ],
  },
  async redirects() {
    return [
      // /characters → /heroes (gradual migration)
      {
        source: '/games/:slug/characters',
        destination: '/games/:slug/heroes',
        permanent: true,
      },
      {
        source: '/games/:slug/characters/:path*',
        destination: '/games/:slug/heroes/:path*',
        permanent: true,
      },
      // /skills → /heroes (skills are hero attributes, not standalone)
      {
        source: '/games/:slug/skills',
        destination: '/games/:slug/heroes',
        permanent: true,
      },
      {
        source: '/games/:slug/skills/:path*',
        destination: '/games/:slug/heroes',
        permanent: true,
      },
      // Legacy database/ sub-routes
      {
        source: '/games/:slug/database/heroes',
        destination: '/games/:slug/heroes',
        permanent: true,
      },
      {
        source: '/games/:slug/database/skills',
        destination: '/games/:slug/heroes',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
