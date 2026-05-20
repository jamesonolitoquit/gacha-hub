import { gameRepository } from '../repositories/game.repository';

export class GameDatasource {
  async getAllGames() {
    return gameRepository.findAll();
  }

  async getGameBySlug(slug: string) {
    return gameRepository.findBySlug(slug);
  }
}

export const gameDatasource = new GameDatasource();
