import { evidence } from '../../db/schema';
import { db } from '../db';

export type EvidenceRecord = typeof evidence.$inferSelect;
export type CreateEvidenceInput = typeof evidence.$inferInsert;
export type UpdateEvidenceInput = Partial<CreateEvidenceInput>;

type EvidenceRow = {
  id: number;
  evidence_type: string | null;
  source_url: string | null;
  source_hash: string | null;
  extracted_data: string | null;
  confidence_score: number | null;
  ai_model: string | null;
  game_id: number;
  patch_id: number | null;
  claim_type: string | null;
  is_verified: boolean;
  verified_by: number | null;
  verification_notes: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

function mapEvidenceRow(row: EvidenceRow): EvidenceRecord {
  return {
    id: row.id,
    evidenceType: row.evidence_type,
    sourceUrl: row.source_url,
    sourceHash: row.source_hash,
    extractedData: row.extracted_data,
    confidenceScore: row.confidence_score,
    aiModel: row.ai_model,
    gameId: row.game_id,
    patchId: row.patch_id,
    claimType: row.claim_type,
    isVerified: row.is_verified,
    verifiedBy: row.verified_by,
    verificationNotes: row.verification_notes,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
    deletedAt: row.deleted_at ? new Date(row.deleted_at) : null,
  };
}

export class EvidenceRepository {
  async findByGameId(gameId: number): Promise<EvidenceRecord[]> {
    if (db) {
      const { data, error } = await db
        .from('evidence')
        .select('id, evidence_type, source_url, source_hash, extracted_data, confidence_score, ai_model, game_id, patch_id, claim_type, is_verified, verified_by, verification_notes, created_at, updated_at, deleted_at')
        .eq('game_id', gameId)
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to load evidence for game ${gameId}: ${error.message}`);
      }

      return (data ?? []).map((row) => mapEvidenceRow(row as EvidenceRow));
    }

    return [];
  }

  async findById(id: number): Promise<EvidenceRecord | undefined> {
    if (db) {
      const { data, error } = await db
        .from('evidence')
        .select('id, evidence_type, source_url, source_hash, extracted_data, confidence_score, ai_model, game_id, patch_id, claim_type, is_verified, verified_by, verification_notes, created_at, updated_at, deleted_at')
        .eq('id', id)
        .is('deleted_at', null)
        .maybeSingle();

      if (error) {
        throw new Error(`Failed to load evidence ${id}: ${error.message}`);
      }

      return data ? mapEvidenceRow(data as EvidenceRow) : undefined;
    }

    return undefined;
  }

  async findBySourceHash(sourceHash: string): Promise<EvidenceRecord | undefined> {
    if (db) {
      const { data, error } = await db
        .from('evidence')
        .select('id, evidence_type, source_url, source_hash, extracted_data, confidence_score, ai_model, game_id, patch_id, claim_type, is_verified, verified_by, verification_notes, created_at, updated_at, deleted_at')
        .eq('source_hash', sourceHash)
        .is('deleted_at', null)
        .maybeSingle();

      if (error) {
        throw new Error(`Failed to load evidence by hash: ${error.message}`);
      }

      return data ? mapEvidenceRow(data as EvidenceRow) : undefined;
    }

    return undefined;
  }

  async update(id: number, input: UpdateEvidenceInput): Promise<EvidenceRecord | undefined> {
    if (!db) {
      return undefined;
    }

    const updateData: Record<string, unknown> = {};

    if (input.evidenceType !== undefined) updateData.evidence_type = input.evidenceType;
    if (input.sourceUrl !== undefined) updateData.source_url = input.sourceUrl;
    if (input.sourceHash !== undefined) updateData.source_hash = input.sourceHash;
    if (input.extractedData !== undefined) updateData.extracted_data = input.extractedData;
    if (input.confidenceScore !== undefined) updateData.confidence_score = input.confidenceScore;
    if (input.aiModel !== undefined) updateData.ai_model = input.aiModel;
    if (input.gameId !== undefined) updateData.game_id = input.gameId;
    if (input.patchId !== undefined) updateData.patch_id = input.patchId;
    if (input.claimType !== undefined) updateData.claim_type = input.claimType;
    if (input.isVerified !== undefined) updateData.is_verified = input.isVerified;
    if (input.verifiedBy !== undefined) updateData.verified_by = input.verifiedBy;
    if (input.verificationNotes !== undefined) updateData.verification_notes = input.verificationNotes;
    if (input.deletedAt !== undefined) updateData.deleted_at = input.deletedAt;

    const { data, error } = await db
      .from('evidence')
      .update(updateData)
      .eq('id', id)
      .select('id, evidence_type, source_url, source_hash, extracted_data, confidence_score, ai_model, game_id, patch_id, claim_type, is_verified, verified_by, verification_notes, created_at, updated_at, deleted_at')
      .single();

    if (error) {
      throw new Error(`Failed to update evidence ${id}: ${error.message}`);
    }

    return data ? mapEvidenceRow(data as EvidenceRow) : undefined;
  }

  async create(input: CreateEvidenceInput): Promise<EvidenceRecord> {
    if (!db) {
      throw new Error('Database client not available');
    }

    const { data, error } = await db
      .from('evidence')
      .insert({
        evidence_type: input.evidenceType ?? null,
        source_url: input.sourceUrl ?? null,
        source_hash: input.sourceHash ?? null,
        extracted_data: input.extractedData ?? null,
        confidence_score: input.confidenceScore ?? null,
        ai_model: input.aiModel ?? null,
        game_id: input.gameId,
        patch_id: input.patchId ?? null,
        claim_type: input.claimType ?? null,
        is_verified: input.isVerified ?? false,
        verified_by: input.verifiedBy ?? null,
        verification_notes: input.verificationNotes ?? null,
      })
      .select('id, evidence_type, source_url, source_hash, extracted_data, confidence_score, ai_model, game_id, patch_id, claim_type, is_verified, verified_by, verification_notes, created_at, updated_at, deleted_at')
      .single();

    if (error) {
      throw new Error(`Failed to create evidence: ${error.message}`);
    }

    return mapEvidenceRow(data as EvidenceRow);
  }
}

export const evidenceRepository = new EvidenceRepository();
