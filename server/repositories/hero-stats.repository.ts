import { heroStats } from '../../db/schema';
import { db } from '../db';
import { getSeedHeroStats } from '../bootstrap-data';

export type HeroStatRecord = {
  id: number;
  characterId: number;
  statName: string;
  baseValue: number;
  perLevelValue: number | null;
  maxValue: number | null;
  patchId: number | null;
};

type HeroStatRow = {
  id: number;
  character_id: number;
  stat_name: string;
  base_value: number;
  per_level_value: string | null;
  max_value: number | null;
  patch_id: number | null;
  created_at: string;
  updated_at: string;
};

function mapHeroStatRow(row: HeroStatRow): HeroStatRecord {
  return {
    id: row.id,
    characterId: row.character_id,
    statName: row.stat_name,
    baseValue: row.base_value,
    perLevelValue: row.per_level_value ? Number(row.per_level_value) : null,
    maxValue: row.max_value,
    patchId: row.patch_id,
  };
}

function mapSeedHeroStat(stat: { statName: string; baseValue: number; perLevel: number | null; maxValue: number | null }, characterId: number, index: number): HeroStatRecord {
  return {
    id: index + 1,
    characterId,
    statName: stat.statName,
    baseValue: stat.baseValue,
    perLevelValue: stat.perLevel,
    maxValue: stat.maxValue,
    patchId: null,
  };
}

export class HeroStatsRepository {
  async findByCharacterId(characterId: number): Promise<HeroStatRecord[]> {
    if (db) {
      try {
        const { data, error } = await db
          .from('hero_stats')
          .select('id, character_id, stat_name, base_value, per_level_value, max_value, patch_id, created_at, updated_at')
          .eq('character_id', characterId);

        if (error) {
          throw new Error(error.message);
        }

        if (data && data.length > 0) {
          return (data as HeroStatRow[]).map(mapHeroStatRow);
        }
      } catch {
        // fall through to seed
      }
    }

    const seed = getSeedHeroStats(characterId);
    return seed.map((stat, i) => mapSeedHeroStat(stat, characterId, i));
  }
}

export const heroStatsRepository = new HeroStatsRepository();
