import { games } from '../../db/schema';
import { moduleRegistry } from '../../core/module-registry';
import { db } from '../db';

export type GameRecord = typeof games.$inferSelect;
export type CreateGameInput = typeof games.$inferInsert;

type GameRow = {
  id: number;
  slug: string;
  name: string;
  subdomain: string | null;
  icon_url: string | null;
  banner_url: string | null;
  description: string | null;
  status: string | null;
  release_date: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

function mapGameRow(row: GameRow): GameRecord {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    subdomain: row.subdomain,
    iconUrl: row.icon_url,
    bannerUrl: row.banner_url,
    description: row.description,
    status: row.status,
    releaseDate: row.release_date ? new Date(row.release_date) : null,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
    deletedAt: row.deleted_at ? new Date(row.deleted_at) : null,
  };
}

function mapRuntimeModuleToGameRecord(module: { slug: string; name: string; subdomain: string; bannerUrl?: string }, index: number): GameRecord {
  return {
    id: index + 1,
    slug: module.slug,
    name: module.name,
    subdomain: module.subdomain,
    iconUrl: null,
    bannerUrl: module.bannerUrl ?? null,
    description: `Runtime module for ${module.name}`,
    status: 'active',
    releaseDate: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };
}

function mapRuntimeGames(): GameRecord[] {
  return moduleRegistry.list().map((module, index) => mapRuntimeModuleToGameRecord(module, index));
}

export class GameRepository {
  async findAll(): Promise<GameRecord[]> {
    if (db) {
      try {
        const { data, error } = await db
          .from('games')
          .select('id, slug, name, subdomain, icon_url, banner_url, description, status, release_date, created_at, updated_at, deleted_at')
          .is('deleted_at', null)
          .order('name', { ascending: true });

        if (error) {
          throw new Error(error.message);
        }

        return (data ?? []).map((row) => mapGameRow(row as GameRow));
      } catch {
        return mapRuntimeGames();
      }
    }

    return mapRuntimeGames();
  }

  async findBySlug(slug: string): Promise<GameRecord | undefined> {
    if (db) {
      try {
        const { data, error } = await db
          .from('games')
          .select('id, slug, name, subdomain, icon_url, banner_url, description, status, release_date, created_at, updated_at, deleted_at')
          .eq('slug', slug)
          .is('deleted_at', null)
          .maybeSingle();

        if (error) {
          throw new Error(error.message);
        }

        if (data) {
          return mapGameRow(data as GameRow);
        }
        // If no database record found, fall through to runtime module registry
      } catch {
        // Fall back to runtime module metadata when the Supabase schema is unavailable.
      }
    }

    const module = moduleRegistry.get(slug);

    if (!module) {
      return undefined;
    }

    const runtimeIndex = moduleRegistry.list().findIndex((entry) => entry.slug === module.slug);
    return mapRuntimeModuleToGameRecord(module, runtimeIndex >= 0 ? runtimeIndex : 0);
  }

  async create(input: CreateGameInput): Promise<GameRecord> {
    if (db) {
      const { data, error } = await db
        .from('games')
        .insert({
          slug: input.slug,
          name: input.name,
          subdomain: input.subdomain ?? null,
          icon_url: input.iconUrl ?? null,
          banner_url: input.bannerUrl ?? null,
          description: input.description ?? null,
          status: input.status ?? null,
          release_date: input.releaseDate ?? null,
        })
        .select('id, slug, name, subdomain, icon_url, banner_url, description, status, release_date, created_at, updated_at, deleted_at')
        .single();

      if (error) {
        throw new Error(`Failed to create game ${input.slug ?? 'unknown'}: ${error.message}`);
      }

      if (data) {
        return mapGameRow(data as GameRow);
      }
    }

    throw new Error('Database client not available');
  }
}

export const gameRepository = new GameRepository();
