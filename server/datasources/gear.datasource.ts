import { gearRepository } from '../repositories/gear.repository';

export class GearDatasource {
  async getGearSetsForGame(gameId: number) {
    return gearRepository.findByGameId(gameId);
  }

  async getGearSetBySlug(gameId: number, slug: string) {
    return gearRepository.findBySlug(gameId, slug);
  }
}

export const gearDatasource = new GearDatasource();
