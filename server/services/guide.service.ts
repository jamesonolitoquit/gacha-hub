import { guideRepository } from '../repositories/guide.repository';

export class GuideService {
  async listGuides(gameId: number, characterId?: number) {
    if (characterId != null) {
      return guideRepository.findByGameIdAndCharacterId(gameId, characterId);
    }
    return guideRepository.findByGameId(gameId);
  }

  async getGuide(gameId: number, slug: string) {
    return guideRepository.findBySlug(gameId, slug);
  }
}

export const guideService = new GuideService();
