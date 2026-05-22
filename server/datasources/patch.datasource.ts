import { patchRepository } from '../repositories/patch.repository';

export class PatchDatasource {
  async getPatchesForGame(gameId: number) {
    return patchRepository.findByGameId(gameId);
  }

  async getPatchByVersion(gameId: number, version: string) {
    return patchRepository.findByVersion(gameId, version);
  }

  async getLatestPatch(gameId: number) {
    const patches = await patchRepository.findByGameId(gameId);
    return patches[0] ?? null;
  }
}

export const patchDatasource = new PatchDatasource();
