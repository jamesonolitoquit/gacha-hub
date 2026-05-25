import { pets } from '../../db/schema';
import { getGameSlugById } from '../bootstrap-data';
import { seedRegistry } from '../seeds/seed-registry';
import { db } from '../db';

export type PetRecord = typeof pets.$inferSelect;
export type CreatePetInput = typeof pets.$inferInsert;

type PetRow = {
  id: number;
  game_id: number;
  slug: string;
  name: string;
  rarity: string | null;
  faction: string | null;
  passive1_name: string | null;
  passive1_description: string | null;
  passive1_enhanced: string | null;
  passive2_name: string | null;
  passive2_description: string | null;
  passive2_enhanced: string | null;
  icon_url: string | null;
  patch_id: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

function mapPetRow(row: PetRow): PetRecord {
  return {
    id: row.id,
    gameId: row.game_id,
    slug: row.slug,
    name: row.name,
    rarity: row.rarity,
    faction: row.faction,
    passive1Name: row.passive1_name,
    passive1Description: row.passive1_description,
    passive1Enhanced: row.passive1_enhanced,
    passive2Name: row.passive2_name,
    passive2Description: row.passive2_description,
    passive2Enhanced: row.passive2_enhanced,
    iconUrl: row.icon_url,
    patchId: row.patch_id,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
    deletedAt: row.deleted_at ? new Date(row.deleted_at) : null,
  };
}

export class PetRepository {
  async findByGameId(gameId: number): Promise<PetRecord[]> {
    if (db) {
      try {
        const { data, error } = await db
          .from('pets')
          .select('id, game_id, slug, name, rarity, faction, passive1_name, passive1_description, passive1_enhanced, passive2_name, passive2_description, passive2_enhanced, icon_url, patch_id, created_at, updated_at, deleted_at')
          .eq('game_id', gameId)
          .is('deleted_at', null)
          .order('name', { ascending: true });

        if (error) throw new Error(`Failed to load pets for game ${gameId}: ${error.message}`);

        return (data ?? []).map((row) => mapPetRow(row as PetRow));
      } catch {
        // fall through to seed data
      }
    }

    const slug = getGameSlugById(gameId);
    if (!slug) return [];
    return seedRegistry.getPets(slug) as PetRecord[];
  }

  async findBySlug(gameId: number, slug: string): Promise<PetRecord | undefined> {
    if (db) {
      try {
        const { data, error } = await db
          .from('pets')
          .select('id, game_id, slug, name, rarity, faction, passive1_name, passive1_description, passive1_enhanced, passive2_name, passive2_description, passive2_enhanced, icon_url, patch_id, created_at, updated_at, deleted_at')
          .eq('game_id', gameId)
          .eq('slug', slug)
          .is('deleted_at', null)
          .maybeSingle();

        if (error) throw new Error(`Failed to load pet ${slug}: ${error.message}`);

        if (data) {
          return mapPetRow(data as PetRow);
        }
      } catch {
        // fall through to seed data
      }
    }

    const gameSlug = getGameSlugById(gameId);
    if (!gameSlug) return undefined;
    const all = seedRegistry.getPets(gameSlug);
    return all.find((p) => p.slug === slug) as PetRecord | undefined;
  }
}

export const petRepository = new PetRepository();
