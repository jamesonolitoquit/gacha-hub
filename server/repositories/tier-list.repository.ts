import { tierLists } from '../../db/schema';
import { getGameSlugById } from '../bootstrap-data';
import { seedRegistry } from '../seeds/seed-registry';
import { db } from '../db';

export type TierListRecord = typeof tierLists.$inferSelect;
export type CreateTierListInput = typeof tierLists.$inferInsert;

type TierListRow = {
  id: number;
  game_id: number;
  slug: string;
  title: string;
  tier_type: string | null;
  tiers: string | null;
  created_by: number | null;
  is_community: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

function mapTierListRow(row: TierListRow): TierListRecord {
  return {
    id: row.id,
    gameId: row.game_id,
    slug: row.slug,
    title: row.title,
    tierType: row.tier_type,
    tiers: row.tiers,
    createdBy: row.created_by,
    isCommunity: row.is_community,
    viewCount: row.view_count,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
    deletedAt: row.deleted_at ? new Date(row.deleted_at) : null,
  };
}

export class TierListRepository {
  async findByGameId(gameId: number): Promise<TierListRecord[]> {
    if (db) {
      try {
        const { data, error } = await db
        .from('tier_lists')
        .select('id, game_id, slug, title, tier_type, tiers, created_by, is_community, view_count, created_at, updated_at, deleted_at')
        .eq('game_id', gameId)
        .is('deleted_at', null)
        .order('title', { ascending: true });

        if (error) throw new Error(`Failed to load tier lists for game ${gameId}: ${error.message}`);

        return (data ?? []).map((row) => mapTierListRow(row as TierListRow));
      } catch {
        // fall through to seed data
      }
    }

    const slug = getGameSlugById(gameId);
    if (!slug) return [];
    return seedRegistry.getTierLists(slug).map((tierList, index) => ({
      id: index + 1,
      gameId: tierList.gameId,
      slug: tierList.slug,
      title: tierList.title,
      tierType: tierList.tierType,
      tiers: tierList.tiers,
      createdBy: null,
      isCommunity: true,
      viewCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    }));
  }

  async findBySlug(gameId: number, slug: string): Promise<TierListRecord | undefined> {
    if (db) {
      try {
        const { data, error } = await db
        .from('tier_lists')
        .select('id, game_id, slug, title, tier_type, tiers, created_by, is_community, view_count, created_at, updated_at, deleted_at')
        .eq('game_id', gameId)
        .eq('slug', slug)
        .is('deleted_at', null)
        .maybeSingle();

        if (error) throw new Error(`Failed to load tier list ${slug}: ${error.message}`);

        if (data) {
        return mapTierListRow(data as TierListRow);
        }
      } catch {
        // fall through to seed data
      }
    }

    const gameSlug = getGameSlugById(gameId);
    if (!gameSlug) return undefined;
    const tierList = seedRegistry.getTierLists(gameSlug).find((t) => t.slug === slug);

    if (!tierList) {
      return undefined;
    }

    return {
      id: 1,
      gameId: tierList.gameId,
      slug: tierList.slug,
      title: tierList.title,
      tierType: tierList.tierType,
      tiers: tierList.tiers,
      createdBy: null,
      isCommunity: true,
      viewCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };
  }
}

export const tierListRepository = new TierListRepository();
