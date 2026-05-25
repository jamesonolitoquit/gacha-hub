import { moduleRegistry } from '../core/module-registry';
import '../config/games.config';

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

type SeedPatch = {
  gameId: number;
  version: string;
  title: string | null;
  notes: string | null;
  releaseDate: string;
  changes: string | null;
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

export function getGameSlugById(gameId: number) {
  return moduleRegistry.list()[gameId - 1]?.slug;
}

function getGameSlugByLookup(gameSlugOrId: string | number) {
  if (typeof gameSlugOrId === 'number') {
    return getGameSlugById(gameSlugOrId);
  }

  return gameSlugOrId;
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
