import { characters } from '../../db/schema';
import { findSeedCharacter, getSeedCharactersByGameSlug, getGameSlugById } from '../bootstrap-data';
import { db } from '../db';
import { generatePlaceholderPortraitUrl } from '../../shared/utils/portrait';

export type CharacterRecord = typeof characters.$inferSelect;
export type CreateCharacterInput = typeof characters.$inferInsert;

type CharacterRow = {
  id: number;
  game_id: number;
  slug: string;
  name: string;
  rarity: string | null;
  element: string | null;
  class: string | null;
  role: string | null;
  portrait_url: string | null;
  full_art_url: string | null;
  icon_url: string | null;
  description: string | null;
  tags: string[] | null;
  release_patch_id: number | null;
  introduced_in_patch_id: number | null;
  last_verified_patch_id: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

function mapCharacterRow(row: CharacterRow): CharacterRecord {
  return {
    id: row.id,
    gameId: row.game_id,
    slug: row.slug,
    name: row.name,
    rarity: row.rarity,
    element: row.element,
    characterClass: row.class,
    role: row.role,
    portraitUrl: row.portrait_url,
    fullArtUrl: row.full_art_url,
    iconUrl: row.icon_url,
    description: row.description,
    tags: row.tags ?? null,
    releasePatchId: row.release_patch_id,
    introducedInPatchId: row.introduced_in_patch_id,
    lastVerifiedPatchId: row.last_verified_patch_id,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
    deletedAt: row.deleted_at ? new Date(row.deleted_at) : null,
  };
}

function hydrateCharacterAssets(character: CharacterRecord, seed?: ReturnType<typeof findSeedCharacter>): CharacterRecord {
  const placeholders = {
    portraitUrl: generatePlaceholderPortraitUrl(character.name, character.role),
    fullArtUrl: generatePlaceholderPortraitUrl(character.name, character.role),
    iconUrl: generatePlaceholderPortraitUrl(character.name, character.role),
  };

  if (!seed) {
    return {
      ...character,
      portraitUrl: character.portraitUrl ?? placeholders.portraitUrl,
      fullArtUrl: character.fullArtUrl ?? placeholders.fullArtUrl,
      iconUrl: character.iconUrl ?? placeholders.iconUrl,
    };
  }

  return {
    ...character,
    portraitUrl: character.portraitUrl ?? seed.portraitUrl ?? placeholders.portraitUrl,
    fullArtUrl: character.fullArtUrl ?? seed.fullArtUrl ?? placeholders.fullArtUrl,
    iconUrl: character.iconUrl ?? seed.iconUrl ?? placeholders.iconUrl,
  };
}

function mapSeedCharacter(character: ReturnType<typeof findSeedCharacter> extends infer T ? T : never, index = 1): CharacterRecord {
  if (!character) {
    throw new Error('Seed character not found');
  }

  return {
    id: index,
    gameId: character.gameId,
    slug: character.slug,
    name: character.name,
    rarity: character.rarity,
    element: character.element,
    characterClass: character.characterClass,
    role: character.role,
    portraitUrl: character.portraitUrl ?? null,
    fullArtUrl: character.fullArtUrl ?? null,
    iconUrl: character.iconUrl ?? null,
    description: character.description,
    tags: null,
    releasePatchId: null,
    introducedInPatchId: null,
    lastVerifiedPatchId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };
}

function seedCharactersByGameId(gameId: number) {
  const slug = getGameSlugById(gameId);
  return slug ? getSeedCharactersByGameSlug(slug) : [];
}

function mapSeedCharacters(gameId: number): CharacterRecord[] {
  return seedCharactersByGameId(gameId).map((character, index) => mapSeedCharacter(character, index + 1));
}

export class CharacterRepository {
  async findByGameId(gameId: number): Promise<CharacterRecord[]> {
    if (db) {
      try {
        const { data, error } = await db
          .from('characters')
          .select('id, game_id, slug, name, rarity, element, class, role, portrait_url, full_art_url, icon_url, description, release_patch_id, created_at, updated_at, deleted_at')
          .eq('game_id', gameId)
          .is('deleted_at', null)
          .order('name', { ascending: true });

        if (error) {
          throw new Error(error.message);
        }

        return (data ?? []).map((row) => mapCharacterRow(row as CharacterRow));
      } catch {
        return mapSeedCharacters(gameId);
      }
    }

    return mapSeedCharacters(gameId);
  }

  async findByGameIdPaged(
    gameId: number,
    opts: { page?: number; limit?: number; search?: string; rarity?: string | number; role?: string }
  ): Promise<{ rows: CharacterRecord[]; total: number }> {
    const page = Math.max(1, opts.page ?? 1);
    const limit = Math.max(1, opts.limit ?? 20);
    const offset = (page - 1) * limit;

    if (db) {
      try {
        let query = db
          .from('characters')
          .select('id, game_id, slug, name, rarity, element, class, role, portrait_url, full_art_url, icon_url, description, release_patch_id, created_at, updated_at, deleted_at', { count: 'exact' })
          .eq('game_id', gameId)
          .is('deleted_at', null)
          .order('name', { ascending: true });

        if (opts.search) {
          const q = `%${opts.search}%`;
          query = query.or(`name.ilike.${q},slug.ilike.${q},description.ilike.${q}`);
        }

        if (opts.rarity !== undefined && opts.rarity !== 'any') {
          query = query.eq('rarity', typeof opts.rarity === 'string' ? Number(opts.rarity) : opts.rarity);
        }

        if (opts.role !== undefined && opts.role !== 'any') {
          query = query.eq('role', opts.role);
        }

        const { data, count, error } = await query.range(offset, offset + limit - 1);

        if (error) {
          throw new Error(error.message);
        }

        return {
          rows: (data ?? []).map((row) => mapCharacterRow(row as CharacterRow)),
          total: count ?? (data ?? []).length,
        };
      } catch {
        // fall back to seeds below
      }
    }

    const all = seedCharactersByGameId(gameId);
    let filtered = all;

    if (opts.search) {
      const s = opts.search.toLowerCase();
      filtered = filtered.filter((c) => (c.name || '').toLowerCase().includes(s) || (c.slug || '').toLowerCase().includes(s) || (c.description || '').toLowerCase().includes(s));
    }

    if (opts.rarity !== undefined && opts.rarity !== 'any') {
      const r = String(opts.rarity);
      filtered = filtered.filter((c) => String(c.rarity ?? '') === r);
    }

    if (opts.role !== undefined && opts.role !== 'any') {
      filtered = filtered.filter((c) => (c.role || '').toLowerCase() === String(opts.role).toLowerCase());
    }

    const total = filtered.length;
    const paged = filtered.slice(offset, offset + limit).map((c, i) => ({
      id: c.id,
      gameId: c.gameId,
      slug: c.slug,
      name: c.name,
      rarity: c.rarity != null ? String(c.rarity) : null,
      element: c.element,
      characterClass: c.characterClass,
      role: c.role,
      portraitUrl: c.portraitUrl ?? null,
      fullArtUrl: c.fullArtUrl ?? null,
      iconUrl: c.iconUrl ?? null,
      description: c.description,
      tags: null,
      releasePatchId: null,
      introducedInPatchId: null,
      lastVerifiedPatchId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    }));

    return { rows: paged, total };
  }

  async findById(gameId: number, id: number): Promise<CharacterRecord | undefined> {
    if (db) {
      try {
        const { data, error } = await db
          .from('characters')
          .select('id, game_id, slug, name, rarity, element, class, role, portrait_url, full_art_url, icon_url, description, release_patch_id, created_at, updated_at, deleted_at')
          .eq('game_id', gameId)
          .eq('id', id)
          .is('deleted_at', null)
          .maybeSingle();

        if (error) {
          throw new Error(error.message);
        }

        if (data) {
          const mapped = mapCharacterRow(data as CharacterRow);
          return hydrateCharacterAssets(mapped, findSeedCharacter(gameId, mapped.slug));
        }
      } catch {
        // Fall back to seed data when the Supabase schema is unavailable.
      }
    }

    const character = seedCharactersByGameId(gameId).find((entry) => entry.id === id);

    if (!character) {
      return undefined;
    }

    return {
      id: character.id,
      gameId: character.gameId,
      slug: character.slug,
      name: character.name,
      rarity: character.rarity != null ? String(character.rarity) : null,
      element: character.element,
      characterClass: character.characterClass,
      role: character.role,
      portraitUrl: character.portraitUrl ?? null,
      fullArtUrl: character.fullArtUrl ?? null,
      iconUrl: character.iconUrl ?? null,
      description: character.description,
      tags: null,
      releasePatchId: null,
      introducedInPatchId: null,
      lastVerifiedPatchId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };
  }

  async findBySlug(gameId: number, slug: string): Promise<CharacterRecord | undefined> {
    if (db) {
      try {
        const { data, error } = await db
          .from('characters')
          .select('id, game_id, slug, name, rarity, element, class, role, portrait_url, full_art_url, icon_url, description, release_patch_id, created_at, updated_at, deleted_at')
          .eq('game_id', gameId)
          .eq('slug', slug)
          .is('deleted_at', null)
          .maybeSingle();

        if (error) {
          throw new Error(error.message);
        }

        if (data) {
          const mapped = mapCharacterRow(data as CharacterRow);
          return hydrateCharacterAssets(mapped, findSeedCharacter(gameId, mapped.slug));
        }
      } catch {
        // Fall back to seed data when the Supabase schema is unavailable.
      }
    }

    const character = findSeedCharacter(gameId, slug);

    if (!character) {
      return undefined;
    }

    return {
      id: character.id,
      gameId: character.gameId,
      slug: character.slug,
      name: character.name,
      rarity: character.rarity != null ? String(character.rarity) : null,
      element: character.element,
      characterClass: character.characterClass,
      role: character.role,
      portraitUrl: character.portraitUrl ?? null,
      fullArtUrl: character.fullArtUrl ?? null,
      iconUrl: character.iconUrl ?? null,
      description: character.description,
      tags: null,
      releasePatchId: null,
      introducedInPatchId: null,
      lastVerifiedPatchId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };
  }

  async create(input: CreateCharacterInput): Promise<CharacterRecord> {
    if (db) {
      const { data, error } = await db
        .from('characters')
        .insert({
          game_id: input.gameId,
          slug: input.slug,
          name: input.name,
          rarity: input.rarity ?? null,
          element: input.element ?? null,
          class: input.characterClass ?? null,
          role: input.role ?? null,
          portrait_url: input.portraitUrl ?? null,
          full_art_url: input.fullArtUrl ?? null,
          icon_url: input.iconUrl ?? null,
          description: input.description ?? null,
          release_patch_id: input.releasePatchId ?? null,
        })
        .select('id, game_id, slug, name, rarity, element, class, role, portrait_url, full_art_url, icon_url, description, release_patch_id, created_at, updated_at, deleted_at')
        .single();

      if (error) {
        throw new Error(`Failed to create character ${input.slug ?? 'unknown'}: ${error.message}`);
      }

      if (data) {
        const mapped = mapCharacterRow(data as CharacterRow);
        return hydrateCharacterAssets(mapped, findSeedCharacter(mapped.gameId, mapped.slug));
      }
    }

    return {
      id: Date.now(),
      gameId: input.gameId ?? 0,
      slug: input.slug ?? 'placeholder',
      name: input.name ?? 'Placeholder',
      rarity: input.rarity ?? null,
      element: input.element ?? null,
      characterClass: input.characterClass ?? null,
      role: input.role ?? null,
      portraitUrl: input.portraitUrl ?? null,
      fullArtUrl: input.fullArtUrl ?? null,
      iconUrl: input.iconUrl ?? null,
      description: input.description ?? null,
      tags: input.tags ?? null,
      releasePatchId: input.releasePatchId ?? null,
      introducedInPatchId: input.introducedInPatchId ?? null,
      lastVerifiedPatchId: input.lastVerifiedPatchId ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };
  }
}

export const characterRepository = new CharacterRepository();
