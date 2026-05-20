import { moduleRegistry } from '../core/module-registry';

type SeedCharacter = {
  id: number;
  gameId: number;
  slug: string;
  name: string;
  rarity: number | null;
  element: string | null;
  characterClass: string | null;
  role: string | null;
  description: string;
};

type SeedGuide = {
  gameId: number;
  slug: string;
  title: string;
  summary: string;
  content: string;
  guideType: string;
};

type SeedTierList = {
  gameId: number;
  slug: string;
  title: string;
  tierType: string;
  tiers: string;
};

type SeedSkill = {
  gameId: number;
  characterId: number;
  slug: string;
  name: string;
  type: string;
  description: string;
  cooldownTurns: number | null;
  cost: number | null;
  powerType: string | null;
  scalingStat: string | null;
  targets: string | null;
  rangeType: string | null;
};

type SeedPatch = {
  gameId: number;
  version: string;
  title: string | null;
  notes: string | null;
  releaseDate: string;
  changes: string | null;
};

const seedCharactersByGameSlug: Record<string, SeedCharacter[]> = {
  'seven-knights-rebirth': [
    {
      id: 1,
      gameId: 1,
      slug: 'sword-knight',
      name: 'Sword Knight',
      rarity: 5,
      element: 'Light',
      characterClass: 'Warrior',
      role: 'Attacker',
      description: 'Frontline sword fighter for the Seven Knights starter dataset.',
    },
  ],
  'dragon-traveler': [
    {
      id: 1,
      gameId: 2,
      slug: 'traveler-nia',
      name: 'Traveler Nia',
      rarity: 5,
      element: 'Wind',
      characterClass: 'Explorer',
      role: 'Support',
      description: 'Bootstrap Dragon Traveler adventurer entry.',
    },
  ],
  'brown-dust-2': [
    {
      id: 1,
      gameId: 3,
      slug: 'guardian-lyra',
      name: 'Guardian Lyra',
      rarity: 5,
      element: 'Light',
      characterClass: 'Sentinel',
      role: 'Defender',
      description: 'Bootstrap Brown Dust 2 mercenary entry.',
    },
  ],
};

const seedGuidesByGameSlug: Record<string, SeedGuide[]> = {
  'seven-knights-rebirth': [
    {
      gameId: 1,
      slug: 'starter-guide',
      title: 'Starter Guide',
      summary: 'A compact starting route for new players.',
      content: 'Focus on progression, leveling, and resource efficiency before chasing niche builds.',
      guideType: 'progression',
    },
  ],
};

const seedTierListsByGameSlug: Record<string, SeedTierList[]> = {
  'seven-knights-rebirth': [
    {
      gameId: 1,
      slug: 'launch-tier-list',
      title: 'Launch Tier List',
      tierType: 'general',
      tiers: '{"S":["Sword Knight"],"A":[],"B":[],"C":[]}',
    },
  ],
};

const seedSkills: SeedSkill[] = [
  {
    gameId: 1,
    characterId: 1,
    slug: 'blade-flare',
    name: 'Blade Flare',
    type: 'Active',
    description: 'A starter burst attack used to showcase the first skills content slice.',
    cooldownTurns: 3,
    cost: 20,
    powerType: 'Physical',
    scalingStat: 'Attack',
    targets: 'Single target',
    rangeType: 'Melee',
  },
];

const seedPatchesByGameSlug: Record<string, SeedPatch[]> = {
  'seven-knights-rebirth': [
    {
      gameId: 1,
      version: '1.0.0',
      title: 'Initial Release',
      notes: 'Game launch with starter characters and core systems.',
      releaseDate: '2025-01-15',
      changes: 'Initial release of Seven Knights Rebirth with core gameplay systems, starter characters, and progression mechanics.',
    },
    {
      gameId: 1,
      version: '1.1.0',
      title: 'Balance Update',
      notes: 'First balance adjustments and quality-of-life improvements.',
      releaseDate: '2025-02-01',
      changes: 'Adjusted character stats, improved skill balance, fixed UI bugs.',
    },
  ],
  'dragon-traveler': [
    {
      gameId: 2,
      version: '1.0.0',
      title: 'Game Launch',
      notes: 'The Dragon Traveler world opens its first route.',
      releaseDate: '2024-11-01',
      changes: 'Initial launch of Dragon Traveler with starter regions and core systems.',
    },
  ],
  'brown-dust-2': [
    {
      gameId: 3,
      version: '1.0.0',
      title: 'Launch Day',
      notes: 'Brown Dust 2 global launch.',
      releaseDate: '2024-10-01',
      changes: 'Global release of Brown Dust 2 with full game systems.',
    },
  ],
};

function getGameSlugById(gameId: number) {
  return moduleRegistry.list()[gameId - 1]?.slug;
}

function getGameSlugByLookup(gameSlugOrId: string | number) {
  if (typeof gameSlugOrId === 'number') {
    return getGameSlugById(gameSlugOrId);
  }

  return gameSlugOrId;
}

export function getSeedCharacters(gameId: number) {
  const gameSlug = getGameSlugById(gameId);

  if (!gameSlug) {
    return [];
  }

  return seedCharactersByGameSlug[gameSlug] ?? [];
}

export function getSeedCharactersByGameSlug(gameSlug: string) {
  const resolvedGameSlug = getGameSlugByLookup(gameSlug);

  if (!resolvedGameSlug) {
    return [];
  }

  return seedCharactersByGameSlug[resolvedGameSlug] ?? [];
}

export function findSeedCharacter(gameId: number, slug: string) {
  return getSeedCharacters(gameId).find((character) => character.slug === slug);
}

export function getSeedGuides(gameId: number) {
  const gameSlug = getGameSlugById(gameId);

  if (!gameSlug) {
    return [];
  }

  return seedGuidesByGameSlug[gameSlug] ?? [];
}

export function findSeedGuide(gameId: number, slug: string) {
  return getSeedGuides(gameId).find((guide) => guide.slug === slug);
}

export function getSeedTierLists(gameId: number) {
  const gameSlug = getGameSlugById(gameId);

  if (!gameSlug) {
    return [];
  }

  return seedTierListsByGameSlug[gameSlug] ?? [];
}

export function findSeedTierList(gameId: number, slug: string) {
  return getSeedTierLists(gameId).find((tierList) => tierList.slug === slug);
}

export function getSeedSkills(characterId: number) {
  return seedSkills.filter((skill) => skill.characterId === characterId);
}

export function getSeedSkillsByGameId(gameId: number) {
  return seedSkills.filter((skill) => skill.gameId === gameId);
}

export function findSeedSkillByGameId(gameId: number, slug: string) {
  return getSeedSkillsByGameId(gameId).find((skill) => skill.slug === slug);
}

export function findSeedSkill(characterId: number, slug: string) {
  return getSeedSkills(characterId).find((skill) => skill.slug === slug);
}

export function getSeedPatches(gameId: number) {
  const gameSlug = getGameSlugById(gameId);

  if (!gameSlug) {
    return [];
  }

  return seedPatchesByGameSlug[gameSlug] ?? [];
}

export function findSeedPatch(gameId: number, version: string) {
  return getSeedPatches(gameId).find((patch) => patch.version === version);
}
