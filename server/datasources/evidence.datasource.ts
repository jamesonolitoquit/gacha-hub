import { evidenceRepository } from '../repositories/evidence.repository';

export class EvidenceDatasource {
  async getEvidenceForGame(gameId: number) {
    return evidenceRepository.findByGameId(gameId);
  }

  async getEvidenceById(id: number) {
    return evidenceRepository.findById(id);
  }

  async findBySourceHash(sourceHash: string) {
    return evidenceRepository.findBySourceHash(sourceHash);
  }

  async createEvidence(input: typeof evidenceRepository.create extends (input: infer T) => any ? T : never) {
    return evidenceRepository.create(input as any);
  }
}

export const evidenceDatasource = new EvidenceDatasource();
