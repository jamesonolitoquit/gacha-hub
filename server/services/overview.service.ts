import { overviewRepository, type OverviewStats } from '../repositories/overview.repository';

export class OverviewService {
  async getStats(gameId: number): Promise<OverviewStats> {
    return overviewRepository.getStats(gameId);
  }
}

export const overviewService = new OverviewService();
