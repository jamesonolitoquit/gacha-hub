import { skills } from '../../db/schema';
import { CharacterRepository } from './character.repository';
import { getGameSlugById } from '../bootstrap-data';
import { seedRegistry } from '../seeds/seed-registry';
import { db } from '../db';

export type SkillRecord = typeof skills.$inferSelect;
export type CreateSkillInput = typeof skills.$inferInsert;

type SkillRow = {
  id: number;
  character_id: number;
  slug: string;
  name: string;
  type: string | null;
  description: string | null;
  cooldown_turns: number | null;
  cost: number | null;
  power_type: string | null;
  scaling_stat: string | null;
  targets: string | null;
  range_type: string | null;
  order: number | null;
  enhancement_text: string | null;
  transcendence_text: string | null;
  icon_url: string | null;
  animation_url: string | null;
  introduced_in_patch_id: number | null;
  last_verified_patch_id: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

function mapSkillRow(row: SkillRow): SkillRecord {
  return {
    id: row.id,
    characterId: row.character_id,
    slug: row.slug,
    name: row.name,
    type: row.type,
    description: row.description,
    cooldownTurns: row.cooldown_turns,
    cost: row.cost,
    powerType: row.power_type,
    scalingStat: row.scaling_stat,
    targets: row.targets,
    rangeType: row.range_type,
    order: row.order,
    enhancementText: row.enhancement_text,
    transcendenceText: row.transcendence_text,
    iconUrl: row.icon_url,
    animationUrl: row.animation_url,
    introducedInPatchId: row.introduced_in_patch_id,
    lastVerifiedPatchId: row.last_verified_patch_id,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
    deletedAt: row.deleted_at ? new Date(row.deleted_at) : null,
  };
}

export class SkillRepository {
  async findByCharacterId(characterId: number, gameId: number = 1): Promise<SkillRecord[]> {
    if (db) {
      try {
        const { data, error } = await db
          .from('skills')
          .select('id, character_id, slug, name, type, description, cooldown_turns, cost, power_type, scaling_stat, targets, range_type, icon_url, animation_url, created_at, updated_at, deleted_at')
          .eq('character_id', characterId)
          .is('deleted_at', null)
          .order('name', { ascending: true });

        if (error) {
          throw new Error(`Failed to load skills for character ${characterId}: ${error.message}`);
        }

        return (data ?? []).map((row) => mapSkillRow(row as SkillRow));
      } catch {
      }
    }

    const slug = getGameSlugById(gameId);
    if (!slug) return [];
    const all = seedRegistry.getSkills(slug);
    return all.filter((s) => s.characterId === characterId) as SkillRecord[];
  }

  async findByCharacterIds(characterIds: number[], gameId: number = 1): Promise<SkillRecord[]> {
    if (characterIds.length === 0) return [];
    if (db) {
      try {
        const { data, error } = await db
          .from('skills')
          .select('id, character_id, slug, name, type, description, cooldown_turns, cost, power_type, scaling_stat, targets, range_type, icon_url, animation_url, created_at, updated_at, deleted_at')
          .in('character_id', characterIds)
          .is('deleted_at', null)
          .order('name', { ascending: true });

        if (error) throw new Error(`Failed to load skills: ${error.message}`);
        return (data ?? []).map((row) => mapSkillRow(row as SkillRow));
      } catch {
      }
    }

    const slug = getGameSlugById(gameId);
    if (!slug) return [];
    const all = seedRegistry.getSkills(slug);
    return all.filter((s) => characterIds.includes(s.characterId)) as SkillRecord[];
  }

  async findBySlug(gameId: number, slug: string): Promise<SkillRecord | undefined> {
    const characters = await new CharacterRepository().findByGameId(gameId);
    const characterIds = characters.map((character) => character.id);

    if (db && characterIds.length > 0) {
      try {
        const { data, error } = await db
          .from('skills')
          .select('id, character_id, slug, name, type, description, cooldown_turns, cost, power_type, scaling_stat, targets, range_type, icon_url, animation_url, created_at, updated_at, deleted_at')
          .eq('slug', slug)
          .in('character_id', characterIds)
          .is('deleted_at', null)
          .maybeSingle();

        if (error) throw new Error(`Failed to load skill ${slug}: ${error.message}`);

        if (data) {
          return mapSkillRow(data as SkillRow);
        }
      } catch {
      }
    }

    const gameSlug = getGameSlugById(gameId);
    if (!gameSlug) return undefined;
    const all = seedRegistry.getSkills(gameSlug);
    return all.find((s) => s.slug === slug) as SkillRecord | undefined;
  }

  async create(input: CreateSkillInput): Promise<SkillRecord> {
    if (db) {
      const { data, error } = await db
        .from('skills')
        .insert({
          character_id: input.characterId,
          slug: input.slug,
          name: input.name,
          type: input.type ?? null,
          description: input.description ?? null,
          cooldown_turns: input.cooldownTurns ?? null,
          cost: input.cost ?? null,
          power_type: input.powerType ?? null,
          scaling_stat: input.scalingStat ?? null,
          targets: input.targets ?? null,
          range_type: input.rangeType ?? null,
          icon_url: input.iconUrl ?? null,
          animation_url: input.animationUrl ?? null,
        })
        .select('id, character_id, slug, name, type, description, cooldown_turns, cost, power_type, scaling_stat, targets, range_type, icon_url, animation_url, created_at, updated_at, deleted_at')
        .single();

      if (error) {
        throw new Error(`Failed to create skill ${input.slug ?? 'unknown'}: ${error.message}`);
      }

      if (data) {
        return mapSkillRow(data as SkillRow);
      }
    }

    return {
      id: 1,
      characterId: input.characterId ?? 0,
      slug: input.slug ?? 'placeholder',
      name: input.name ?? 'Placeholder',
      type: input.type ?? null,
      description: input.description ?? null,
      cooldownTurns: input.cooldownTurns ?? null,
      cost: input.cost ?? null,
      powerType: input.powerType ?? null,
      scalingStat: input.scalingStat ?? null,
      targets: input.targets ?? null,
      rangeType: input.rangeType ?? null,
      order: input.order ?? null,
      enhancementText: input.enhancementText ?? null,
      transcendenceText: input.transcendenceText ?? null,
      iconUrl: input.iconUrl ?? null,
      animationUrl: input.animationUrl ?? null,
      introducedInPatchId: input.introducedInPatchId ?? null,
      lastVerifiedPatchId: input.lastVerifiedPatchId ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };
  }
}

export const skillRepository = new SkillRepository();