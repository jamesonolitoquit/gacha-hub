import { evidenceDatasource } from '../datasources/evidence.datasource';
import { evidenceRepository, type UpdateEvidenceInput } from '../repositories/evidence.repository';

export class EvidenceService {
  async listEvidence(gameId: number) {
    return evidenceDatasource.getEvidenceForGame(gameId);
  }

  async getEvidence(id: number) {
    return evidenceDatasource.getEvidenceById(id);
  }

  async findBySourceHash(sourceHash: string) {
    return evidenceDatasource.findBySourceHash(sourceHash);
  }

  async createEvidence(input: Parameters<typeof evidenceRepository.create>[0]) {
    return evidenceDatasource.createEvidence(input);
  }

  async updateEvidence(id: number, input: UpdateEvidenceInput) {
    return evidenceRepository.update(id, input);
  }
}

export const evidenceService = new EvidenceService();
