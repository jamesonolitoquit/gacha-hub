import { patchRepository } from '../repositories/patch.repository';

export class PatchService {
  async listPatchesForGame(gameId: number) {
    return patchRepository.findByGameId(gameId);
  }

  async getPatch(gameId: number, version: string) {
    return patchRepository.findByVersion(gameId, version);
  }
}

export const patchService = new PatchService();
