// Seed script: loads pruned data into Supabase via REST API
// Usage: node scripts/seed-supabase.js
// Requires .env.local with SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
// Migration SQL must be run first via Supabase dashboard SQL editor

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Parse CLI flags
const argv = process.argv.slice(2);
const NO_DELETE = argv.includes('--no-delete'); // skip destructive DELETEs
const ONLY_PET = argv.includes('--only-pet'); // seed only pet tier entries (non-destructive flow)

// Load env
const envPath = path.join(__dirname, '..', '.env.local');
const envVars = {};
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const m = line.match(/^\s*([^=]+)=(.*)$/);
    if (m) envVars[m[1].trim()] = m[2].trim();
  }
}

const supabaseUrl = envVars.SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('ERROR: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const prunedDir = path.join(__dirname, '..', 'data', 'seeds', 'pruned');
const rawDir = path.join(__dirname, '..', 'data', 'seeds', 'raw');

function readJSON(file) {
  return JSON.parse(fs.readFileSync(path.join(prunedDir, file), 'utf8'));
}

async function checkTablesExist() {
  try {
    const { error } = await supabase.from('games').select('id').limit(1);
    if (error) return false;
    return true;
  } catch {
    return false;
  }
}

async function columnExists(table, column) {
  const { error } = await supabase.from(table).select(column).limit(1);
  return !error;
}

async function migrate(filePath) {
  const name = path.basename(filePath);
  console.log(`  Migration "${name}" requires manual apply via Supabase dashboard:`);
  console.log(`    1. Open https://supabase.com/dashboard/project/srcsxrvervgjumzuqhit/sql/new`);
  console.log(`    2. Paste the contents of ${filePath}`);
  console.log(`    3. Click "Run"`);
  console.log(`    4. Re-run this seed script`);
  return false;
}

async function clearTable(table) {
  const { error } = await supabase.from(table).delete().neq('id', 0);
  if (error && !error.message?.includes('does not exist')) {
    console.error(`  Error clearing ${table}:`, error.message);
  }
}

async function upsert(table, rows, conflictCols = 'id') {
  if (rows.length === 0) return;
  const batchSize = 100;
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const { error } = await supabase.from(table).upsert(batch, { onConflict: conflictCols });
    if (error) {
      console.error(`  Error inserting into ${table} (batch ${i}):`, error.message);
      return false;
    }
  }
  console.log(`  ${table}: ${rows.length} rows`);
  return true;
}

async function main() {
  console.log('=== GachaHub Supabase Seed ===\n');

  // Step 1: Check if tables exist
  const tablesExist = await checkTablesExist();
  if (!tablesExist) {
    console.log('Tables do not exist yet.');
    console.log('\nRun the migration SQL first:');
    console.log('  1. Open https://supabase.com/dashboard/project/srcsxrvervgjumzuqhit/sql/new');
    console.log(`  2. Copy and paste the contents of db/migrations/0004_combined_schema.sql`);
    console.log('  3. Click "Run"');
    console.log('  4. Re-run this seed script');
    process.exit(0);
  }

  console.log('Tables exist. Starting seed...\n');

  // Step 2: Clear existing data (reverse dependency order)
  const tables = ['imports_raw', 'import_runs', 'tier_entries', 'hero_stats', 'pets', 'gear',
    'game_taxonomies', 'evidence', 'teams', 'guides', 'skills', 'tier_lists', 'characters',
    'patches', 'games', 'users'];
  if (NO_DELETE) {
    console.log('  Skipping destructive table clears (--no-delete)');
  } else {
    for (const t of tables) {
      await clearTable(t);
    }
    console.log('');
  }

  // Step 3: Seed games
  const gamesData = [
    { id: 1, slug: 'seven-knights-rebirth', name: 'Seven Knights: Rebirth', status: 'active',
      description: 'A modern reimagining of the classic Seven Knights RPG experience.' },
    { id: 2, slug: 'brown-dust-2', name: 'Brown Dust 2', status: 'active',
      description: 'A retro-style RPG with strategic combat.' },
    { id: 3, slug: 'dragon-traveler', name: 'Dragon Traveler', status: 'active',
      description: 'An adventure RPG with exploration and collection.' },
  ];
  await upsert('games', gamesData);

  // Step 4: Seed patches
  const patchesData = [
    { id: 1, game_id: 1, version: '1.0.0', title: 'Launch', release_date: '2025-01-01T00:00:00Z',
      notes: 'Initial release of Seven Knights: Rebirth.' },
    { id: 2, game_id: 1, version: '1.1.0', title: 'Balance Patch', release_date: '2025-02-15T00:00:00Z',
      notes: 'Tier adjustments and balance changes.' },
  ];
  await upsert('patches', patchesData);

  // Step 5: Seed characters
  // Load from pruned JSON files and assign predictable IDs
  const charFiles = [
    'seven-knights-rebirth-hero-attack.json',
    'seven-knights-rebirth-hero-defense.json',
    'seven-knights-rebirth-hero-magic.json',
    'seven-knights-rebirth-hero-support.json',
    'seven-knights-rebirth-hero-universal.json',
    'seven-knights-rebirth-hero-rare.json',
  ];
  let allChars = [];
  let charId = 1;
  const charSlugToDbId = {};

  if (!ONLY_PET) {
    console.log('Loading characters...');

    for (const file of charFiles) {
      const heroes = readJSON(file);
      for (const h of heroes) {
        const mapped = {
          id: charId,
          game_id: 1,
          slug: h.slug,
          name: h.name,
          rarity: h.rarity || null,
          element: h.element || null,
          class: h.characterClass || null,
          role: h.characterClass || null,
          description: h.description || '',
        };
        allChars.push(mapped);
        charSlugToDbId[h.slug] = charId;
        charId++;
      }
    }

    // DT and BD2 characters
    const dtChars = readJSON('dragon-traveler.json');
    for (const h of dtChars) {
      const mapped = {
        id: charId,
        game_id: 3,
        slug: h.slug,
        name: h.name,
        rarity: h.rarity || null,
        element: h.element || null,
        class: h.characterClass || null,
        role: h.characterClass || null,
        description: h.description || '',
      };
      allChars.push(mapped);
      charSlugToDbId[h.slug] = charId;
      charId++;
    }

    const bd2Chars = readJSON('brown-dust-2.json');
    for (const h of bd2Chars) {
      const mapped = {
        id: charId,
        game_id: 2,
        slug: h.slug,
        name: h.name,
        rarity: h.rarity || null,
        element: h.element || null,
        class: h.characterClass || null,
        role: h.characterClass || null,
        description: h.description || '',
      };
      allChars.push(mapped);
      charSlugToDbId[h.slug] = charId;
      charId++;
    }

    await upsert('characters', allChars);
    console.log(`  Total characters: ${allChars.length}`);
  } else {
    // If running only pet seeding, we still need the charSlugToDbId map for lookups, so build it
    console.log('Skipping full character seed (--only-pet). Building in-memory name map from existing pruned files.');
    for (const file of charFiles) {
      const heroes = readJSON(file);
      for (const h of heroes) {
        charSlugToDbId[h.slug] = charId;
        charId++;
      }
    }
  }

  // Step 6: Seed skills
  console.log('Loading skills...');
  const skillFiles = [
    { file: 'seven-knights-rebirth-skills.json', gameSlug: 'seven-knights-rebirth' },
    { file: 'dragon-traveler-skills.json', gameSlug: 'dragon-traveler' },
    { file: 'brown-dust-2-skills.json', gameSlug: 'brown-dust-2' },
  ];
  const allSkills = [];
  let skillId = 1;

  for (const { file } of skillFiles) {
    const skills = readJSON(file);
    for (const s of skills) {
      const charDbId = charSlugToDbId[s.character_slug];
      if (!charDbId) {
        console.error(`  WARNING: character_slug ${s.character_slug} not found for skill ${s.slug}`);
        continue;
      }
      const mapped = {
        id: skillId,
        character_id: charDbId,
        slug: s.slug,
        name: s.name,
        type: s.type || null,
        description: s.description || null,
        cooldown_turns: s.cooldown_turns || null,
        cost: s.cost || null,
        power_type: s.power_type || null,
        scaling_stat: s.scaling_stat || null,
        targets: s.targets || null,
        range_type: s.range_type || null,
        order: s.order || 0,
      };
      allSkills.push(mapped);
      skillId++;
    }
  }

  await upsert('skills', allSkills);
  console.log(`  Total skills: ${allSkills.length}`);

  // Step 7: Seed gear
  const gearFiles = ['seven-knights-rebirth-gear.json'];
  const allGear = [];
  let gearId = 1;

  // Hardcoded base gear (6 sets)
  const baseGear = [
    { slug: 'attack-set', name: 'Attack Set', source: 'craft', two_piece_effect: 'ATK +15%', four_piece_effect: 'ATK +30%' },
    { slug: 'speed-set', name: 'Speed Set', source: 'craft', two_piece_effect: 'SPD +10%', four_piece_effect: 'SPD +20%' },
    { slug: 'crit-set', name: 'Crit Set', source: 'craft', two_piece_effect: 'Crit Rate +12%', four_piece_effect: 'Crit DMG +25%' },
    { slug: 'defense-set', name: 'Defense Set', source: 'craft', two_piece_effect: 'DEF +15%', four_piece_effect: 'DEF +30%' },
    { slug: 'hp-set', name: 'HP Set', source: 'craft', two_piece_effect: 'HP +15%', four_piece_effect: 'HP +30%' },
    { slug: 'counter-set', name: 'Counter Set', source: 'craft', two_piece_effect: 'Counter Rate +12%', four_piece_effect: 'Counter DMG +20%' },
  ];

  for (const g of baseGear) {
    allGear.push({ id: gearId++, game_id: 1, ...g, description: null, icon_url: null, tags: null });
  }

  for (const file of gearFiles) {
    const gearList = readJSON(file);
    for (const g of gearList) {
      allGear.push({
        id: gearId++,
        game_id: 1,
        slug: g.slug,
        name: g.name,
        source: g.source || null,
        two_piece_effect: g.twoPieceEffect || null,
        four_piece_effect: g.fourPieceEffect || null,
        description: g.description || null,
        icon_url: g.iconUrl || g.icon_url || null,
        tags: g.tags || null,
      });
    }
  }

  await upsert('gear', allGear);
  console.log(`  Total gear: ${allGear.length}`);

  // Step 8: Seed pets
  const petFiles = ['seven-knights-rebirth-pets.json'];
  const allPets = [];
  let petId = 1;

  const basePets = [
    { slug: 'ember-fox', name: 'Ember Fox', rarity: 'Rare', faction: 'Wild',
      passive1_name: 'Fire Affinity', passive1_description: 'Increases Fire ATK by 10%.', passive2_name: 'Speed Boost', passive2_description: 'Increases SPD by 5%.' },
    { slug: 'storm-hawk', name: 'Storm Hawk', rarity: 'Rare', faction: 'Wild',
      passive1_name: 'Wind Guidance', passive1_description: 'Increases Crit Rate by 8%.', passive2_name: 'Evasion', passive2_description: 'Increases Dodge by 5%.' },
    { slug: 'crystal-turtle', name: 'Crystal Turtle', rarity: 'Uncommon', faction: 'Wild',
      passive1_name: 'Shell Guard', passive1_description: 'Reduces incoming DMG by 8%.', passive2_name: 'Fortitude', passive2_description: 'Increases DEF by 5%.' },
    { slug: 'shadow-wisp', name: 'Shadow Wisp', rarity: 'Uncommon', faction: 'Ethereal',
      passive1_name: 'Dark Veil', passive1_description: 'Increases Effect Resistance by 10%.', passive2_name: 'Leech', passive2_description: 'Heals 3% HP per turn.' },
  ];

  for (const p of basePets) {
    allPets.push({ id: petId++, game_id: 1, ...p, passive1_enhanced: null, passive2_enhanced: null, icon_url: null });
  }

  for (const file of petFiles) {
    const pets = readJSON(file);
    for (const p of pets) {
      allPets.push({
        id: petId++,
        game_id: 1,
        slug: p.slug,
        name: p.name,
        rarity: p.rarity || null,
        faction: p.faction || null,
        passive1_name: p.passive1Name || null,
        passive1_description: p.passive1Description || null,
        passive1_enhanced: p.passive1Enhanced || null,
        passive2_name: p.passive2Name || null,
        passive2_description: p.passive2Description || null,
        passive2_enhanced: p.passive2Enhanced || null,
        icon_url: p.iconUrl || null,
      });
    }
  }

    // Always upsert pets when seeding only-pet or full seed, to ensure pet IDs exist
    await upsert('pets', allPets);
    console.log(`  Total pets: ${allPets.length}`);

  // Step 9: Seed guides
  const guidesData = [
    { id: 1, game_id: 1, slug: 'beginner-guide', title: 'Beginner\'s Guide', guide_type: 'beginner',
      author: 'GachaHub Team', content: '# Welcome to Seven Knights: Rebirth\n\nStart your journey here.', summary: 'Everything you need to get started.', is_verified: true },
    { id: 2, game_id: 1, slug: 'farming-guide', title: 'Farming Guide', guide_type: 'farming',
      author: 'GachaHub Team', content: '# Farming Efficiently\n\nMaximize your resource gains.', summary: 'Best stages and strategies for farming.', is_verified: true },
    { id: 3, game_id: 1, slug: 'team-building', title: 'Team Building Guide', guide_type: 'team-building',
      author: 'GachaHub Team', content: '# Building Effective Teams\n\nSynergy and composition.', summary: 'How to build powerful teams.', is_verified: true },
    { id: 4, game_id: 1, slug: 'advent-guide', title: 'Advent Mode Guide', guide_type: 'advent',
      author: 'GachaHub Team', content: '# Conquering Advent\n\nBoss strategies and rewards.', summary: 'Complete Advent mode guide.', is_verified: true, mode: 'advent' },
    { id: 5, game_id: 1, slug: 'arena-guide', title: 'Arena Strategy Guide', guide_type: 'pvp',
      author: 'GachaHub Team', content: '# Dominating the Arena\n\nPVP tactics and meta.', summary: 'Climb the arena ranks.', is_verified: true, mode: 'pvp' },
  ];
  await upsert('guides', guidesData);

  // Step 10: Seed tier lists
  const tierListsData = [
    { id: 1, game_id: 1, slug: 'pve-tier-list', title: 'PVE Tier List', tier_type: 'pve' },
    { id: 2, game_id: 1, slug: 'pvp-tier-list', title: 'PVP Tier List', tier_type: 'pvp' },
    { id: 3, game_id: 1, slug: 'pet-tier-list', title: 'Pet Tier List', tier_type: 'pet' },
  ];
  await upsert('tier_lists', tierListsData);

  // Step 11: Seed tier entries (from CSV data)
  function stripSuffix(name) {
    return name.replace(/-(T\d|SE)$/, '');
  }

  // Load character name→slug mapping (case-insensitive keys)
  const nameToSlug = {};
  for (const h of allChars) {
    nameToSlug[h.name.toUpperCase()] = h.slug;
  }

  const tierEntriesData = [];
  let teId = 1000; // start after existing IDs

  // Parse PVE tier CSV
  const pveCsvPath = path.join(prunedDir, '..', 'raw', 'seven-knights-rebirth-pvetier.csv');
  if (!ONLY_PET && fs.existsSync(pveCsvPath)) {
    const pveLines = fs.readFileSync(pveCsvPath, 'utf8').split('\n').map(l => l.trimEnd());
    const TIERS = new Set(['SSS', 'SS', 'S', 'A', 'B', 'C', 'D']);

    for (let li = 0; li < pveLines.length; li++) {
      const parts = pveLines[li].split(',');
      const colB = (parts[1] || '').trim();
      const colC = (parts[2] || '').trim();

      if (colC === 'SINGLE-TARGET DAMAGE DEALERS' || colC.indexOf('Refer to') === 0 || colC.indexOf('Last edit') === 0) continue;
      if (pveLines[li].indexOf('CHANGES') >= 0 || pveLines[li].indexOf('===============') >= 0) continue;
      if (pveLines[li].replace(/,/g, '').trim() === '') continue;

      if (colB && TIERS.has(colB) && !colC) {
        const currentTier = colB;
        for (let di = li + 1; di < pveLines.length; di++) {
          const dparts = pveLines[di].split(',');
          const dB = (dparts[1] || '').trim();
          const dC = (dparts[2] || '').trim();

          if (dB && TIERS.has(dB) && !dC) {
            li = di - 1;
            break;
          }

          if (pveLines[di].replace(/,/g, '').trim() === '') continue;

          const seen = new Set();
          for (let i = 1; i < dparts.length; i++) {
            const val = (dparts[i] || '').trim();
            if (!val) continue;
            const stripped = stripSuffix(val);
            const slug = nameToSlug[stripped.toUpperCase()];
            const charDbId = slug ? charSlugToDbId[slug] : null;
            const entryKey = slug + '-' + currentTier;
            if (charDbId && !seen.has(entryKey)) {
              seen.add(entryKey);
              tierEntriesData.push({
                id: teId++, game_id: 1, character_id: charDbId,
                mode: 'pve', tier: currentTier, tier_list_id: 1,
              });
            } else if (!slug && stripped.indexOf('Refer') !== 0 && stripped.indexOf('Last edit') !== 0) {
              console.error(`  WARNING: PVE hero "${stripped}" not found in character roster`);
            }
          }
        }
      }
    }
    console.log(`  PVE tier entries: ${tierEntriesData.filter(e => e.tier_list_id === 1).length}`);
  }

  // Pet tier CSV — depends on pet_id column on tier_entries (migration 0005)
  let hasPetIdCol = await columnExists('tier_entries', 'pet_id');
  if (!hasPetIdCol) {
    console.log('  Applying migration for pet tier support...');
    const migrated = await migrate(path.join(__dirname, '..', 'db', 'migrations', '0005_add_pet_id_to_tier_entries.sql'));
    if (migrated) {
      hasPetIdCol = await columnExists('tier_entries', 'pet_id');
    }
  }
  if (hasPetIdCol) {
    const petCsvPath = path.join(prunedDir, '..', 'raw', 'seven-knights-rebirth-pettier.csv');
    if (fs.existsSync(petCsvPath)) {
      const petLines = fs.readFileSync(petCsvPath, 'utf8').split('\n').map(l => l.trimEnd());
      const TIERS = new Set(['SSS', 'SS', 'S', 'A', 'B', 'C', 'D']);
      const MODE_COLS = [
        { mode: 'pve', colStart: 2, colEnd: 6 },
        { mode: 'pvp', colStart: 7, colEnd: 11 },
        { mode: 'farming', colStart: 12, colEnd: 14 },
      ];

      const petNameToId = {};
      for (const p of allPets) {
        petNameToId[p.name.toUpperCase()] = p.id;
      }

      let currentTier = null;
      for (let li = 0; li < petLines.length; li++) {
        const parts = petLines[li].split(',');
        const colB = (parts[1] || '').trim();

        if (TIERS.has(colB) && !(parts[2] || '').trim()) {
          currentTier = colB;
          continue;
        }
        if (!currentTier) continue;
        if (petLines[li].replace(/,/g, '').trim() === '') continue;

        for (const mc of MODE_COLS) {
          for (let ci = mc.colStart; ci <= mc.colEnd; ci++) {
            const val = (parts[ci] || '').trim();
            if (!val) continue;
            const stripped = stripSuffix(val);
            const petDbId = petNameToId[stripped.toUpperCase()];
            if (petDbId) {
              tierEntriesData.push({
                id: teId++, game_id: 1, character_id: null, pet_id: petDbId,
                mode: mc.mode, tier: currentTier, tier_list_id: 3,
              });
            } else if (stripped.indexOf('Refer') !== 0 && stripped.indexOf('Last edit') !== 0) {
              console.error(`  WARNING: Pet "${stripped}" not found in pet roster`);
            }
          }
        }
      }
      console.log(`  Pet tier entries: ${tierEntriesData.filter(e => e.tier_list_id === 3).length}`);
    }
  } else {
    console.log('  Pet tier entries: skipped (migration could not be applied automatically)');
  }

  // Parse PVP tier CSV (changelog section with tier movements)
  const pvpCsvPath = path.join(prunedDir, '..', 'raw', 'seven-knights-rebirth-pvp.csv');
  if (!ONLY_PET && fs.existsSync(pvpCsvPath)) {
    const pvpLines = fs.readFileSync(pvpCsvPath, 'utf8').split('\n');
    const seenPvp = new Set();

    // Name aliases for character names that differ from CSV
    const nameAliases = {
      'CHA HAE-IN': 'CHA HAEIN',
      'SUN WUKONG': 'SUNWUKONG',
      'FREJYA': 'FREYJA',
      'BRANZE': null,
      'BRANSEL': null,
    };

    for (let i = 0; i < pvpLines.length; i++) {
      const parts = pvpLines[i].split(',');
      const colA = (parts[0] || '').trim();

      const m = colA.match(/^(.+?)\s*~\s*(?:(Added to)\s+)?([A-Z]+)-Tier(?:\s*>\s*([A-Z]+)-Tier)?$/);
      if (!m) continue;

      const rawName = m[1].trim();
      const isAdded = !!m[2];
      const tierA = m[3];
      const tierB = m[4];

      // X > Y means: previous = X, current = Y
      const currentTier = isAdded ? tierA : (tierB || tierA);
      const prevTier = tierB ? tierA : null;

      // Handle dual-hero entries
      const heroNames = [];
      if (rawName.toUpperCase() === 'BRANZE & BRANSEL') {
        continue; // skip — no mapped characters
      } else {
        heroNames.push(rawName);
      }

      for (const hName of heroNames) {
        const alias = nameAliases[hName.toUpperCase()];
        const mappedName = alias === undefined ? hName : alias;
        if (!mappedName) continue;

        const slug = nameToSlug[mappedName.toUpperCase()];
        if (!slug) {
          if (mappedName.indexOf('Refer') !== 0 && mappedName.indexOf('Last edit') !== 0) {
            console.error(`  WARNING: PVP hero "${mappedName}" not found`);
          }
          continue;
        }

        const charDbId = charSlugToDbId[slug];
        if (!charDbId) continue;

        const key = slug + '-' + currentTier;
        if (!seenPvp.has(key)) {
          seenPvp.add(key);
          tierEntriesData.push({
            id: teId++, game_id: 1, character_id: charDbId,
            mode: 'pvp', tier: currentTier, previous_tier: prevTier, tier_list_id: 2,
          });
        }
      }
    }
    console.log(`  PVP tier entries: ${tierEntriesData.filter(e => e.tier_list_id === 2).length}`);
  }

  // If only seeding pets, filter to pet tier entries
  const toUpsert = ONLY_PET ? tierEntriesData.filter(e => e.tier_list_id === 3) : tierEntriesData;
  await upsert('tier_entries', toUpsert);

  // Step 12: Seed teams
  const topSlugs = Object.keys(charSlugToDbId).slice(0, 5);
  const teamsData = [
    { id: 1, game_id: 1, slug: 'destroyer-gaze-raid', name: 'Destroyer Gaze Raid',
      purpose: 'raid', difficulty: 'hard', synergy_score: 85, power_level: 95000,
      character_ids: topSlugs.slice(0, 3).join(','),
      notes: 'Magic team built around Destroyer Gaze mechanics.' },
    { id: 2, game_id: 1, slug: 'pvp-arena-speed', name: 'PVP Arena Speed Team',
      purpose: 'pvp', difficulty: 'medium', synergy_score: 88, power_level: 105000,
      character_ids: topSlugs.slice(0, 3).join(','),
      notes: 'Speed-tuned burst comp.' },
  ];
  await upsert('teams', teamsData);

  // Step 13: Seed hero_stats (5 chars × 5 stats)
  const heroStatsData = [];
  let hsId = 1;
  const stats = [
    { stat_name: 'atk', base_value: 3038, per_level_value: 127 },
    { stat_name: 'def', base_value: 1892, per_level_value: 84 },
    { stat_name: 'hp', base_value: 8765, per_level_value: 412 },
    { stat_name: 'spd', base_value: 110, per_level_value: 2 },
    { stat_name: 'crit', base_value: 41, per_level_value: 0.5 },
  ];

  for (let i = 0; i < Math.min(5, topSlugs.length); i++) {
    const charDbId = charSlugToDbId[topSlugs[i]];
    for (const stat of stats) {
      heroStatsData.push({
        id: hsId++, character_id: charDbId,
        stat_name: stat.stat_name,
        base_value: stat.base_value,
        per_level_value: stat.per_level_value,
      });
    }
  }
  await upsert('hero_stats', heroStatsData);

  console.log('\n=== Seed complete! ===');
  console.log(`  Games: ${gamesData.length}`);
  console.log(`  Patches: ${patchesData.length}`);
  console.log(`  Characters: ${allChars.length}`);
  console.log(`  Skills: ${allSkills.length}`);
  console.log(`  Gear: ${allGear.length}`);
  console.log(`  Pets: ${allPets.length}`);
  console.log(`  Guides: ${guidesData.length}`);
  console.log(`  Tier Lists: ${tierListsData.length}`);
  console.log(`  Tier Entries: ${tierEntriesData.length}`);
  console.log(`  Teams: ${teamsData.length}`);
  console.log(`  Hero Stats: ${heroStatsData.length}`);
  console.log('\nBuilds remain seed-only (no DB table).');
  process.exit(0);
}

main().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
