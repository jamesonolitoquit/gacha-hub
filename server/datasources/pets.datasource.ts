import { petRepository } from '../repositories/pets.repository';

export class PetDatasource {
  async getPetsForGame(gameId: number) {
    return petRepository.findByGameId(gameId);
  }

  async getPetBySlug(gameId: number, slug: string) {
    return petRepository.findBySlug(gameId, slug);
  }
}

export const petDatasource = new PetDatasource();
