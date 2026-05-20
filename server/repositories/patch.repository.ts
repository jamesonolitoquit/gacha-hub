import { patches } from '../../db/schema';
import { findSeedPatch, getSeedPatches } from '../bootstrap-data';
import { db } from '../db';

export type PatchRecord = typeof patches.$inferSelect;
export type CreatePatchInput = typeof patches.$inferInsert;

type PatchRow = {
  id: number;
  game_id: number;
  version: string;
  title: string | null;
  notes: string | null;
  release_date: string;
  changes: string | null;
  created_at: string;
  updated_at: string;
};

function mapPatchRow(row: PatchRow): PatchRecord {
  return {
    id: row.id,
    gameId: row.game_id,
    version: row.version,
    title: row.title,
    notes: row.notes,
    releaseDate: new Date(row.release_date),
    changes: row.changes,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

export class PatchRepository {
  async findByGameId(gameId: number): Promise<PatchRecord[]> {
    if (db) {
      const { data, error } = await db
        .from('patches')
        .select('id, game_id, version, title, notes, release_date, changes, created_at, updated_at')
        .eq('game_id', gameId)
        .order('release_date', { ascending: false });

      if (error) {
        throw new Error(`Failed to load patches for game ${gameId}: ${error.message}`);
      }

      return (data ?? []).map((row) => mapPatchRow(row as PatchRow));
    }

    return getSeedPatches(gameId).map((patch, index) => ({
      id: index + 1,
      gameId: patch.gameId,
      version: patch.version,
      title: patch.title,
      notes: patch.notes,
      releaseDate: new Date(patch.releaseDate),
      changes: patch.changes,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
  }

  async findByVersion(gameId: number, version: string): Promise<PatchRecord | undefined> {
    if (db) {
      const { data, error } = await db
        .from('patches')
        .select('id, game_id, version, title, notes, release_date, changes, created_at, updated_at')
        .eq('game_id', gameId)
        .eq('version', version)
        .maybeSingle();

      if (error) {
        throw new Error(`Failed to load patch ${version} for game ${gameId}: ${error.message}`);
      }

      return data ? mapPatchRow(data as PatchRow) : undefined;
    }

    const seedPatch = findSeedPatch(gameId, version);

    if (!seedPatch) {
      return undefined;
    }

    return {
      id: 1,
      gameId: seedPatch.gameId,
      version: seedPatch.version,
      title: seedPatch.title,
      notes: seedPatch.notes,
      releaseDate: new Date(seedPatch.releaseDate),
      changes: seedPatch.changes,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async create(input: CreatePatchInput): Promise<PatchRecord> {
    if (!db) {
      throw new Error('Database client not available');
    }

    const { data, error } = await db
      .from('patches')
      .insert(input)
      .select('id, game_id, version, title, notes, release_date, changes, created_at, updated_at')
      .single();

    if (error) {
      throw new Error(`Failed to create patch: ${error.message}`);
    }

    return mapPatchRow(data as PatchRow);
  }
}

export const patchRepository = new PatchRepository();
