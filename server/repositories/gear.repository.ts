import { gear } from '../../db/schema';
import { findSeedGear, getSeedGear } from '../bootstrap-data';
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

    return getSeedGear(gameId).map((g) => ({
      id: g.id,
      gameId: g.gameId,
      slug: g.slug,
      name: g.name,
      source: g.source,
      twoPieceEffect: g.twoPieceEffect,
      fourPieceEffect: g.fourPieceEffect,
      description: g.description,
      iconUrl: g.iconUrl,
      tags: g.tags,
      patchId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    }));
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

    const gearItem = findSeedGear(gameId, slug);

    if (!gearItem) {
      return undefined;
    }

    return {
      id: gearItem.id,
      gameId: gearItem.gameId,
      slug: gearItem.slug,
      name: gearItem.name,
      source: gearItem.source,
      twoPieceEffect: gearItem.twoPieceEffect,
      fourPieceEffect: gearItem.fourPieceEffect,
      description: gearItem.description,
      iconUrl: gearItem.iconUrl,
      tags: gearItem.tags,
      patchId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };
  }
}

export const gearRepository = new GearRepository();
