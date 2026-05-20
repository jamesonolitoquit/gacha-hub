import { characterDatasource } from '../datasources/character.datasource';
import { characterRepository } from '../repositories/character.repository';

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
}

export const characterService = new CharacterService();
