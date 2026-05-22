import { characterRepository } from '../repositories/character.repository';

export class CharacterDatasource {
  async getCharactersForGame(gameId: number) {
    return characterRepository.findByGameId(gameId);
  }

  async getCharacter(gameId: number, slug: string) {
    return characterRepository.findBySlug(gameId, slug);
  }

  async getCharactersForGamePaged(gameId: number, opts: { page?: number; limit?: number; search?: string; rarity?: string | number; role?: string }) {
    return characterRepository.findByGameIdPaged(gameId, opts);
  }
}

export const characterDatasource = new CharacterDatasource();
