import type { MetadataRoute } from 'next';
import { gameService } from '../server/services/game.service';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticRoutes = ['', '/games', '/search', '/trending', '/updates', '/tools'];
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));

  try {
    const games = await gameService.listGames();

    const gameEntries: MetadataRoute.Sitemap = games.flatMap((game) => {
      const base = `/games/${game.slug}`;
      return [
        {
          url: `${siteUrl}${base}`,
          lastModified: now,
          changeFrequency: 'daily',
          priority: 0.9,
        },
        {
          url: `${siteUrl}${base}/heroes`,
          lastModified: now,
          changeFrequency: 'daily',
          priority: 0.8,
        },
        {
          url: `${siteUrl}${base}/tier-lists`,
          lastModified: now,
          changeFrequency: 'weekly',
          priority: 0.7,
        },
        {
          url: `${siteUrl}${base}/guides`,
          lastModified: now,
          changeFrequency: 'weekly',
          priority: 0.7,
        },
        {
          url: `${siteUrl}${base}/builds`,
          lastModified: now,
          changeFrequency: 'weekly',
          priority: 0.6,
        },
        {
          url: `${siteUrl}${base}/teams`,
          lastModified: now,
          changeFrequency: 'weekly',
          priority: 0.6,
        },
        {
          url: `${siteUrl}${base}/patches`,
          lastModified: now,
          changeFrequency: 'weekly',
          priority: 0.6,
        },
        {
          url: `${siteUrl}${base}/database`,
          lastModified: now,
          changeFrequency: 'weekly',
          priority: 0.5,
        },
        {
          url: `${siteUrl}${base}/database/gear`,
          lastModified: now,
          changeFrequency: 'weekly',
          priority: 0.5,
        },
        {
          url: `${siteUrl}${base}/database/pets`,
          lastModified: now,
          changeFrequency: 'weekly',
          priority: 0.5,
        },
        {
          url: `${siteUrl}${base}/tools`,
          lastModified: now,
          changeFrequency: 'monthly',
          priority: 0.4,
        },
      ];
    });

    return [...staticEntries, ...gameEntries];
  } catch {
    return staticEntries;
  }
}