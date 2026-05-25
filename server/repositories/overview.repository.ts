import { db } from '../db';
import { getGameSlugById } from '../bootstrap-data';
import { seedRegistry } from '../seeds/seed-registry';

export type OverviewStats = {
  heroes: number;
  skills: number;
  gearSets: number;
  pets: number;
  guides: number;
  tierLists: number;
  teams: number;
};

export class OverviewRepository {
  async getStats(gameId: number): Promise<OverviewStats> {
    if (!db) return this.getFallbackStats(gameId);

    try {
      const charIdsResult = await db
        .from('characters')
        .select('id')
        .eq('game_id', gameId)
        .is('deleted_at', null);

      const characterIds: number[] = [];
      if (charIdsResult.data) {
        for (const row of charIdsResult.data) {
          characterIds.push(row.id);
        }
      }

      let skills = 0;
      if (characterIds.length > 0) {
        const skillsResult = await db
          .from('skills')
          .select('*', { count: 'exact', head: true })
          .in('character_id', characterIds)
          .is('deleted_at', null);
        skills = skillsResult.count ?? 0;
      }

      const [heroesResult, gearResult, petsResult, guidesResult, tierListsResult, teamsResult] = await Promise.all([
        db.from('characters').select('*', { count: 'exact', head: true }).eq('game_id', gameId).is('deleted_at', null),
        db.from('gear').select('*', { count: 'exact', head: true }).eq('game_id', gameId).is('deleted_at', null),
        db.from('pets').select('*', { count: 'exact', head: true }).eq('game_id', gameId).is('deleted_at', null),
        db.from('guides').select('*', { count: 'exact', head: true }).eq('game_id', gameId).is('deleted_at', null),
        db.from('tier_lists').select('*', { count: 'exact', head: true }).eq('game_id', gameId).is('deleted_at', null),
        db.from('teams').select('*', { count: 'exact', head: true }).eq('game_id', gameId).is('deleted_at', null),
      ]);

      return {
        heroes: heroesResult.count ?? 0,
        skills,
        gearSets: gearResult.count ?? 0,
        pets: petsResult.count ?? 0,
        guides: guidesResult.count ?? 0,
        tierLists: tierListsResult.count ?? 0,
        teams: teamsResult.count ?? 0,
      };
    } catch {
      return this.getFallbackStats(gameId);
    }
  }

  private getFallbackStats(gameId: number): OverviewStats {
    const slug = getGameSlugById(gameId);
    if (!slug) return { heroes: 0, skills: 0, gearSets: 0, pets: 0, guides: 0, tierLists: 0, teams: 0 };
    const chars = seedRegistry.getCharacters(slug);
    const charIds = chars.map((c) => c.id);
    const allSkills = seedRegistry.getSkills(slug);
    return {
      heroes: chars.length,
      skills: allSkills.filter((s) => charIds.includes(s.characterId)).length,
      gearSets: seedRegistry.getGear(slug).length,
      pets: seedRegistry.getPets(slug).length,
      guides: 0,
      tierLists: seedRegistry.getTierLists(slug).length,
      teams: seedRegistry.getTeams(slug).length,
    };
  }
}

export const overviewRepository = new OverviewRepository();
