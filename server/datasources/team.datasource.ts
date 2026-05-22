import { teamRepository } from '../repositories/team.repository';

export class TeamDatasource {
  async getTeamsForGame(gameId: number) {
    return teamRepository.findByGameId(gameId);
  }

  async getTeamBySlug(gameId: number, slug: string) {
    return teamRepository.findBySlug(gameId, slug);
  }
}

export const teamDatasource = new TeamDatasource();
