import { moduleRegistry } from '../../core/module-registry';
import type { GameModule } from '../../core/types';
import { gameService } from './game.service';
import { characterService } from './character.service';
import { skillService } from './skill.service';
import { guideService } from './guide.service';
import { gearService } from './gear.service';
import { petService } from './pets.service';

export type SearchScope = 'all' | 'game';

export type SearchResult = {
  type: 'game' | 'character' | 'skill' | 'guide' | 'gear' | 'pet';
  title: string;
  slug: string;
  description: string;
  score: number;
  game?: GameModule;
  href?: string;
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
  async search(query: string, scope: SearchScope = 'all', gameSlug?: string): Promise<SearchResult[]> {
    const modules = moduleRegistry.list();
    const narrowedModules = scope === 'game' && gameSlug
      ? modules.filter((module) => module.slug === gameSlug || module.id === gameSlug)
      : modules;

    const results: SearchResult[] = [];

    for (const module of narrowedModules) {
      const gameScore = Math.max(
        scoreCandidate(query, module.name),
        scoreCandidate(query, module.slug),
        scoreCandidate(query, module.subdomain),
      );

      if (gameScore > 0) {
        results.push({
          type: 'game',
          title: module.name,
          slug: module.slug,
          description: `Platform entry for ${module.name}`,
          score: gameScore,
          game: module,
          href: `/games/${module.slug}`,
        });
      }

      const gameRecord = await gameService.getGameBySlug(module.slug);
      if (!gameRecord) continue;

      const [characters, groupedSkills, guides, gearSets, pets] = await Promise.all([
        characterService.listCharacters(gameRecord.id),
        skillService.listSkillsForGame(gameRecord.id),
        guideService.listGuides(gameRecord.id),
        gearService.listGearSets(gameRecord.id),
        petService.listPets(gameRecord.id),
      ]);

      for (const c of characters) {
        const s = Math.max(scoreCandidate(query, c.name), scoreCandidate(query, c.slug));
        if (s > 0) {
          results.push({
            type: 'character',
            title: c.name,
            slug: c.slug,
            description: [c.characterClass, c.role, c.element].filter(Boolean).join(' \u00B7 '),
            score: s,
            game: module,
            href: `/games/${module.slug}/characters/${c.slug}`,
          });
        }
      }

      for (const group of groupedSkills) {
        for (const skill of group.skills) {
          const s = Math.max(
            scoreCandidate(query, skill.name),
            scoreCandidate(query, skill.slug),
            scoreCandidate(query, skill.type ?? ''),
          );
          if (s > 0) {
            results.push({
              type: 'skill',
              title: skill.name,
              slug: skill.slug,
              description: [skill.type, skill.powerType, skill.targets].filter(Boolean).join(' \u00B7 '),
              score: s,
              game: module,
              href: `/games/${module.slug}/characters/${group.characterSlug}`,
            });
          }
        }
      }

      for (const g of guides) {
        const s = Math.max(
          scoreCandidate(query, g.title),
          scoreCandidate(query, g.slug),
          scoreCandidate(query, g.guideType ?? ''),
        );
        if (s > 0) {
          results.push({
            type: 'guide',
            title: g.title,
            slug: g.slug,
            description: g.summary ?? '',
            score: s,
            game: module,
            href: `/games/${module.slug}/guides/${g.slug}`,
          });
        }
      }

      for (const g of gearSets) {
        const s = Math.max(scoreCandidate(query, g.name), scoreCandidate(query, g.slug));
        if (s > 0) {
          results.push({
            type: 'gear',
            title: g.name,
            slug: g.slug,
            description: g.twoPieceEffect ?? g.description ?? '',
            score: s,
            game: module,
            href: `/games/${module.slug}/database/gear`,
          });
        }
      }

      for (const p of pets) {
        const s = Math.max(scoreCandidate(query, p.name), scoreCandidate(query, p.slug));
        if (s > 0) {
          results.push({
            type: 'pet',
            title: p.name,
            slug: p.slug,
            description: [p.rarity, p.faction].filter(Boolean).join(' \u00B7 '),
            score: s,
            game: module,
            href: `/games/${module.slug}/database/pets`,
          });
        }
      }
    }

    return results.sort((left, right) => right.score - left.score);
  }
}

export const searchService = new SearchService();
