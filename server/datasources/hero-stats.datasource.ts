import { heroStatsRepository } from '../repositories/hero-stats.repository';

export type HeroStatRow = {
  id: number;
  characterId: number;
  statName: string;
  baseValue: number;
  perLevelValue: number | null;
  maxValue: number | null;
  patchId: number | null;
};

export class HeroStatsDatasource {
  async getStatsForCharacter(characterId: number): Promise<HeroStatRow[]> {
    return heroStatsRepository.findByCharacterId(characterId);
  }
}

export const heroStatsDatasource = new HeroStatsDatasource();
