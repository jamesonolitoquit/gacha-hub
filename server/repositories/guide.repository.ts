import { guides } from '../../db/schema';
import { findSeedGuide, getSeedGuides } from '../bootstrap-data';
import { db } from '../db';

export type GuideRecord = typeof guides.$inferSelect;
export type CreateGuideInput = typeof guides.$inferInsert;

type GuideRow = {
  id: number;
  game_id: number;
  slug: string;
  title: string;
  content: string | null;
  summary: string | null;
  guide_type: string | null;
  character_id: number | null;
  author: string | null;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

function mapGuideRow(row: GuideRow): GuideRecord {
  return {
    id: row.id,
    gameId: row.game_id,
    slug: row.slug,
    title: row.title,
    content: row.content,
    summary: row.summary,
    guideType: row.guide_type,
    characterId: row.character_id,
    author: row.author,
    isVerified: row.is_verified,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
    deletedAt: row.deleted_at ? new Date(row.deleted_at) : null,
  };
}

export class GuideRepository {
  async findByGameId(gameId: number): Promise<GuideRecord[]> {
    if (db) {
      const { data, error } = await db
      .from('guides')
      .select('id, game_id, slug, title, content, summary, guide_type, character_id, author, is_verified, created_at, updated_at, deleted_at')
      .eq('game_id', gameId)
      .is('deleted_at', null)
      .order('title', { ascending: true });

      if (error) {
      throw new Error(`Failed to load guides for game ${gameId}: ${error.message}`);
    }

      return (data ?? []).map((row) => mapGuideRow(row as GuideRow));
    }

    return getSeedGuides(gameId).map((guide, index) => ({
      id: index + 1,
      gameId: guide.gameId,
      slug: guide.slug,
      title: guide.title,
      content: guide.content,
      summary: guide.summary,
      guideType: guide.guideType,
      characterId: null,
      author: 'GachaHub',
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    }));
  }

  async findBySlug(gameId: number, slug: string): Promise<GuideRecord | undefined> {
    if (db) {
      const { data, error } = await db
      .from('guides')
      .select('id, game_id, slug, title, content, summary, guide_type, character_id, author, is_verified, created_at, updated_at, deleted_at')
      .eq('game_id', gameId)
      .eq('slug', slug)
      .is('deleted_at', null)
      .maybeSingle();

      if (error) {
      throw new Error(`Failed to load guide ${slug}: ${error.message}`);
    }

      if (data) {
      return mapGuideRow(data as GuideRow);
      }
    }

    const guide = findSeedGuide(gameId, slug);

    if (!guide) {
      return undefined;
    }

    return {
      id: 1,
      gameId: guide.gameId,
      slug: guide.slug,
      title: guide.title,
      content: guide.content,
      summary: guide.summary,
      guideType: guide.guideType,
      characterId: null,
      author: 'GachaHub',
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };
  }
}

export const guideRepository = new GuideRepository();
