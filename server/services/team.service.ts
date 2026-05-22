import { teamDatasource } from '../datasources/team.datasource';
import { teamRepository } from '../repositories/team.repository';

export class TeamService {
  async listTeams(gameId: number) {
    return teamDatasource.getTeamsForGame(gameId);
  }

  async getTeam(gameId: number, slug: string) {
    return teamDatasource.getTeamBySlug(gameId, slug);
  }

  async createTeam(input: Parameters<typeof teamRepository.create>[0]) {
    return teamRepository.create(input);
  }
}

export const teamService = new TeamService();
