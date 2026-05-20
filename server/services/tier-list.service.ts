import { tierListRepository } from '../repositories/tier-list.repository';

export class TierListService {
  async listTierLists(gameId: number) {
    return tierListRepository.findByGameId(gameId);
  }

  async getTierList(gameId: number, slug: string) {
    return tierListRepository.findBySlug(gameId, slug);
  }
}

export const tierListService = new TierListService();
