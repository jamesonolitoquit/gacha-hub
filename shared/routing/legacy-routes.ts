export const legacyRedirects: Record<string, string> = {
  '/games/:slug/characters': '/games/:slug/heroes',
  '/games/:slug/characters/:path*': '/games/:slug/heroes/:path*',
  '/games/:slug/skills': '/games/:slug/heroes',
  '/games/:slug/skills/:path*': '/games/:slug/heroes',
  '/games/:slug/database/heroes': '/games/:slug/heroes',
  '/games/:slug/database/skills': '/games/:slug/heroes',
};
