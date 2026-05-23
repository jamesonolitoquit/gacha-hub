import { moduleRegistry } from '../core/module-registry';
import '../config/games.config';
import fs from 'fs';
import path from 'path';

type SeedCharacter = {
  id: number;
  gameId: number;
  slug: string;
  name: string;
  rarity: string | number | null;
  element: string | null;
  characterClass: string | null;
  role: string | null;
  description: string;
  portraitUrl?: string | null;
  fullArtUrl?: string | null;
  iconUrl?: string | null;
};

type SeedGuide = {
  gameId: number;
  slug: string;
  title: string;
  summary: string;
  content: string;
  guideType: string;
  author?: string;
  characterId?: number | null;
  frontmatter?: Record<string, unknown> | null;
  mode?: string | null;
  boss?: string | null;
  recommendedPower?: number | null;
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

type SeedTierEntry = {
  gameId: number;
  characterId: number | null;
  petId?: number | null;
  mode: string;
  tier: string;
  patchId?: number | null;
  previousTier?: string | null;
  tierListId?: number | null;
  notes?: string | null;
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
    {
      id: 2,
      gameId: 1,
      slug: 'frost-mage',
      name: 'Frost Mage',
      rarity: 5,
      element: 'Ice',
      characterClass: 'Mage',
      role: 'Magician',
      description: 'Ice-elemental spellcaster with high burst damage.',
    },
    {
      id: 3,
      gameId: 1,
      slug: 'shadow-blade',
      name: 'Shadow Blade',
      rarity: 4,
      element: 'Dark',
      characterClass: 'Assassin',
      role: 'Attacker',
      description: 'Stealthy melee DPS with critical strike focus.',
    },
    {
      id: 4,
      gameId: 1,
      slug: 'celestial-priest',
      name: 'Celestial Priest',
      rarity: 4,
      element: 'Light',
      characterClass: 'Priest',
      role: 'Support',
      description: 'Healing and buff support for sustained fights.',
    },
    {
      id: 5,
      gameId: 1,
      slug: 'iron-guardian',
      name: 'Iron Guardian',
      rarity: 3,
      element: 'Fire',
      characterClass: 'Guardian',
      role: 'Defender',
      description: 'Heavy armor tank with taunt and damage mitigation.',
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
      content: `## Early Game\n\nFocus on pushing Adventure stages (Milestone Areas 8 / 11 / 14 / NM 1-1). Run Power Up Dungeon till Stage 10. Clear Raid till Stage 10 — start with Ox King, then Iron Devourer, then Destroyer Gaze. Clear Infinite Tower as much as possible. Score minimally in Castle Rush.\n\n## Midgame\n\nPush Castle Rush scores. Attempt Advent Expedition bosses. Push Power Up Dungeon till Stage 15. Clear Raid till Stage 15 and attempt Sudden Raids. Farm Normal Mode Adventure higher stages (NM 6-1 / 11-1 / 22-1). Clear Infinite Tower & Tower of Trials.\n\n## Endgame\n\nPush Advent Expedition scores. Engage in Raid & Sudden Raid farming for Essence. Perform gear rerolls. Tidy up any non-3-star Adventure stages.\n\n## PVP Progression\n\n- Early: Do Arena as-is for tokens (win or lose)\n- Midgame: Set teams for Advanced Arena (after 14-50). Participate in Real-Time Arena to at least Gold. Form proper Guild War teams. Set 2-3 teams for Total War.\n- Endgame: Comfortably field 3 teams for Real-Time Arena and 4+ teams for Total War. Aim for 440-450 speed for speed teams. Stack stats via transcendence for tank teams.`,
      guideType: 'progression',
      author: 'GachaHub',
      mode: 'pve',
      recommendedPower: 0,
    },
    {
      gameId: 1,
      slug: 'farming-guide',
      title: 'Farming Guide',
      summary: 'Ruby farming efficiency, key bundles, and daily resource planning.',
      content: `## Ruby Farming Basics\n\nRuby farming revolves around key packages purchased with rubies to generate more keys, which in turn generate more rubies through fodder leveling.\n\n## Key Packages\n\n| Package | Cost (per) | Cost (all) | Bundles | Keys |\n|---|---|---|---|---|\n| Package A | 50 | 1,000 | 20 | 1,200 |\n| Package B | 80 | 4,000 | 50 | 3,000 |\n| Package C | 100 | 5,000 | 50 | 3,000 |\n| Package D | 120 | 6,000 | 50 | 3,000 |\n| Package E | 150 | 149,850 | 999 | 59,940 |\n\n## Daily Keys\n\n- F2P: ~780 keys per day\n- With subscriptions: ~1,100 keys per day\n\n## Recommended Packages\n\n- Package A only: Cost 1,000 rubies for 1,200 keys. Best for low-spending players.\n- Packages A+B: Cost 5,000 rubies for 4,200 keys.\n- Packages A+B+C: Cost 10,000 rubies for 7,200 keys.\n\n## Strategy\n\nFarm Adventure stages that drop 2 fodders per run. Use the XP to max fodders and sell them for rubies. Track your net gain to ensure you are ruby-positive each day.`,
      guideType: 'farming',
      author: 'GachaHub',
      mode: 'pve',
      recommendedPower: null,
    },
    {
      gameId: 1,
      slug: 'raid-tactics',
      title: 'Raid Tactics',
      summary: 'Detailed strategies for Destroyer Gaze, Ox King, and Iron Devourer.',
      content: `## Raid Overview\n\nRaids form the core of gear farming. Ensure 100% successful and efficient runs. Accessories play a key role once speed and farming come into play.\n\n## Destroyer Gaze (파멸의 눈동자)\n\n- Type: Magic / MDMG\n- Has MDMG Resistance\n- Recommended approach: Speed Clear\n- Stun immunity and burn immunity required\n\n### Recommended Team\n- Auto-skill: Sieg-T6 (Avenger), Ryan-T6 (Avenger), Shane-T6 (Avenger)\n- Manual alternatives: Biscuit-T6 (Gatekeeper), Rachel-T6 (Avenger)\n\n## Ox King (우마왕)\n\n- Type: Support / MDMG\n- Summons "Red Boils"\n- 0 Defense — focus on raw damage\n\n## Iron Devourer (강철의 포식자)\n\n- Type: DEF / PDMG\n- Has PDMG Resistance\n- Three heads mechanic (middle head is key)\n\n## General Tips\n\n- Aim for T15 3-man farm setups\n- Avenger set is recommended for DPS (DMG dealt +30%, DMG Boost to Boss +40% with 4-piece)\n- Speed clear teams should prioritize consistent clears over risky high-score attempts`,
      guideType: 'boss',
      author: 'GachaHub',
      mode: 'pve',
      boss: 'Destroyer Gaze',
      recommendedPower: 80000,
    },
    {
      gameId: 1,
      slug: 'pvp-arena-guide',
      title: 'PVP Arena Guide',
      summary: 'Arena meta lineups, team archetypes, and pet selection for competitive PVP.',
      content: `## Arena Meta Overview\n\nCurrent arena meta revolves around four main team archetypes: Physical Attack, Magic, Tank/Universal, and Death teams. Each has specific pet and gear requirements.\n\n## Team 1: Attack (Physical)\n\n- Core: Physical DPS heroes with high burst\n- Pet options: JEO (DMG Boost +12%, All ATK +29%)\n- Gear: Assassin set for crit, Avenger set for raw damage\n- Key stats: ATK, Crit Rate, Crit DMG, SPD\n\n## Team 2: Magic\n\n- Core: Magic DPS with area damage\n- Pet options: YEONJI (MATK Boost +21%)\n- Gear: Vanguard set (All ATK +20% / +45% with 4-piece)\n- Key stats: MATK, Effect Hit, SPD\n\n## Team 3: Tank / Universal\n\n- Core: Hybrid defensive line with sustain\n- Pet options: JEB (DMG Resistance -8%, Incoming Healing +15%)\n- Gear: Paladin (HP) or Guardian (DEF) sets\n- Key stats: HP, DEF, Effect Resist, Block Rate\n\n## Team 4: Death\n\n- Core: Debuff-focused composition\n- Pet options: KREE (Effect Hit +19%, All ATK +12%)\n- Gear: Spellweaver set for effect hit / Orchestrator for effect resist\n\n## Pet Tiering\n\n| Pet | Role | Priority |\n|---|---|---|\n| JEO | All-purpose DPS | High |\n| YORANG | AoE attacker counter | Medium |\n| JEB | Tank sustain | High |\n| DELLO | Crit DPS | Medium |\n| WINDY | Bossing hybrid | Medium |`,
      guideType: 'team-comp',
      author: 'GachaHub',
      mode: 'pvp',
      recommendedPower: null,
    },
    {
      gameId: 1,
      slug: 'dungeon-power-up',
      title: 'Power Up Dungeon Guide',
      summary: 'Elemental dungeon strategies with recommended team compositions.',
      content: `## Power Up Dungeon Overview\n\nEach elemental dungeon (Fire, Water, Earth, Light, Dark, Gold) has specific boss mechanics and requires tailored team compositions.\n\n## Comp Types\n\n### Freeze Comp\nControl the boss with freeze effects. Effective against most elemental dungeons. Requires high Effect Hit.\n\n### Nuke Comp\nBurst down the boss in 1-2 turns. Requires highly geared DPS with ATK/Crit stats. Best for farming lower stages.\n\n### Poison Comp\nStack poison debuffs for percentage-based damage. Effective against high-HP bosses. Bypasses DEF.\n\n### Burn Comp\nApply Burn for sustained damage over time. Good against bosses with self-healing mechanics.\n\n### Multi-Hit Comp\nUse heroes with multi-hit skills to break boss shields faster. Essential for certain elemental mechanics.\n\n### Bleed Comp\nStack bleed effects for percentage-based physical damage. Works well against DEF-type bosses.\n\n## Gold Dungeon\n\nSpecial mechanic: "After 5 basic attacks, deals 99,999 Fixed Piercing DMG." Bring heroes with high single-hit burst or ways to avoid the 5-hit trigger.\n\n## General Tips\n\n- Match element advantage for +30% damage\n- Bring at least one support/healer for sustain\n- Adjust comp based on boss immunity patterns\n- Higher stages (T10+) require specific comp types`,
      guideType: 'build',
      author: 'GachaHub',
      mode: 'pve',
      recommendedPower: null,
    },
  ],
};

const seedTierListsByGameSlug: Record<string, SeedTierList[]> = {
  'seven-knights-rebirth': [
    {
      gameId: 1,
      slug: 'pve-tier-list',
      title: 'PVE Meta Tier List',
      tierType: 'pve',
      tiers: '',
    },
    {
      gameId: 1,
      slug: 'pvp-tier-list',
      title: 'PVP Arena Tier List',
      tierType: 'pvp',
      tiers: '',
    },
  ],
};

const seedTierEntries: SeedTierEntry[] = [
  // PVE Tier List (tier list id: 1 for SKR)
  { gameId: 1, characterId: 1, mode: 'pve', tier: 'S',   tierListId: 1 },
  { gameId: 1, characterId: 2, mode: 'pve', tier: 'SS',  tierListId: 1 },
  { gameId: 1, characterId: 3, mode: 'pve', tier: 'A',   tierListId: 1 },
  { gameId: 1, characterId: 4, mode: 'pve', tier: 'A',   tierListId: 1 },
  { gameId: 1, characterId: 5, mode: 'pve', tier: 'B',   tierListId: 1 },
  // PVP Tier List (tier list id: 2 for SKR) with movement tracking
  { gameId: 1, characterId: 1, mode: 'pvp', tier: 'SS',  previousTier: 'S',  tierListId: 2 },
  { gameId: 1, characterId: 2, mode: 'pvp', tier: 'S',   previousTier: 'SS', tierListId: 2 },
  { gameId: 1, characterId: 3, mode: 'pvp', tier: 'SS',  previousTier: 'S',  tierListId: 2 },
  { gameId: 1, characterId: 4, mode: 'pvp', tier: 'B',   tierListId: 2 },
  { gameId: 1, characterId: 5, mode: 'pvp', tier: 'C',   tierListId: 2 },
];

const seedSkills: SeedSkill[] = [
  {
    gameId: 1,
    characterId: 1,
    slug: 'blade-flare',
    name: 'Blade Flare',
    type: 'skill-1',
    description: 'Unleash a blazing sword strike that burns through enemy defenses.',
    cooldownTurns: 3,
    cost: 20,
    powerType: 'Physical',
    scalingStat: 'Attack',
    targets: 'Single target',
    rangeType: 'Melee',
  },
  {
    gameId: 1,
    characterId: 1,
    slug: 'holy-slash',
    name: 'Holy Slash',
    type: 'basic-attack',
    description: 'A sacred blade strike imbued with light energy.',
    cooldownTurns: 0,
    cost: 0,
    powerType: 'Physical',
    scalingStat: 'Attack',
    targets: 'Single target',
    rangeType: 'Melee',
  },
  {
    gameId: 1,
    characterId: 2,
    slug: 'ice-storm',
    name: 'Ice Storm',
    type: 'skill-1',
    description: 'Conjure a violent hailstorm that damages all enemies and slows their movement.',
    cooldownTurns: 4,
    cost: 30,
    powerType: 'Magical',
    scalingStat: 'Magic',
    targets: 'All enemies',
    rangeType: 'Ranged',
  },
  {
    gameId: 1,
    characterId: 2,
    slug: 'frost-bolt',
    name: 'Frost Bolt',
    type: 'basic-attack',
    description: 'Launch a bolt of ice at a single target.',
    cooldownTurns: 0,
    cost: 0,
    powerType: 'Magical',
    scalingStat: 'Magic',
    targets: 'Single target',
    rangeType: 'Ranged',
  },
  {
    gameId: 1,
    characterId: 3,
    slug: 'shadow-strike',
    name: 'Shadow Strike',
    type: 'skill-1',
    description: 'Strike from the shadows with lethal precision, guaranteed critical hit.',
    cooldownTurns: 3,
    cost: 25,
    powerType: 'Physical',
    scalingStat: 'Attack',
    targets: 'Single target',
    rangeType: 'Melee',
  },
  {
    gameId: 1,
    characterId: 4,
    slug: 'divine-heal',
    name: 'Divine Heal',
    type: 'skill-1',
    description: 'Channel celestial energy to restore ally HP and cleanse debuffs.',
    cooldownTurns: 3,
    cost: 20,
    powerType: 'Magical',
    scalingStat: 'Magic',
    targets: 'All allies',
    rangeType: 'Ranged',
  },
  {
    gameId: 1,
    characterId: 5,
    slug: 'fortress-stance',
    name: 'Fortress Stance',
    type: 'skill-1',
    description: 'Raise shield and fortify defenses, taunting all enemies.',
    cooldownTurns: 4,
    cost: 15,
    powerType: 'Physical',
    scalingStat: 'Defense',
    targets: 'Self',
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

type SeedHeroStat = {
  characterSlug: string;
  stats: { statName: string; baseValue: number; perLevel: number | null; maxValue: number | null }[];
};

type SeedBuild = {
  characterSlug: string;
  gameSlug: string;
  gearSet1: { weapon: string; armor: string; accessory: string; setName: string };
  gearSet2?: { weapon: string; armor: string; accessory: string; setName: string };
  transcendencePath: string[];
  skillPriority: string[];
  statPriorities: string[];
  keyUsage: string[];
  exclusiveEquipment?: string;
  notes?: string;
};

type SeedTeam = {
  gameId: number;
  slug: string;
  name: string;
  characterSlugs: string[];
  purpose: string;
  difficulty: string;
  synergyScore: number;
  powerLevel: number;
  gearRecommendations?: Record<string, { setName: string; weapon: string; armor: string; accessory: string }>;
  notes?: string;
};

type SeedGear = {
  id: number;
  gameId: number;
  slug: string;
  name: string;
  source: string | null;
  twoPieceEffect: string | null;
  fourPieceEffect: string | null;
  description: string | null;
  iconUrl: string | null;
  tags: string[] | null;
};

type SeedPet = {
  id: number;
  gameId: number;
  slug: string;
  name: string;
  rarity: string | null;
  faction: string | null;
  passive1Name: string | null;
  passive1Description: string | null;
  passive1Enhanced: string | null;
  passive2Name: string | null;
  passive2Description: string | null;
  passive2Enhanced: string | null;
  iconUrl: string | null;
};

const seedGearByGameSlug: Record<string, SeedGear[]> = {
  'seven-knights-rebirth': [
    {
      id: 1,
      gameId: 1,
      slug: 'attack-set',
      name: 'Attack Set',
      source: 'Hunt / Crafting',
      twoPieceEffect: 'ATK +35%',
      fourPieceEffect: 'All attacks ignore 15% of target DEF',
      description: 'A powerful offensive set for damage dealers.',
      iconUrl: null,
      tags: ['offense', 'damage'],
    },
    {
      id: 2,
      gameId: 1,
      slug: 'speed-set',
      name: 'Speed Set',
      source: 'Hunt / Crafting',
      twoPieceEffect: 'SPD +25%',
      fourPieceEffect: 'Grants an extra turn after using a non-attack skill',
      description: 'Outpace the enemy with superior speed.',
      iconUrl: null,
      tags: ['support', 'speed'],
    },
    {
      id: 3,
      gameId: 1,
      slug: 'crit-set',
      name: 'Crit Set',
      source: 'Hunt / Crafting',
      twoPieceEffect: 'Crit Chance +12%',
      fourPieceEffect: 'Crit DMG +40%',
      description: 'Amplify critical hit potential.',
      iconUrl: null,
      tags: ['offense', 'crit'],
    },
    {
      id: 4,
      gameId: 1,
      slug: 'defense-set',
      name: 'Defense Set',
      source: 'Hunt / Crafting',
      twoPieceEffect: 'DEF +25%',
      fourPieceEffect: 'All incoming damage reduced by 15%',
      description: 'Fortify your frontline with enhanced durability.',
      iconUrl: null,
      tags: ['defense', 'survival'],
    },
    {
      id: 5,
      gameId: 1,
      slug: 'hp-set',
      name: 'HP Set',
      source: 'Hunt / Crafting',
      twoPieceEffect: 'HP +25%',
      fourPieceEffect: 'Heal for 10% of max HP at the start of each turn',
      description: 'Maximize survivability with relentless recovery.',
      iconUrl: null,
      tags: ['defense', 'sustain'],
    },
    {
      id: 6,
      gameId: 1,
      slug: 'counter-set',
      name: 'Counter Set',
      source: 'Hunt / Crafting',
      twoPieceEffect: 'Counter Chance +20%',
      fourPieceEffect: 'Counter-attacks deal 30% more damage',
      description: 'Turn enemy aggression against them.',
      iconUrl: null,
      tags: ['defense', 'counter'],
    },
  ],
};

const seedPetsByGameSlug: Record<string, SeedPet[]> = {
  'seven-knights-rebirth': [
    {
      id: 1,
      gameId: 1,
      slug: 'ember-fox',
      name: 'Ember Fox',
      rarity: 'Legendary',
      faction: 'Wildlands',
      passive1Name: 'Flame Ward',
      passive1Description: 'Allies take 8% less Fire damage.',
      passive1Enhanced: 'Allies take 15% less Fire damage.',
      passive2Name: 'Burning Gaze',
      passive2Description: 'Attacks have a 20% chance to inflict Burn for 2 turns.',
      passive2Enhanced: 'Attacks have a 35% chance to inflict Burn for 2 turns.',
      iconUrl: null,
    },
    {
      id: 2,
      gameId: 1,
      slug: 'storm-hawk',
      name: 'Storm Hawk',
      rarity: 'Epic',
      faction: 'Wildlands',
      passive1Name: 'Tailwind',
      passive1Description: 'Allies gain 5 SPD.',
      passive1Enhanced: 'Allies gain 10 SPD.',
      passive2Name: 'Thunder Dive',
      passive2Description: 'Attacks have a 15% chance to Stun for 1 turn.',
      passive2Enhanced: 'Attacks have a 25% chance to Stun for 1 turn.',
      iconUrl: null,
    },
    {
      id: 3,
      gameId: 1,
      slug: 'crystal-turtle',
      name: 'Crystal Turtle',
      rarity: 'Epic',
      faction: 'Ancient',
      passive1Name: 'Crystal Shell',
      passive1Description: 'Allies take 6% less damage from all sources.',
      passive1Enhanced: 'Allies take 12% less damage from all sources.',
      passive2Name: 'Reflective Shield',
      passive2Description: 'Reflects 15% of incoming damage back to the attacker.',
      passive2Enhanced: 'Reflects 25% of incoming damage back to the attacker.',
      iconUrl: null,
    },
    {
      id: 4,
      gameId: 1,
      slug: 'shadow-wisp',
      name: 'Shadow Wisp',
      rarity: 'Legendary',
      faction: 'Ancient',
      passive1Name: 'Dark Aura',
      passive1Description: 'Enemies take 8% more Dark damage.',
      passive1Enhanced: 'Enemies take 15% more Dark damage.',
      passive2Name: 'Soul Drain',
      passive2Description: 'Heals for 10% of damage dealt.',
      passive2Enhanced: 'Heals for 20% of damage dealt.',
      iconUrl: null,
    },
  ],
};

const seedHeroStatsByCharacterSlug: Record<string, Record<string, { statName: string; baseValue: number; perLevel: number | null; maxValue: number | null }[]>> = {
  'seven-knights-rebirth': {
    'sword-knight': [
      { statName: 'atk', baseValue: 3412, perLevel: 142, maxValue: 7892 },
      { statName: 'def', baseValue: 1789, perLevel: 78, maxValue: 4129 },
      { statName: 'hp', baseValue: 9234, perLevel: 435, maxValue: 21456 },
      { statName: 'spd', baseValue: 112, perLevel: 2, maxValue: 152 },
      { statName: 'crit', baseValue: 38, perLevel: 0.5, maxValue: 58 },
    ],
    'frost-mage': [
      { statName: 'atk', baseValue: 3789, perLevel: 158, maxValue: 8756 },
      { statName: 'def', baseValue: 1456, perLevel: 62, maxValue: 3345 },
      { statName: 'hp', baseValue: 8123, perLevel: 378, maxValue: 18765 },
      { statName: 'spd', baseValue: 108, perLevel: 2, maxValue: 148 },
      { statName: 'crit', baseValue: 42, perLevel: 0.5, maxValue: 62 },
    ],
    'shadow-blade': [
      { statName: 'atk', baseValue: 3245, perLevel: 135, maxValue: 7560 },
      { statName: 'def', baseValue: 1567, perLevel: 68, maxValue: 3621 },
      { statName: 'hp', baseValue: 7890, perLevel: 365, maxValue: 18234 },
      { statName: 'spd', baseValue: 125, perLevel: 2, maxValue: 165 },
      { statName: 'crit', baseValue: 48, perLevel: 0.5, maxValue: 68 },
    ],
    'celestial-priest': [
      { statName: 'atk', baseValue: 2678, perLevel: 112, maxValue: 6234 },
      { statName: 'def', baseValue: 1890, perLevel: 82, maxValue: 4356 },
      { statName: 'hp', baseValue: 10234, perLevel: 478, maxValue: 23789 },
      { statName: 'spd', baseValue: 105, perLevel: 2, maxValue: 145 },
      { statName: 'crit', baseValue: 35, perLevel: 0.5, maxValue: 55 },
    ],
    'iron-guardian': [
      { statName: 'atk', baseValue: 2234, perLevel: 95, maxValue: 5234 },
      { statName: 'def', baseValue: 2345, perLevel: 102, maxValue: 5345 },
      { statName: 'hp', baseValue: 12345, perLevel: 567, maxValue: 28456 },
      { statName: 'spd', baseValue: 98, perLevel: 2, maxValue: 138 },
      { statName: 'crit', baseValue: 32, perLevel: 0.5, maxValue: 52 },
    ],
  },
};

const seedBuildsByGameSlug: Record<string, SeedBuild[]> = {
  'seven-knights-rebirth': [],
};

const seedTeamsByGameSlug: Record<string, SeedTeam[]> = {
  'seven-knights-rebirth': [
    {
      gameId: 1,
      slug: 'destroyer-gaze-raid',
      name: 'Destroyer Gaze Raid',
      characterSlugs: ['sword-knight', 'frost-mage', 'shadow-blade'],
      purpose: 'raid',
      difficulty: 'hard',
      synergyScore: 85,
      powerLevel: 95000,
      gearRecommendations: {
        'sword-knight': { setName: 'Counter Set', weapon: 'Bounty Blade', armor: 'Bounty Armor', accessory: 'Guts Ring' },
        'frost-mage': { setName: 'Attack Set', weapon: 'Arcane Staff', armor: 'Arcane Robe', accessory: 'Mana Pendant' },
        'shadow-blade': { setName: 'Crit Set', weapon: 'Assassin Dagger', armor: 'Assassin Garb', accessory: 'Crit Ring' },
      },
      notes: 'Magic team built around Destroyer Gaze mechanics. Bring stun and burn immunity.',
    },
    {
      gameId: 1,
      slug: 'ox-king-raid',
      name: 'Ox King Raid',
      characterSlugs: ['sword-knight', 'celestial-priest', 'frost-mage'],
      purpose: 'raid',
      difficulty: 'medium',
      synergyScore: 78,
      powerLevel: 82000,
      gearRecommendations: {
        'sword-knight': { setName: 'Defense Set', weapon: 'Guardian Axe', armor: 'Guardian Armor', accessory: 'DEF Charm' },
        'celestial-priest': { setName: 'HP Set', weapon: 'Guardian Mace', armor: 'Guardian Plate', accessory: 'HP Pendant' },
        'frost-mage': { setName: 'Attack Set', weapon: 'Arcane Staff', armor: 'Arcane Robe', accessory: 'Mana Pendant' },
      },
      notes: 'Ox King has 0 DEF — focus raw damage. Celestial Priest provides sustain.',
    },
    {
      gameId: 1,
      slug: 'pvp-arena-speed',
      name: 'PVP Arena Speed Team',
      characterSlugs: ['shadow-blade', 'frost-mage', 'sword-knight'],
      purpose: 'pvp',
      difficulty: 'medium',
      synergyScore: 88,
      powerLevel: 105000,
      gearRecommendations: {
        'shadow-blade': { setName: 'Speed Set', weapon: 'Spellweave Dagger', armor: 'Spellweave Garb', accessory: 'Speed Boots' },
        'frost-mage': { setName: 'Speed Set', weapon: 'Spellweave Staff', armor: 'Spellweave Robe', accessory: 'Speed Boots' },
        'sword-knight': { setName: 'Counter Set', weapon: 'Bounty Blade', armor: 'Bounty Armor', accessory: 'Guts Ring' },
      },
      notes: 'Speed-tuned burst comp. Aim for 440+ SPD on Shadow Blade to outspeed enemy DPS.',
    },
    {
      gameId: 1,
      slug: 'guild-war-defense',
      name: 'Guild War Defense',
      characterSlugs: ['iron-guardian', 'celestial-priest', 'sword-knight'],
      purpose: 'gvg',
      difficulty: 'medium',
      synergyScore: 82,
      powerLevel: 98000,
      gearRecommendations: {
        'iron-guardian': { setName: 'Defense Set', weapon: 'Guardian Axe', armor: 'Guardian Armor', accessory: 'DEF Charm' },
        'celestial-priest': { setName: 'HP Set', weapon: 'Guardian Mace', armor: 'Guardian Plate', accessory: 'HP Pendant' },
        'sword-knight': { setName: 'Counter Set', weapon: 'Bounty Blade', armor: 'Bounty Armor', accessory: 'Guts Ring' },
      },
      notes: 'Tanky sustain line. Iron Guardian draws aggro while Celestial Priest heals.',
    },
    {
      gameId: 1,
      slug: 'adventure-farming',
      name: 'Adventure Farming',
      characterSlugs: ['sword-knight', 'frost-mage', 'celestial-priest'],
      purpose: 'pve',
      difficulty: 'easy',
      synergyScore: 75,
      powerLevel: 65000,
      notes: 'General-purpose clear team for Adventure stages up to NM 6-1. Balanced damage and sustain.',
    },
    {
      gameId: 1,
      slug: 'infinite-tower',
      name: 'Infinite Tower',
      characterSlugs: ['frost-mage', 'shadow-blade', 'celestial-priest'],
      purpose: 'pve',
      difficulty: 'hard',
      synergyScore: 80,
      powerLevel: 88000,
      gearRecommendations: {
        'frost-mage': { setName: 'Attack Set', weapon: 'Arcane Staff', armor: 'Arcane Robe', accessory: 'Mana Pendant' },
        'shadow-blade': { setName: 'Crit Set', weapon: 'Assassin Dagger', armor: 'Assassin Garb', accessory: 'Crit Ring' },
        'celestial-priest': { setName: 'HP Set', weapon: 'Guardian Mace', armor: 'Guardian Plate', accessory: 'HP Pendant' },
      },
      notes: 'High floors require CC and burst. Frost Mage provides freeze control.',
    },
  ],
};

export function getGameSlugById(gameId: number) {
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

let _seedCharactersByGameSlugCache: Record<string, SeedCharacter[]> = {};

export function getSeedCharactersByGameSlug(gameSlug: string) {
  const resolvedGameSlug = getGameSlugByLookup(gameSlug);
  if (!resolvedGameSlug) return [];
  if (_seedCharactersByGameSlugCache[resolvedGameSlug]) return _seedCharactersByGameSlugCache[resolvedGameSlug];

  const base = seedCharactersByGameSlug[resolvedGameSlug] ?? [];

  try {
    const prunedDir = path.join(process.cwd(), 'data', 'seeds', 'pruned');
    const candidates = [`${resolvedGameSlug}.json`, `${resolvedGameSlug}.sample.json`];
    const loaded: any[] = [];

    for (const candidate of candidates) {
      const full = path.join(prunedDir, candidate);
      if (fs.existsSync(full)) {
        const raw = fs.readFileSync(full, 'utf8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          loaded.push(...parsed);
        }
      }
    }

    if (loaded.length === 0) {
      _seedCharactersByGameSlugCache[resolvedGameSlug] = base;
      return base;
    }

    const slugSet = new Set(base.map((b) => b.slug));
    const merged = [...base];

    loaded.forEach((c: any, i: number) => {
      const slug = c.slug ?? `seed-${i + 1}`;
      if (!slugSet.has(slug)) {
        slugSet.add(slug);
        merged.push({
          id: c.id ?? merged.length + 1,
          gameId: c.gameId ?? 1,
          slug,
          name: c.name ?? `Seed ${merged.length + 1}`,
          rarity: c.rarity ?? null,
          element: c.element ?? null,
          characterClass: c.characterClass ?? c.class ?? null,
          role: c.characterClass ?? c.role ?? null,
          description: c.description ?? '',
          portraitUrl: c.portraitUrl ?? c.portrait_url ?? null,
          fullArtUrl: c.fullArtUrl ?? c.full_art_url ?? null,
          iconUrl: c.iconUrl ?? c.icon_url ?? null,
        });
      }
    });

    _seedCharactersByGameSlugCache[resolvedGameSlug] = merged;
    return merged;
  } catch (err) {
    _seedCharactersByGameSlugCache[resolvedGameSlug] = base;
    return base;
  }
}

export function findSeedCharacter(gameId: number, slug: string) {
  const inMemory = getSeedCharacters(gameId).find((character) => character.slug === slug);

  if (inMemory) {
    // attempt to augment in-memory seed with pruned/sample file data if available
    try {
      const prunedDir = path.join(process.cwd(), 'data', 'seeds', 'pruned');
      if (fs.existsSync(prunedDir)) {
        const files = fs.readdirSync(prunedDir).filter((f) => f.endsWith('.json'));
        for (const file of files) {
          const raw = fs.readFileSync(path.join(prunedDir, file), 'utf8');
          const parsed = JSON.parse(raw);
          if (!Array.isArray(parsed)) continue;
          const match = parsed.find((entry: any) => Number(entry?.gameId ?? 0) === Number(gameId) && entry?.slug === slug);
          if (match) {
            return {
              ...inMemory,
              portraitUrl: inMemory.portraitUrl ?? match.portraitUrl ?? match.portrait_url ?? null,
              fullArtUrl: inMemory.fullArtUrl ?? match.fullArtUrl ?? match.full_art_url ?? null,
              iconUrl: inMemory.iconUrl ?? match.iconUrl ?? match.icon_url ?? null,
            };
          }
        }
      }
    } catch {
      // ignore and fall back to inMemory
    }

    return inMemory;
  }

  try {
    const prunedDir = path.join(process.cwd(), 'data', 'seeds', 'pruned');
    const candidates = fs.existsSync(prunedDir) ? fs.readdirSync(prunedDir).filter((file) => file.endsWith('.json')) : [];

    for (const candidate of candidates) {
      const raw = fs.readFileSync(path.join(prunedDir, candidate), 'utf8');
      const parsed = JSON.parse(raw);

      if (!Array.isArray(parsed)) {
        continue;
      }

      const match = parsed.find((entry: any) => Number(entry?.gameId ?? 0) === Number(gameId) && entry?.slug === slug);

      if (match) {
        return {
          id: Number(match.id ?? 1),
          gameId: Number(match.gameId ?? gameId),
          slug: String(match.slug ?? slug),
          name: String(match.name ?? slug),
          rarity: match.rarity ?? null,
          element: match.element ?? null,
          characterClass: match.characterClass ?? match.role ?? match.class ?? null,
          role: match.characterClass ?? match.role ?? null,
          description: String(match.description ?? ''),
          portraitUrl: match.portraitUrl ?? match.portrait_url ?? null,
          fullArtUrl: match.fullArtUrl ?? match.full_art_url ?? null,
          iconUrl: match.iconUrl ?? match.icon_url ?? null,
        };
      }
    }
  } catch {
    // fall through to undefined
  }

  return undefined;
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

type SeedSkillWithSlug = {
  character_slug: string;
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

let externalSkillsCache: SeedSkillWithSlug[] | null = null;
let characterSlugToIdCache: Map<string, number> | null = null;

function loadExternalSkills(): SeedSkillWithSlug[] {
  if (externalSkillsCache) return externalSkillsCache;
  try {
    const filePath = path.join(process.cwd(), 'data', 'seeds', 'pruned', 'seven-knights-rebirth-skills.json');
    if (!fs.existsSync(filePath)) {
      externalSkillsCache = [];
      return externalSkillsCache;
    }
    const raw = fs.readFileSync(filePath, 'utf8');
    externalSkillsCache = JSON.parse(raw) as SeedSkillWithSlug[];
    return externalSkillsCache;
  } catch {
    externalSkillsCache = [];
    return externalSkillsCache;
  }
}

function getCharacterSlugToIdMap(): Map<string, number> {
  if (characterSlugToIdCache) return characterSlugToIdCache;
  const map = new Map<string, number>();
  const seen = new Set<number>();
  const allChars = seedCharactersByGameSlug['seven-knights-rebirth'] ?? [];
  for (const c of allChars) {
    if (!seen.has(c.id)) {
      seen.add(c.id);
      map.set(c.slug, c.id);
    }
  }
  try {
    const filePath = path.join(process.cwd(), 'data', 'seeds', 'pruned', 'seven-knights-rebirth.json');
    if (fs.existsSync(filePath)) {
      const ext = JSON.parse(fs.readFileSync(filePath, 'utf8')) as any[];
      ext.forEach((c: any, i: number) => {
        const id = c.id ?? allChars.length + i + 1;
        if (!seen.has(id)) {
          seen.add(id);
          map.set(c.slug, id);
        }
      });
    }
  } catch {}
  characterSlugToIdCache = map;
  return characterSlugToIdCache;
}

export function getSeedSkills(characterId: number) {
  const fromHardcoded = seedSkills.filter((skill) => skill.characterId === characterId);
  const slugToId = getCharacterSlugToIdMap();
  const slug = [...slugToId.entries()].find(([, id]) => id === characterId)?.[0];
  if (!slug) return fromHardcoded;
  const external = loadExternalSkills();
  const fromExternal = external
    .filter((s) => s.character_slug === slug)
    .map((s) => ({
      id: 0,
      gameId: 0,
      characterId,
      slug: s.slug,
      name: s.name,
      type: s.type,
      description: s.description,
      cooldownTurns: s.cooldownTurns,
      cost: s.cost,
      powerType: s.powerType,
      scalingStat: s.scalingStat,
      targets: s.targets,
      rangeType: s.rangeType,
    }));
  return [...fromHardcoded, ...fromExternal];
}

export function getSeedSkillsByGameId(gameId: number) {
  const fromHardcoded = seedSkills.filter((skill) => skill.gameId === gameId);
  return [...fromHardcoded];
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

export function getSeedTierEntries() {
  return seedTierEntries;
}

export function findSeedTierEntriesByTierList(tierListId: number) {
  return seedTierEntries.filter((entry) => entry.tierListId === tierListId);
}

export function findSeedTierEntriesForCharacter(gameId: number, characterId: number) {
  return seedTierEntries.filter((entry) => entry.gameId === gameId && entry.characterId === characterId);
}

let _seedGearCache: Record<number, SeedGear[]> = {};

export function getSeedGear(gameId: number) {
  const gameSlug = getGameSlugById(gameId);
  if (!gameSlug) return [];
  if (_seedGearCache[gameId]) return _seedGearCache[gameId];
  const base = seedGearByGameSlug[gameSlug] ?? [];

  try {
    const prunedDir = path.join(process.cwd(), 'data', 'seeds', 'pruned');
    const file = `${gameSlug}-gear.json`;
    const full = path.join(prunedDir, file);
    if (!fs.existsSync(full)) {
      _seedGearCache[gameId] = base;
      return base;
    }
    const raw = fs.readFileSync(full, 'utf8');
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      _seedGearCache[gameId] = base;
      return base;
    }
    const slugSet = new Set(base.map((g) => g.slug));
    const merged = [...base];
    for (const item of parsed) {
      const slug = item.slug;
      if (slug && !slugSet.has(slug)) {
        slugSet.add(slug);
        merged.push({
          id: item.id ?? merged.length + 1,
          gameId,
          slug,
          name: item.name ?? slug,
          source: item.source ?? null,
          twoPieceEffect: item.twoPieceEffect ?? null,
          fourPieceEffect: item.fourPieceEffect ?? null,
          description: item.description ?? null,
          iconUrl: item.iconUrl ?? null,
          tags: item.tags ?? null,
        });
      }
    }
    _seedGearCache[gameId] = merged;
    return merged;
  } catch {
    _seedGearCache[gameId] = base;
    return base;
  }
}

export function findSeedGear(gameId: number, slug: string) {
  return getSeedGear(gameId).find((g) => g.slug === slug) ?? null;
}

let _seedPetsCache: Record<number, SeedPet[]> = {};

export function getSeedPets(gameId: number) {
  const gameSlug = getGameSlugById(gameId);
  if (!gameSlug) return [];
  if (_seedPetsCache[gameId]) return _seedPetsCache[gameId];
  const base = seedPetsByGameSlug[gameSlug] ?? [];

  try {
    const prunedDir = path.join(process.cwd(), 'data', 'seeds', 'pruned');
    const file = `${gameSlug}-pets.json`;
    const full = path.join(prunedDir, file);
    if (!fs.existsSync(full)) {
      _seedPetsCache[gameId] = base;
      return base;
    }
    const raw = fs.readFileSync(full, 'utf8');
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      _seedPetsCache[gameId] = base;
      return base;
    }
    const slugSet = new Set(base.map((p) => p.slug));
    const merged = [...base];
    for (const item of parsed) {
      const slug = item.slug;
      if (slug && !slugSet.has(slug)) {
        slugSet.add(slug);
        merged.push({
          id: item.id ?? merged.length + 1,
          gameId,
          slug,
          name: item.name ?? slug,
          rarity: item.rarity ?? null,
          faction: item.faction ?? null,
          passive1Name: item.passive1Name ?? null,
          passive1Description: item.passive1Description ?? null,
          passive1Enhanced: item.passive1Enhanced ?? null,
          passive2Name: item.passive2Name ?? null,
          passive2Description: item.passive2Description ?? null,
          passive2Enhanced: item.passive2Enhanced ?? null,
          iconUrl: item.iconUrl ?? null,
        });
      }
    }
    _seedPetsCache[gameId] = merged;
    return merged;
  } catch {
    _seedPetsCache[gameId] = base;
    return base;
  }
}

export function findSeedPet(gameId: number, slug: string) {
  return getSeedPets(gameId).find((p) => p.slug === slug) ?? null;
}

export function getSeedHeroStats(characterId: number): { statName: string; baseValue: number; perLevel: number | null; maxValue: number | null }[] {
  const defaultStats = [
    { statName: 'atk', baseValue: 3038, perLevel: 127, maxValue: null },
    { statName: 'def', baseValue: 1892, perLevel: 84, maxValue: null },
    { statName: 'hp', baseValue: 8765, perLevel: 412, maxValue: null },
    { statName: 'spd', baseValue: 110, perLevel: 2, maxValue: null },
    { statName: 'crit', baseValue: 41, perLevel: 0.5, maxValue: null },
  ];

  for (const [gameSlug, entries] of Object.entries(seedHeroStatsByCharacterSlug)) {
    const seedChars: SeedCharacter[] = seedCharactersByGameSlug[gameSlug] ?? [];
    const char = seedChars.find((c) => c.id === characterId);
    if (char && char.slug in entries) {
      return entries[char.slug] ?? defaultStats;
    }
  }

  return defaultStats;
}

let _prunedBuildsCache: Record<number, SeedBuild[]> = {};

export function getSeedBuilds(gameId: number): SeedBuild[] {
  const gameSlug = getGameSlugById(gameId);
  if (!gameSlug) return [];
  if (_prunedBuildsCache[gameId]) return _prunedBuildsCache[gameId];
  const base = seedBuildsByGameSlug[gameSlug] ?? [];

  try {
    const prunedDir = path.join(process.cwd(), 'data', 'seeds', 'pruned');
    const file = `${gameSlug}-builds.json`;
    const full = path.join(prunedDir, file);
    if (!fs.existsSync(full)) {
      _prunedBuildsCache[gameId] = base;
      return base;
    }
    const raw = fs.readFileSync(full, 'utf8');
    const parsed: SeedBuild[] = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      _prunedBuildsCache[gameId] = base;
      return base;
    }
    const slugSet = new Set(base.map((b) => b.characterSlug));
    const merged: SeedBuild[] = [...base];
    for (const item of parsed) {
      const slug = item.characterSlug;
      if (slug && !slugSet.has(slug)) {
        slugSet.add(slug);
        merged.push(item);
      }
    }
    _prunedBuildsCache[gameId] = merged;
    return merged;
  } catch {
    _prunedBuildsCache[gameId] = base;
    return base;
  }
}

export function findSeedBuildForCharacter(gameId: number, characterSlug: string): SeedBuild | null {
  return getSeedBuilds(gameId).find((b) => b.characterSlug === characterSlug) ?? null;
}

export function getSeedTeams(gameId: number): SeedTeam[] {
  const gameSlug = getGameSlugById(gameId);
  if (!gameSlug) return [];
  return seedTeamsByGameSlug[gameSlug] ?? [];
}

export function findSeedTeam(gameId: number, slug: string): SeedTeam | null {
  const gameSlug = getGameSlugById(gameId);
  if (!gameSlug) return null;
  return seedTeamsByGameSlug[gameSlug]?.find((t) => t.slug === slug) ?? null;
}
