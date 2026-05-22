import { gearDatasource } from '../datasources/gear.datasource';

export class GearService {
  async listGearSets(gameId: number) {
    return gearDatasource.getGearSetsForGame(gameId);
  }

  async getGearSetBySlug(gameId: number, slug: string) {
    return gearDatasource.getGearSetBySlug(gameId, slug);
  }
}

export const gearService = new GearService();
