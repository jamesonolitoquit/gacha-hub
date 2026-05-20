import { gameDatasource } from '../datasources/game.datasource';

export class GameService {
  async listGames() {
    return gameDatasource.getAllGames();
  }

  async getGameBySlug(slug: string) {
    return gameDatasource.getGameBySlug(slug);
  }
}

export const gameService = new GameService();
