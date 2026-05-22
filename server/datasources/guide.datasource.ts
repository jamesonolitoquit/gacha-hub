import { guideRepository } from '../repositories/guide.repository';

export class GuideDatasource {
  async getGuidesForGame(gameId: number) {
    return guideRepository.findByGameId(gameId);
  }

  async getGuideBySlug(gameId: number, slug: string) {
    return guideRepository.findBySlug(gameId, slug);
  }

  async getGuidesForCharacter(characterId: number, gameId: number) {
    const guides = await guideRepository.findByGameId(gameId);
    return guides.filter((guide) => guide.characterId === characterId);
  }
}

export const guideDatasource = new GuideDatasource();
