import { tierEntries } from '../../db/schema';
import { findSeedTierEntriesByTierList, findSeedTierEntriesForCharacter, getSeedTierEntries } from '../bootstrap-data';
import { db } from '../db';

export type TierEntryRecord = typeof tierEntries.$inferSelect;
export type CreateTierEntryInput = typeof tierEntries.$inferInsert;

type TierEntryRow = {
  id: number;
  game_id: number;
  character_id: number;
  mode: string;
  tier: string;
  patch_id: number | null;
  previous_tier: string | null;
  tier_list_id: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

function mapTierEntryRow(row: TierEntryRow): TierEntryRecord {
  return {
    id: row.id,
    gameId: row.game_id,
    characterId: row.character_id,
    mode: row.mode,
    tier: row.tier,
    patchId: row.patch_id,
    previousTier: row.previous_tier,
    tierListId: row.tier_list_id,
    notes: row.notes,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
    deletedAt: row.deleted_at ? new Date(row.deleted_at) : null,
  };
}

export class TierEntryRepository {
  async findByTierListId(tierListId: number, gameId: number): Promise<TierEntryRecord[]> {
    if (db) {
      try {
        const { data, error } = await db
          .from('tier_entries')
          .select('id, game_id, character_id, mode, tier, patch_id, previous_tier, tier_list_id, notes, created_at, updated_at, deleted_at')
          .eq('tier_list_id', tierListId)
          .eq('game_id', gameId)
          .is('deleted_at', null)
          .order('tier', { ascending: true });

        if (error) throw new Error(error.message);
        return (data ?? []).map((row) => mapTierEntryRow(row as TierEntryRow));
      } catch {
        // fall through to seed data
      }
    }

    return getSeedTierEntries()
      .filter((e) => e.tierListId === tierListId)
      .map((entry, index) => ({
        id: index + 1,
        gameId: entry.gameId,
        characterId: entry.characterId,
        mode: entry.mode,
        tier: entry.tier,
        patchId: entry.patchId ?? null,
        previousTier: entry.previousTier ?? null,
        tierListId: entry.tierListId ?? null,
        notes: entry.notes ?? null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      }));
  }

  async findByGameIdAndCharacterId(gameId: number, characterId: number): Promise<TierEntryRecord[]> {
    if (db) {
      try {
        const { data, error } = await db
          .from('tier_entries')
          .select('id, game_id, character_id, mode, tier, patch_id, previous_tier, tier_list_id, notes, created_at, updated_at, deleted_at')
          .eq('game_id', gameId)
          .eq('character_id', characterId)
          .is('deleted_at', null)
          .order('mode', { ascending: true });

        if (error) throw new Error(error.message);
        return (data ?? []).map((row) => mapTierEntryRow(row as TierEntryRow));
      } catch {
        // fall through to seed data
      }
    }

    return findSeedTierEntriesForCharacter(gameId, characterId).map((entry, index) => ({
      id: index + 1,
      gameId: entry.gameId,
      characterId: entry.characterId,
      mode: entry.mode,
      tier: entry.tier,
      patchId: entry.patchId ?? null,
      previousTier: entry.previousTier ?? null,
      tierListId: entry.tierListId ?? null,
      notes: entry.notes ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    }));
  }

  async findByGameId(gameId: number): Promise<TierEntryRecord[]> {
    if (db) {
      try {
        const { data, error } = await db
          .from('tier_entries')
          .select('id, game_id, character_id, mode, tier, patch_id, previous_tier, tier_list_id, notes, created_at, updated_at, deleted_at')
          .eq('game_id', gameId)
          .is('deleted_at', null)
          .order('tier', { ascending: true });

        if (error) throw new Error(error.message);
        return (data ?? []).map((row) => mapTierEntryRow(row as TierEntryRow));
      } catch {
        // fall through to seed data
      }
    }

    return getSeedTierEntries()
      .filter((e) => e.gameId === gameId)
      .map((entry, index) => ({
        id: index + 1,
        gameId: entry.gameId,
        characterId: entry.characterId,
        mode: entry.mode,
        tier: entry.tier,
        patchId: entry.patchId ?? null,
        previousTier: entry.previousTier ?? null,
        tierListId: entry.tierListId ?? null,
        notes: entry.notes ?? null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      }));
  }
}

export const tierEntryRepository = new TierEntryRepository();
