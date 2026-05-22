import { tierListRepository } from '../repositories/tier-list.repository';

export class TierListDatasource {
  async getTierListsForGame(gameId: number) {
    return tierListRepository.findByGameId(gameId);
  }

  async getTierListBySlug(gameId: number, slug: string) {
    return tierListRepository.findBySlug(gameId, slug);
  }
}

export const tierListDatasource = new TierListDatasource();
