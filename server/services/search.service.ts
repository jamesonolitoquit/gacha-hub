import { moduleRegistry } from '../../core/module-registry';
import type { GameModule } from '../../core/types';
import { getSeedCharactersByGameSlug } from '../bootstrap-data';

export type SearchScope = 'all' | 'game';

export type SearchResult = {
  type: 'game' | 'module' | 'character';
  title: string;
  slug: string;
  description: string;
  score: number;
  game?: GameModule;
};

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function scoreCandidate(query: string, candidate: string) {
  const normalizedQuery = normalize(query);
  const normalizedCandidate = normalize(candidate);

  if (!normalizedQuery) {
    return 0;
  }

  if (normalizedCandidate === normalizedQuery) {
    return 100;
  }

  if (normalizedCandidate.includes(normalizedQuery)) {
    return 80;
  }

  const candidateWords = normalizedCandidate.split(/[^a-z0-9]+/g).filter(Boolean);
  const queryWords = normalizedQuery.split(/[^a-z0-9]+/g).filter(Boolean);
  const sharedWords = queryWords.filter((word) => candidateWords.includes(word)).length;

  return sharedWords > 0 ? 50 + sharedWords * 5 : 0;
}

export class SearchService {
  search(query: string, scope: SearchScope = 'all', gameSlug?: string): SearchResult[] {
    const modules = moduleRegistry.list();
    const narrowedModules = scope === 'game' && gameSlug ? modules.filter((module) => module.slug === gameSlug || module.id === gameSlug) : modules;

    const results = narrowedModules.flatMap((module) => {
      const gameScore = Math.max(
        scoreCandidate(query, module.name),
        scoreCandidate(query, module.slug),
        scoreCandidate(query, module.subdomain),
      );

      const moduleResult: SearchResult[] = gameScore > 0
        ? [{
            type: 'game',
            title: module.name,
            slug: module.slug,
            description: `Platform entry for ${module.name}`,
            score: gameScore,
            game: module,
          }]
        : [];

      const characterResults = getSeedCharactersByGameSlug(module.slug)
        .map((character) => ({
          type: 'character' as const,
          title: character.name,
          slug: character.slug,
          description: character.description,
          score: Math.max(scoreCandidate(query, character.name), scoreCandidate(query, character.slug)),
          game: module,
        }))
        .filter((result) => result.score > 0);

      return [...moduleResult, ...characterResults];
    });

    return results.sort((left, right) => right.score - left.score);
  }
}

export const searchService = new SearchService();
