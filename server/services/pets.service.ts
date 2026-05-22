import { petDatasource } from '../datasources/pets.datasource';

export class PetService {
  async listPets(gameId: number) {
    return petDatasource.getPetsForGame(gameId);
  }

  async getPetBySlug(gameId: number, slug: string) {
    return petDatasource.getPetBySlug(gameId, slug);
  }
}

export const petService = new PetService();
