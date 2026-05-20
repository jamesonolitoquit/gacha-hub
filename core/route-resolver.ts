import { moduleRegistry } from './module-registry';
import type { GameModule } from './types';

export type ResolvedRoute = {
  gameSlug?: string;
  gameModule?: GameModule;
  routeSegment: string;
  params: Record<string, string>;
};

const platformRoutes = new Set(['games', 'search', 'trending', 'updates', 'tools']);

function extractPatternParams(pattern: string | undefined, routeSegments: string[]) {
  if (!pattern) {
    return routeSegments.slice(1).reduce<Record<string, string>>((acc, value, index) => {
      acc[`param${index + 1}`] = value;
      return acc;
    }, {});
  }

  const patternSegments = pattern.split('/').filter(Boolean);

  return patternSegments.reduce<Record<string, string>>((acc, segment, index) => {
    if (segment.startsWith('[') && segment.endsWith(']')) {
      const key = segment.slice(1, -1);
      const value = routeSegments[index];

      if (value) {
        acc[key] = value;
      }
    }

    return acc;
  }, {});
}

export function resolveRoute(pathname: string, host?: string): ResolvedRoute {
  const segments = pathname.split('/').filter(Boolean);
  const hostModule = moduleRegistry.findByHost(host);
  const gamePathPrefix = segments[0] === 'games' ? segments[1] : undefined;
  const directGameSlug = segments[0] && !platformRoutes.has(segments[0]) ? segments[0] : undefined;

  const gameSlug = hostModule?.slug ?? gamePathPrefix ?? directGameSlug;
  const gameModule = gameSlug ? moduleRegistry.get(gameSlug) ?? hostModule : undefined;
  const routeSegments = hostModule
    ? segments
    : gamePathPrefix
      ? segments.slice(2)
      : directGameSlug
        ? segments.slice(1)
        : segments;
  const routeSegment = routeSegments[0] ?? (gameModule ? 'home' : segments[0] ?? 'home');
  const routeConfig = gameModule?.routes[routeSegment];
  const params = routeConfig
    ? extractPatternParams(routeConfig.pattern, routeSegments)
    : routeSegments.slice(1).reduce<Record<string, string>>((acc, value, index) => {
        acc[`param${index + 1}`] = value;
        return acc;
      }, {});

  return {
    gameSlug,
    gameModule,
    routeSegment,
    params,
  };
}
