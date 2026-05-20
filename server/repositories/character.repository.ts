import { characters } from '../../db/schema';
import { findSeedCharacter, getSeedCharacters } from '../bootstrap-data';
import { db } from '../db';

export type CharacterRecord = typeof characters.$inferSelect;
export type CreateCharacterInput = typeof characters.$inferInsert;

type CharacterRow = {
  id: number;
  game_id: number;
  slug: string;
  name: string;
  rarity: number | null;
  element: string | null;
  class: string | null;
  role: string | null;
  portrait_url: string | null;
  full_art_url: string | null;
  icon_url: string | null;
  description: string | null;
  release_patch_id: number | null;
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
    releasePatchId: row.release_patch_id,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
    deletedAt: row.deleted_at ? new Date(row.deleted_at) : null,
  };
}

export class CharacterRepository {
  async findByGameId(gameId: number): Promise<CharacterRecord[]> {
    if (db) {
      const { data, error } = await db
        .from('characters')
        .select('id, game_id, slug, name, rarity, element, class, role, portrait_url, full_art_url, icon_url, description, release_patch_id, created_at, updated_at, deleted_at')
        .eq('game_id', gameId)
        .is('deleted_at', null)
        .order('name', { ascending: true });

      if (error) {
        throw new Error(`Failed to load characters for game ${gameId}: ${error.message}`);
      }

      return (data ?? []).map((row) => mapCharacterRow(row as CharacterRow));
    }

    return getSeedCharacters(gameId).map((character, index) => ({
      id: index + 1,
      gameId: character.gameId,
      slug: character.slug,
      name: character.name,
      rarity: character.rarity,
      element: character.element,
      characterClass: character.characterClass,
      role: character.role,
      portraitUrl: null,
      fullArtUrl: null,
      iconUrl: null,
      description: character.description,
      releasePatchId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    }));
  }

  async findById(gameId: number, id: number): Promise<CharacterRecord | undefined> {
    if (db) {
      const { data, error } = await db
        .from('characters')
        .select('id, game_id, slug, name, rarity, element, class, role, portrait_url, full_art_url, icon_url, description, release_patch_id, created_at, updated_at, deleted_at')
        .eq('game_id', gameId)
        .eq('id', id)
        .is('deleted_at', null)
        .maybeSingle();

      if (error) {
        throw new Error(`Failed to load character ${id}: ${error.message}`);
      }

      if (data) {
        return mapCharacterRow(data as CharacterRow);
      }
    }

    const character = getSeedCharacters(gameId).find((entry) => entry.id === id);

    if (!character) {
      return undefined;
    }

    return {
      id: character.id,
      gameId: character.gameId,
      slug: character.slug,
      name: character.name,
      rarity: character.rarity,
      element: character.element,
      characterClass: character.characterClass,
      role: character.role,
      portraitUrl: null,
      fullArtUrl: null,
      iconUrl: null,
      description: character.description,
      releasePatchId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };
  }

  async findBySlug(gameId: number, slug: string): Promise<CharacterRecord | undefined> {
    if (db) {
      const { data, error } = await db
        .from('characters')
        .select('id, game_id, slug, name, rarity, element, class, role, portrait_url, full_art_url, icon_url, description, release_patch_id, created_at, updated_at, deleted_at')
        .eq('game_id', gameId)
        .eq('slug', slug)
        .is('deleted_at', null)
        .maybeSingle();

      if (error) {
        throw new Error(`Failed to load character ${slug}: ${error.message}`);
      }

      if (data) {
        return mapCharacterRow(data as CharacterRow);
      }
    }

    const character = findSeedCharacter(gameId, slug);

    if (!character) {
      return undefined;
    }

    return {
      id: 1,
      gameId: character.gameId,
      slug: character.slug,
      name: character.name,
      rarity: character.rarity,
      element: character.element,
      characterClass: character.characterClass,
      role: character.role,
      portraitUrl: null,
      fullArtUrl: null,
      iconUrl: null,
      description: character.description,
      releasePatchId: null,
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
        return mapCharacterRow(data as CharacterRow);
      }
    }

    return {
      id: 1,
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
      releasePatchId: input.releasePatchId ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };
  }
}

export const characterRepository = new CharacterRepository();
