import { tierEntryRepository } from '../repositories/tier-entry.repository';

export class TierEntryService {
  async getEntriesForTierList(tierListId: number, gameId: number) {
    return tierEntryRepository.findByTierListId(tierListId, gameId);
  }

  async getTiersForCharacter(gameId: number, characterId: number) {
    return tierEntryRepository.findByGameIdAndCharacterId(gameId, characterId);
  }

  async getEntriesForGame(gameId: number) {
    return tierEntryRepository.findByGameId(gameId);
  }
}

export const tierEntryService = new TierEntryService();
