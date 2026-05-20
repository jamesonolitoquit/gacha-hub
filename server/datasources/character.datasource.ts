import { characterRepository } from '../repositories/character.repository';

export class CharacterDatasource {
  async getCharactersForGame(gameId: number) {
    return characterRepository.findByGameId(gameId);
  }

  async getCharacter(gameId: number, slug: string) {
    return characterRepository.findBySlug(gameId, slug);
  }
}

export const characterDatasource = new CharacterDatasource();
