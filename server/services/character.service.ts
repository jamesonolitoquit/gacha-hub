import { characterDatasource } from '../datasources/character.datasource';
import { characterRepository } from '../repositories/character.repository';
import { heroStatsDatasource } from '../datasources/hero-stats.datasource';

export type StatValue = {
  statName: string;
  value: number;
  perLevel?: number;
  maxValue?: number;
};

export class CharacterService {
  async listCharacters(gameId: number) {
    return characterDatasource.getCharactersForGame(gameId);
  }

  async getCharacter(gameId: number, slug: string) {
    return characterDatasource.getCharacter(gameId, slug);
  }

  async getCharacterById(gameId: number, id: number) {
    return characterRepository.findById(gameId, id);
  }

  async listCharactersPaged(gameId: number, opts: { page?: number; limit?: number; search?: string; rarity?: string | number; role?: string }) {
    return characterDatasource.getCharactersForGamePaged(gameId, opts);
  }

  async getCharacterStats(characterId: number): Promise<StatValue[]> {
    const rows = await heroStatsDatasource.getStatsForCharacter(characterId);
    return rows.map((r) => ({
      statName: r.statName,
      value: r.baseValue,
      perLevel: r.perLevelValue ?? undefined,
      maxValue: r.maxValue ?? undefined,
    }));
  }
}

export const characterService = new CharacterService();
