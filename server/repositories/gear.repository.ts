import { gear } from '../../db/schema';
import { getGameSlugById } from '../bootstrap-data';
import { seedRegistry } from '../seeds/seed-registry';
import { db } from '../db';

export type GearRecord = typeof gear.$inferSelect;
export type CreateGearInput = typeof gear.$inferInsert;

type GearRow = {
  id: number;
  game_id: number;
  slug: string;
  name: string;
  source: string | null;
  two_piece_effect: string | null;
  four_piece_effect: string | null;
  description: string | null;
  icon_url: string | null;
  tags: string[] | null;
  patch_id: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

function mapGearRow(row: GearRow): GearRecord {
  return {
    id: row.id,
    gameId: row.game_id,
    slug: row.slug,
    name: row.name,
    source: row.source,
    twoPieceEffect: row.two_piece_effect,
    fourPieceEffect: row.four_piece_effect,
    description: row.description,
    iconUrl: row.icon_url,
    tags: row.tags ?? null,
    patchId: row.patch_id,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
    deletedAt: row.deleted_at ? new Date(row.deleted_at) : null,
  };
}

export class GearRepository {
  async findByGameId(gameId: number): Promise<GearRecord[]> {
    if (db) {
      try {
        const { data, error } = await db
          .from('gear')
          .select('id, game_id, slug, name, source, two_piece_effect, four_piece_effect, description, icon_url, tags, patch_id, created_at, updated_at, deleted_at')
          .eq('game_id', gameId)
          .is('deleted_at', null)
          .order('name', { ascending: true });

        if (error) throw new Error(`Failed to load gear for game ${gameId}: ${error.message}`);

        return (data ?? []).map((row) => mapGearRow(row as GearRow));
      } catch {
        // fall through to seed data
      }
    }

    const slug = getGameSlugById(gameId);
    if (!slug) return [];
    return seedRegistry.getGear(slug) as GearRecord[];
  }

  async findBySlug(gameId: number, slug: string): Promise<GearRecord | undefined> {
    if (db) {
      try {
        const { data, error } = await db
          .from('gear')
          .select('id, game_id, slug, name, source, two_piece_effect, four_piece_effect, description, icon_url, tags, patch_id, created_at, updated_at, deleted_at')
          .eq('game_id', gameId)
          .eq('slug', slug)
          .is('deleted_at', null)
          .maybeSingle();

        if (error) throw new Error(`Failed to load gear ${slug}: ${error.message}`);

        if (data) {
          return mapGearRow(data as GearRow);
        }
      } catch {
        // fall through to seed data
      }
    }

    const gameSlug = getGameSlugById(gameId);
    if (!gameSlug) return undefined;
    const all = seedRegistry.getGear(gameSlug);
    return all.find((g) => g.slug === slug) as GearRecord | undefined;
  }
}

export const gearRepository = new GearRepository();
