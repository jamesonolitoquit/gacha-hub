import fs from 'fs';
import path from 'path';
import { generatePlaceholderPortraitUrl } from '../../../shared/utils/portrait';
import type {
  GameSeedData,
  NormalizedCharacter,
  NormalizedSkill,
  NormalizedBuild,
  NormalizedGear,
  NormalizedPet,
} from '../types';

const GAME_ID = 1;
const GAME_SLUG = 'seven-knights-rebirth';

function pruneDir(): string {
  return path.join(process.cwd(), 'data', 'seeds', 'pruned');
}

function readJson<T>(fileName: string): T[] {
  try {
    const full = path.join(pruneDir(), fileName);
    if (!fs.existsSync(full)) return [];
    const raw = fs.readFileSync(full, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function normalizeRarity(rarity: string | null): string | null {
  if (!rarity) return null;
  switch (rarity) {
    case 'Legendary++': return 'legendary-pp';
    case 'Legendary+':  return 'legendary-p';
    case 'Legendary':   return 'legendary';
    case 'Rare':        return 'rare';
    case 'Common':      return 'common';
    case 'Uncommon':    return 'rare';
    case 'Collab':      return 'legendary-p';
    default:            return rarity.toLowerCase().replace(/\s+/g, '-');
  }
}

function normalizeClass(cls: string | null): string | null {
  if (!cls) return null;
  return cls.toLowerCase();
}

function classToRole(cls: string | null): string | null {
  if (!cls) return null;
  switch (cls.toLowerCase()) {
    case 'attack':    return 'Attacker';
    case 'defense':   return 'Defender';
    case 'magic':     return 'Magician';
    case 'support':   return 'Support';
    case 'universal': return 'Universal';
    default:          return cls.charAt(0).toUpperCase() + cls.slice(1).toLowerCase();
  }
}

function now(): Date {
  return new Date();
}

type RawCharacter = {
  name?: string;
  slug?: string;
  characterClass?: string;
  rarity?: string;
  element?: string | null;
  description?: string;
};

type RawSkill = {
  name?: string;
  character_slug?: string;
  slug?: string;
  type?: string;
  description?: string;
  order?: number;
  enhancements?: string[] | string;
  transcendence?: string;
};

type RawGear = {
  slug?: string;
  name?: string;
  source?: string;
  twoPieceEffect?: string;
  fourPieceEffect?: string;
  description?: string;
  iconUrl?: string;
  tags?: string[];
};

type RawPet = {
  slug?: string;
  name?: string;
  rarity?: string;
  faction?: string | null;
  passive1Name?: string;
  passive1Description?: string;
  passive1Enhanced?: string;
  passive2Name?: string;
  passive2Description?: string;
  passive2Enhanced?: string;
  iconUrl?: string;
};

export function loadSkrData(): GameSeedData {
  const rawCharacters = readJson<RawCharacter>(`${GAME_SLUG}.json`);
  const rawSkills = readJson<RawSkill>(`${GAME_SLUG}-skills.json`);
  const rawBuilds = readJson<any>(`${GAME_SLUG}-builds.json`);
  const rawGear = readJson<RawGear>(`${GAME_SLUG}-gear.json`);
  const rawPets = readJson<RawPet>(`${GAME_SLUG}-pets.json`);

  // Build slug -> id map and normalize characters
  const slugToId = new Map<string, number>();
  const characters: NormalizedCharacter[] = [];

  for (let i = 0; i < rawCharacters.length; i++) {
    const c = rawCharacters[i];
    const slug = c.slug ?? `skr-char-${i + 1}`;
    const charClass = normalizeClass(c.characterClass ?? null);
    const role = classToRole(c.characterClass ?? null);
    const id = i + 1;
    slugToId.set(slug, id);

    characters.push({
      id,
      gameId: GAME_ID,
      slug,
      name: c.name ?? slug,
      rarity: normalizeRarity(c.rarity ?? null),
      element: c.element ?? null,
      characterClass: charClass,
      role,
      portraitUrl: generatePlaceholderPortraitUrl(c.name ?? slug, role),
      fullArtUrl: generatePlaceholderPortraitUrl(c.name ?? slug, role),
      iconUrl: generatePlaceholderPortraitUrl(c.name ?? slug, role),
      description: c.description ?? '',
      tags: null,
      releasePatchId: null,
      introducedInPatchId: null,
      lastVerifiedPatchId: null,
      createdAt: now(),
      updatedAt: now(),
      deletedAt: null,
    });
  }

  // Normalize skills, linking via character_slug
  const skills: NormalizedSkill[] = [];

  for (let i = 0; i < rawSkills.length; i++) {
    const s = rawSkills[i];
    const charSlug = s.character_slug;
    const charId = charSlug ? slugToId.get(charSlug) : undefined;
    if (!charSlug || charId === undefined) continue;

    skills.push({
      id: i + 1,
      characterId: charId,
      slug: s.slug ?? `${charSlug}-skill-${i + 1}`,
      name: s.name ?? `${charSlug} Skill ${i + 1}`,
      type: s.type ?? null,
      description: s.description ?? null,
      cooldownTurns: null,
      cost: null,
      powerType: null,
      scalingStat: null,
      targets: null,
      rangeType: null,
      order: s.order ?? null,
      enhancementText: Array.isArray(s.enhancements) ? s.enhancements.join('\n') : (s.enhancements ?? null),
      transcendenceText: s.transcendence ?? null,
      iconUrl: null,
      animationUrl: null,
      introducedInPatchId: null,
      lastVerifiedPatchId: null,
      createdAt: now(),
      updatedAt: now(),
      deletedAt: null,
    });
  }

  // Builds — pruned format already matches SeedBuild/BuildData
  const builds: NormalizedBuild[] = rawBuilds.map((b: any) => ({
    characterSlug: b.characterSlug ?? '',
    gearSet1: b.gearSet1 ?? { weapon: '', armor: '', accessory: '', setName: '' },
    gearSet2: b.gearSet2,
    transcendencePath: Array.isArray(b.transcendencePath) ? b.transcendencePath : [],
    skillPriority: Array.isArray(b.skillPriority) ? b.skillPriority : [],
    statPriorities: Array.isArray(b.statPriorities) ? b.statPriorities : [],
    keyUsage: Array.isArray(b.keyUsage) ? b.keyUsage : [],
    exclusiveEquipment: b.exclusiveEquipment,
    notes: b.notes,
  }));

  // Gear
  const gear: NormalizedGear[] = rawGear.map((g, i) => ({
    id: i + 1,
    gameId: GAME_ID,
    slug: g.slug ?? `gear-${i + 1}`,
    name: g.name ?? `Gear ${i + 1}`,
    source: g.source ?? null,
    twoPieceEffect: g.twoPieceEffect ?? null,
    fourPieceEffect: g.fourPieceEffect ?? null,
    description: g.description ?? null,
    iconUrl: g.iconUrl ?? null,
    tags: Array.isArray(g.tags) ? g.tags : null,
    patchId: null,
    createdAt: now(),
    updatedAt: now(),
    deletedAt: null,
  }));

  // Pets
  const pets: NormalizedPet[] = rawPets.map((p, i) => ({
    id: i + 1,
    gameId: GAME_ID,
    slug: p.slug ?? `pet-${i + 1}`,
    name: p.name ?? `Pet ${i + 1}`,
    rarity: normalizeRarity(p.rarity ?? null),
    faction: p.faction ?? null,
    passive1Name: p.passive1Name ?? null,
    passive1Description: p.passive1Description ?? null,
    passive1Enhanced: p.passive1Enhanced ?? null,
    passive2Name: p.passive2Name ?? null,
    passive2Description: p.passive2Description ?? null,
    passive2Enhanced: p.passive2Enhanced ?? null,
    iconUrl: p.iconUrl ?? null,
    patchId: null,
    createdAt: now(),
    updatedAt: now(),
    deletedAt: null,
  }));

  return {
    characters,
    skills,
    builds,
    gear,
    pets,
    teams: [],
    tierLists: [],
    tierEntries: [],
  };
}
