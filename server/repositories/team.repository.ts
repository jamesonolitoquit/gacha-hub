import { teams } from '../../db/schema';
import { getGameSlugById } from '../bootstrap-data';
import { seedRegistry } from '../seeds/seed-registry';
import { db } from '../db';
import type { NormalizedTeam } from '../seeds/types';

export type TeamRecord = typeof teams.$inferSelect;
export type CreateTeamInput = typeof teams.$inferInsert;

type TeamRow = {
  id: number;
  game_id: number;
  slug: string | null;
  name: string;
  character_ids: string;
  synergy_score: number | null;
  power_level: number | null;
  purpose: string | null;
  difficulty: string | null;
  evidence_id: number | null;
  gear_recommendations: Record<string, unknown> | null;
  notes: string | null;
  patch_id: number | null;
  created_by: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

function mapTeamRow(row: TeamRow): TeamRecord {
  return {
    id: row.id,
    gameId: row.game_id,
    slug: row.slug,
    name: row.name,
    characterIds: row.character_ids,
    synergyScore: row.synergy_score,
    powerLevel: row.power_level,
    purpose: row.purpose,
    difficulty: row.difficulty,
    evidenceId: row.evidence_id,
    gearRecommendations: row.gear_recommendations,
    notes: row.notes,
    patchId: row.patch_id,
    createdBy: row.created_by,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
    deletedAt: row.deleted_at ? new Date(row.deleted_at) : null,
  };
}

function mapSeedTeam(seed: NormalizedTeam, gameId: number, index: number): TeamRecord {
  return {
    id: index + 1,
    gameId: seed.gameId,
    slug: seed.slug,
    name: seed.name,
    characterIds: seed.characterIds,
    synergyScore: seed.synergyScore,
    powerLevel: seed.powerLevel,
    purpose: seed.purpose,
    difficulty: seed.difficulty,
    evidenceId: null,
    gearRecommendations: (seed.gearRecommendations as Record<string, unknown>) ?? null,
    notes: seed.notes ?? null,
    patchId: null,
    createdBy: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };
}

export class TeamRepository {
  async findByGameId(gameId: number): Promise<TeamRecord[]> {
    if (db) {
      try {
        const { data, error } = await db
          .from('teams')
          .select('id, game_id, slug, name, character_ids, synergy_score, power_level, purpose, difficulty, gear_recommendations, notes, evidence_id, patch_id, created_by, created_at, updated_at, deleted_at')
          .eq('game_id', gameId)
          .is('deleted_at', null)
          .order('created_at', { ascending: false });

        if (error) {
          throw new Error(`Failed to load teams for game ${gameId}: ${error.message}`);
        }

        if (data && data.length > 0) {
          return (data as TeamRow[]).map(mapTeamRow);
        }
      } catch {
        // fall through to seed
      }
    }

    const slug = getGameSlugById(gameId);
    if (!slug) return [];
    return seedRegistry.getTeams(slug).map((t, i) => mapSeedTeam(t, gameId, i));
  }

  async findBySlug(gameId: number, slug: string): Promise<TeamRecord | undefined> {
    if (db) {
      try {
        const { data, error } = await db
          .from('teams')
          .select('id, game_id, slug, name, character_ids, synergy_score, power_level, purpose, difficulty, gear_recommendations, notes, evidence_id, patch_id, created_by, created_at, updated_at, deleted_at')
          .eq('game_id', gameId)
          .eq('slug', slug)
          .is('deleted_at', null)
          .maybeSingle();

        if (error) {
          throw new Error(`Failed to load team ${slug}: ${error.message}`);
        }

        if (data) {
          return mapTeamRow(data as TeamRow);
        }
      } catch {
        // fall through to seed
      }
    }

    const gameSlug = getGameSlugById(gameId);
    if (!gameSlug) return undefined;
    const seed = seedRegistry.getTeams(gameSlug).find((t) => t.slug === slug);
    if (!seed) return undefined;
    return mapSeedTeam(seed, gameId, 0);
  }

  async create(input: CreateTeamInput): Promise<TeamRecord> {
    if (!db) {
      throw new Error('Database client not available');
    }

    const { data, error } = await db
      .from('teams')
      .insert({
        game_id: input.gameId,
        slug: input.slug ?? null,
        name: input.name,
        character_ids: input.characterIds,
        synergy_score: input.synergyScore ?? null,
        power_level: input.powerLevel ?? null,
        purpose: input.purpose ?? null,
        difficulty: input.difficulty ?? null,
        evidence_id: input.evidenceId ?? null,
        created_by: input.createdBy ?? null,
      })
      .select('id, game_id, slug, name, character_ids, synergy_score, power_level, purpose, difficulty, gear_recommendations, notes, evidence_id, patch_id, created_by, created_at, updated_at, deleted_at')
      .single();

    if (error) {
      throw new Error(`Failed to create team: ${error.message}`);
    }

    return mapTeamRow(data as TeamRow);
  }
}

export const teamRepository = new TeamRepository();
