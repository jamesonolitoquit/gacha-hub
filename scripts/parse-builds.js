const fs = require('fs');
const path = require('path');

// Proper CSV row parser that handles quoted fields
function parseCsvRow(line) {
  const cells = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      cells.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  cells.push(current.trim());
  return cells;
}

// --- Hero slug lookup ---
function loadHeroSlugs() {
  const classes = ['attack', 'defense', 'magic', 'support', 'universal', 'rare'];
  const map = {};
  for (const cls of classes) {
    const file = path.join(__dirname, '..', 'data', 'seeds', 'pruned', `seven-knights-rebirth-hero-${cls}.json`);
    if (fs.existsSync(file)) {
      const heroes = JSON.parse(fs.readFileSync(file, 'utf8'));
      for (const h of heroes) {
        map[h.name] = h.slug;
      }
    }
  }
  return map;
}

// --- Gear set name mapping ---
const GEAR_PREFIX_MAP = {
  'BOUNTY': 'Bounty Tracker',
  'VAN': 'Vanguard',
  'PALADIN': 'Paladin',
  'GATEKEEP': 'Gatekeeper',
  'GUARDIAN': 'Guardian',
  'ASSASSIN': 'Assassin',
  'AVENGER': 'Avenger',
  'SPELLWEAVE': 'Spellweaver',
  'ORCHES': 'Orchestrator',
};

const ACCESSORY_NAMES = new Set([
  'GUTS', 'IMMORTAL', 'REVIVE', 'BOSSDMG', '45DMG', 'CRIT', 'WEAKNESS',
  'BLOCK', 'DEATH', 'HEALBACK', 'CC', 'BARRIERATK', 'DOT', 'HP', 'DEF', 'FREEZE',
  'POISON', 'BURN', 'BLEED', 'NONE', '13DMG', 'EFFECTHIT', 'BARRIERHP', 'BARRIERDEF',
]);

function parseGearItem(str) {
  if (!str || str === '#VALUE!' || str === '#N/A') return null;
  const parts = str.split('-');
  const prefix = parts[0];
  const setName = GEAR_PREFIX_MAP[prefix] || null;
  const type = parts.length > 1 ? parts.slice(1).join('-') : null;
  return { raw: str, setName, type };
}

function isAccessory(val) {
  return ACCESSORY_NAMES.has(val);
}

function isGearWeaponArmor(val) {
  const u = val.toUpperCase();
  return u.endsWith('-PWEAPON') || u.endsWith('-MWEAPON') || u.endsWith('-WEAPON') || u.endsWith('-ARMOR');
}

function isKeyUsage(val) {
  const u = val.toUpperCase();
  return /^[A-Z][A-Z\s\/\-]+$/.test(u) && u.length > 2 &&
    (u.includes('PVE') || u.includes('PVP') || u.includes('ADVENT') ||
     u.includes('TOWER') || u.includes('ARENA') || u.includes('WAR') ||
     u.includes('RAID') || u.includes('GUILD') || u.includes('NONE') ||
     u.includes('KARMA') || u.includes('CR-') || u.includes('PUDUNGEON') ||
     u.includes('SUDDENRAID') || u.includes('TOTAL'));
}

// --- Find summary lines (-T0) in CSV ---
function findSummaryLines(lines) {
  const results = [];
  for (let i = 0; i < lines.length; i++) {
    const cells = parseCsvRow(lines[i]);
    for (let j = 0; j < Math.min(cells.length, 5); j++) {
      const val = cells[j].trim();
      if (/-T\d/.test(val)) {
        results.push({ line: i, name: val.replace(/-T\d.*$/, '').trim() });
        break;
      }
    }
  }
  return results;
}

// --- Find character block starts (either TRANSCENDENCE or SKILL ENHANCEMENT) ---
function findCharBlocks(lines) {
  const blocks = [];
  // Method 1: TRANSCENDENCE marker (class CSVs)
  for (let i = 0; i < lines.length; i++) {
    const cells = parseCsvRow(lines[i]);
    for (let j = 0; j < cells.length; j++) {
      const val = cells[j].trim();
      if (val === 'TRANSCENDENCE') {
        const nameCell = (cells[2] || '').trim();
        if (nameCell && nameCell !== '#VALUE!' && nameCell !== '#N/A') {
          blocks.push({ line: i, name: nameCell, type: 'transcendence' });
        }
        break;
      }
    }
  }
  // Method 2: SKILL ENHANCEMENT marker without TRANSCENDENCE (rare CSV)
  for (let i = 0; i < lines.length; i++) {
    const cells = parseCsvRow(lines[i]);
    // Check no TRANSCENDENCE in this row
    let hasTransc = false;
    for (const c of cells) {
      if (c.trim() === 'TRANSCENDENCE') { hasTransc = true; break; }
    }
    if (hasTransc) continue;

    for (let j = 0; j < cells.length; j++) {
      const val = cells[j].trim();
      if (val === 'SKILL ENHANCEMENT') {
        const nameCell = (cells[1] || cells[2] || '').trim();
        if (nameCell && nameCell !== 'SKILL ENHANCEMENT' && nameCell.length > 2) {
          // Check if this name starts with a letter (not a CSV artifact)
          if (/^[A-Z]/.test(nameCell)) {
            blocks.push({ line: i, name: nameCell, type: 'skillonly' });
          }
        }
        break;
      }
    }
  }
  return blocks;
}

// --- Extract stat keywords from cells ---
const STAT_KEYWORDS = [
  'Crit Rate', 'Crit DMG', 'All ATK (%)', 'All ATK', 'ATK%', 'Weakness Hit',
  'Effect Hit', 'Block Rate', 'Effect Resistance', 'Speed', 'DMG Taken Reduction',
  'DEF (%)', 'HP (%)', 'DEF%', 'HP%',
];

function extractStatPriorities(cells) {
  const stats = [];
  for (const c of cells) {
    const v = c.trim();
    if (STAT_KEYWORDS.includes(v) && !stats.includes(v)) {
      stats.push(v);
    }
  }
  return stats;
}

// --- Parse a class-based CSV (attack, defense, magic, support, universal) ---
function parseClassCsv(lines, charBlocks, summaryLines, heroSlugMap) {
  const builds = [];

  for (let si = 0; si < summaryLines.length; si++) {
    const summary = summaryLines[si];
    const summaryCells = parseCsvRow(lines[summary.line]);
    const charName = summary.name;

    // Find corresponding character block
    let block = null;
    for (let bi = charBlocks.length - 1; bi >= 0; bi--) {
      if (charBlocks[bi].line < summary.line && charBlocks[bi].type === 'transcendence') {
        const bn = charBlocks[bi].name;
        if (bn.toUpperCase() === charName.toUpperCase() ||
            charName.toUpperCase().includes(bn.toUpperCase()) ||
            bn.toUpperCase().includes(charName.toUpperCase())) {
          block = charBlocks[bi];
          break;
        }
      }
    }

    const charSlug = heroSlugMap[charName] || charName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    // Extract gear from summary line
    const { gearSet1, gearSet2, keyUsage } = extractGearFromSummary(summaryCells, lines, summary.line);

    // Extract other data from character block
    const result = extractBlockData(lines, block, summary);

    const build = {
      characterSlug: charSlug,
      gameSlug: 'seven-knights-rebirth',
    };
    if (gearSet1) build.gearSet1 = gearSet1;
    if (gearSet2) build.gearSet2 = gearSet2;
    if (result.transcendencePath.length > 0) build.transcendencePath = result.transcendencePath;
    if (result.skillPriority.length > 0) build.skillPriority = result.skillPriority;
    if (result.statPriorities.length > 0) build.statPriorities = result.statPriorities;
    if (keyUsage.length > 0) build.keyUsage = keyUsage;
    if (result.exclusiveEquipment) build.exclusiveEquipment = result.exclusiveEquipment;
    if (result.notes) build.notes = result.notes;

    builds.push(build);
  }

  return builds;
}

// --- Extract data from character block ---
function extractBlockData(lines, block, summary) {
  let transcendencePath = [];
  let skillPriority = [];
  let statPriorities = [];
  let notes = '';
  let exclusiveEquipment = '';

  if (!block) return { transcendencePath, skillPriority, statPriorities, notes, exclusiveEquipment };

  const bi = block.line;

  // Transcendence row: 3 rows after TRANSCENDENCE
  if (block.type === 'transcendence') {
    const transcRow = lines[bi + 3];
    if (transcRow) {
      const tcells = parseCsvRow(transcRow);
      // First half: transcendence values (containing % or +)
      const transcVals = [];
      // After about 4 transc values, the rest are skill priority
      const allVals = tcells.map(c => c.trim()).filter(c => c && c !== '#VALUE!' && c !== '#N/A');

      // First 4-6 values with %/+ are transcendence
      const skillStartIdx = allVals.findIndex(v =>
        v.includes('BASIC ATK') || v.includes('SKILL 1') || v.includes('skill')
      );

      if (skillStartIdx > 0) {
        transcendencePath = allVals.slice(0, skillStartIdx).filter(v => v.includes('%') || v.includes('+'));
        const skills = allVals.slice(skillStartIdx);
        skillPriority = skills.map(s => normalizeSkillName(s));
      } else {
        // Fallback: split by % pattern
        for (const v of allVals) {
          if (v.includes('%') || v.includes('+')) {
            transcendencePath.push(v);
          } else if (v.includes('SKILL') || v.includes('BASIC') || v.includes('PASSIVE') || v.includes('AWAKENED')) {
            skillPriority.push(normalizeSkillName(v));
          }
        }
      }
    }
  }

  // Build names: find GEAR BUILDS row
  let buildNames = [];
  for (let ri = bi; ri < Math.min(bi + 15, lines.length); ri++) {
    const cells = parseCsvRow(lines[ri]);
    const hasGearBuilds = cells.some(c => c.trim().includes('GEAR BUILDS'));
    if (hasGearBuilds) {
      const nameRow = ri + 2 < lines.length ? parseCsvRow(lines[ri + 2]) : [];
      const names = [];
      for (const nc of nameRow) {
        const v = nc.trim();
        if (v && v !== '#VALUE!' && v !== '#N/A' && !v.includes('GEAR') && !v.includes('KEY') &&
            !v.includes('USAGE') && !v.includes('PVE') && !v.includes('PVP') && v.length > 2) {
          const upper = v.toUpperCase();
          if (!/^(SPEED|CRIT|WEAKNESS|EFFECT|ALL|DMG|ATK|HP|DEF|BLOCK|REVIVE|IMMORTAL)$/.test(upper)) {
            names.push(v);
          }
        }
      }
      buildNames = names;
      break;
    }
  }

  // Notes: find NOTES: section (use CSV parser)
  for (let ri = bi; ri < Math.min(bi + 30, lines.length); ri++) {
    const cells = parseCsvRow(lines[ri]);
    for (let ci = 0; ci < cells.length; ci++) {
      const val = cells[ci].trim();
      if (val.startsWith('NOTES:')) {
        // Note text is in the next cell
        if (ci + 1 < cells.length) {
          const noteText = cells[ci + 1].trim();
          if (noteText && noteText.length > 5) {
            if (notes) notes += ' ';
            notes += noteText;
          }
        }
      }
    }
  }

  // Exclusive equipment: find cells containing % near EXCLUSIVE EQUIPMENT rows
  for (let ri = bi; ri < Math.min(bi + 30, lines.length); ri++) {
    const cells = parseCsvRow(lines[ri]);
    for (let ci = 0; ci < cells.length; ci++) {
      const val = cells[ci].trim();
      if (val.includes('EXCLUSIVE EQUIPMENT')) {
        const equipVals = [];
        // Check next 4 rows for cells containing % (actual equip bonuses)
        for (let dr = 1; dr <= 4; dr++) {
          if (ri + dr < lines.length) {
            const rowCells = parseCsvRow(lines[ri + dr]);
            for (const rc of rowCells) {
              const rv = rc.trim();
              if (rv && rv !== '#VALUE!' && rv !== '#N/A' && rv !== '-' &&
                  (rv.includes('%') || rv.includes('+')) &&
                  !rv.includes('NOTES') && !rv.includes('GEAR') && !rv.includes('VIEW') &&
                  !rv.includes('LAST') && !rv.includes('HERO') && !rv.includes('FALSE') &&
                  !rv.includes('TRUE') && !rv.includes('NONE') && !rv.includes('EARLY') &&
                  !rv.includes('MIDGAME') && !rv.includes('END')) {
                equipVals.push(rv);
              }
            }
          }
        }
        if (equipVals.length > 0) {
          exclusiveEquipment = [...new Set(equipVals)].join(', ');
        }
        break;
      }
    }
  }

  // Stat priorities from rows after block
  for (let ri = bi + 4; ri < Math.min(bi + 25, lines.length); ri++) {
    const cells = parseCsvRow(lines[ri]);
    const stats = extractStatPriorities(cells);
    for (const s of stats) {
      if (!statPriorities.includes(s)) statPriorities.push(s);
    }
  }

  return { transcendencePath, skillPriority, statPriorities, notes, exclusiveEquipment };
}

function eqStatCheck(v) {
  return ['Crit Rate', 'Crit DMG', 'All ATK (%)', 'Weakness Hit', 'Effect Hit',
    'Block Rate', 'Effect Resistance', 'Speed', 'DMG Taken Reduction'].includes(v);
}

function normalizeSkillName(s) {
  const lower = s.toLowerCase();
  // Map known names to canonical form
  if (lower.includes('basic')) return 'basic-attack';
  if (lower.includes('skill 1') || lower.includes('skill-1') || (lower.includes('skill') && lower.includes('btm'))) return 'skill-1';
  if (lower.includes('skill 2') || lower.includes('skill-2') || (lower.includes('skill') && lower.includes('top'))) return 'skill-2';
  if (lower.includes('passive')) return 'passive';
  if (lower.includes('awakened') || lower.includes('awaken')) return 'awakened';
  // Fallback
  return lower.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// --- Extract gear from summary line ---
function extractGearFromSummary(summaryCells, lines, lineNum) {
  const gearItems = [];
  const keyUsage = [];

  // Classify cells
  for (let ci = 5; ci < summaryCells.length; ci++) {
    const val = summaryCells[ci].trim();
    if (!val || val === '#VALUE!' || val === '#N/A') continue;

    const upper = val.toUpperCase();
    if (isGearWeaponArmor(upper)) {
      gearItems.push({ index: ci, value: val, type: 'gear' });
    } else if (isAccessory(upper)) {
      gearItems.push({ index: ci, value: val, type: 'accessory' });
    } else if (isKeyUsage(upper)) {
      keyUsage.push(val);
    } else {
      // Could be extra gear (BOSSDMG, CRIT, etc. on second line)
      gearItems.push({ index: ci, value: val, type: 'extra' });
    }
  }

  // Also check next line for additional items
  if (lineNum + 1 < lines.length) {
    const nextCells = parseCsvRow(lines[lineNum + 1]);
    for (let ci = 5; ci < nextCells.length; ci++) {
      const val = nextCells[ci].trim();
      if (!val || val === '#VALUE!' || val === '#N/A') continue;
      const upper = val.toUpperCase();
      if (isGearWeaponArmor(upper)) {
        gearItems.push({ index: ci + 100, value: val, type: 'gear' });
      } else if (isAccessory(upper)) {
        gearItems.push({ index: ci + 100, value: val, type: 'accessory' });
      } else if (isKeyUsage(upper)) {
        if (!keyUsage.includes(val)) keyUsage.push(val);
      }
    }
  }

  // Group into builds
  const buildsData = [];
  let currentBuild = null;
  for (const item of gearItems) {
    const upper = item.value.toUpperCase();
    if (isGearWeaponArmor(upper) && upper.endsWith('WEAPON')) {
      if (currentBuild) buildsData.push(currentBuild);
      currentBuild = { weapon: item.value, armor: null, accessory: null, extra: null };
    } else if (upper.endsWith('-ARMOR') && currentBuild) {
      currentBuild.armor = item.value;
    } else if (item.type === 'accessory' && currentBuild) {
      if (!currentBuild.accessory) currentBuild.accessory = item.value;
      else currentBuild.extra = item.value;
    } else if (item.type === 'extra' && currentBuild) {
      if (!currentBuild.extra) currentBuild.extra = item.value;
    }
  }
  if (currentBuild) buildsData.push(currentBuild);

  const gs1 = buildsData[0] ? {
    weapon: buildsData[0].weapon || '',
    armor: buildsData[0].armor || '',
    accessory: buildsData[0].accessory || '',
    setName: parseGearItem(buildsData[0].weapon)?.setName || '',
  } : null;

  const gs2 = buildsData[1] ? {
    weapon: buildsData[1].weapon || '',
    armor: buildsData[1].armor || '',
    accessory: buildsData[1].accessory || '',
    setName: parseGearItem(buildsData[1].weapon)?.setName || '',
  } : null;

  // Filter 'none' from key usage
  const filteredKeyUsage = keyUsage
    .map(k => k.toLowerCase().replace(/\s+/g, '-'))
    .filter(k => k !== 'none' && !k.includes('none-'));

  return { gearSet1: gs1, gearSet2: gs2, keyUsage: filteredKeyUsage };
}

// --- Parse rare CSV ---
function parseRareCsv(lines, charBlocks, summaryLines, heroSlugMap) {
  const builds = [];

  for (let si = 0; si < summaryLines.length; si++) {
    const summary = summaryLines[si];
    const summaryCells = parseCsvRow(lines[summary.line]);
    const charName = summary.name;

    // Find corresponding character block
    let block = null;
    for (let bi = charBlocks.length - 1; bi >= 0; bi--) {
      if (charBlocks[bi].line < summary.line && charBlocks[bi].type === 'skillonly') {
        const bn = charBlocks[bi].name;
        if (bn.toUpperCase() === charName.toUpperCase() ||
            charName.toUpperCase().includes(bn.toUpperCase()) ||
            bn.toUpperCase().includes(charName.toUpperCase())) {
          block = charBlocks[bi];
          break;
        }
      }
    }

    const charSlug = heroSlugMap[charName] || charName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    // Extract gear from summary
    const { gearSet1, gearSet2, keyUsage } = extractGearFromSummary(summaryCells, lines, summary.line);

    // Extract skill priority and stats from block
    let statPriorities = [];
    let notes = '';
    let exclusiveEquipment = '';

    if (block) {
      // Skill priority row: 3 rows after SKILL ENHANCEMENT
      const skillRow = lines[block.line + 3];
      if (skillRow) {
        const skillCells = parseCsvRow(skillRow);
        const skills = [];
        for (const c of skillCells) {
          const v = c.trim();
          if (v.includes('SKILL') || v.includes('BASIC') || v.includes('PASSIVE') || v.includes('AWAKENED')) {
            skills.push(normalizeSkillName(v));
          }
        }
        if (skills.length > 0) {
          // Use as skillPriority if not default order
          const defaultOrder = ['basic-attack', 'skill-1', 'skill-2', 'passive', 'awakened'];
          if (JSON.stringify(skills) !== JSON.stringify(defaultOrder)) {
            // The order may actually be different
          }
        }
      }

      // Stat priorities
      for (let ri = block.line + 4; ri < Math.min(block.line + 25, lines.length); ri++) {
        const cells = parseCsvRow(lines[ri]);
        const stats = extractStatPriorities(cells);
        for (const s of stats) {
          if (!statPriorities.includes(s)) statPriorities.push(s);
        }
      }

      // Notes
      for (let ri = block.line; ri < Math.min(block.line + 30, lines.length); ri++) {
        const cells = parseCsvRow(lines[ri]);
        for (let ci = 0; ci < cells.length; ci++) {
          const val = cells[ci].trim();
          if (val.startsWith('NOTES:')) {
            if (ci + 1 < cells.length) {
              const noteText = cells[ci + 1].trim();
              if (noteText && noteText.length > 5) {
                if (notes) notes += ' ';
                notes += noteText;
              }
            }
          }
        }
      }
    }

    const build = {
      characterSlug: charSlug,
      gameSlug: 'seven-knights-rebirth',
    };
    if (gearSet1) build.gearSet1 = gearSet1;
    if (gearSet2) build.gearSet2 = gearSet2;
    if (statPriorities.length > 0) build.statPriorities = statPriorities;
    if (keyUsage.length > 0) build.keyUsage = keyUsage;
    if (notes) build.notes = notes;

    builds.push(build);
  }

  return builds;
}

// --- Main ---
const heroSlugMap = loadHeroSlugs();
console.log('Hero slug map:', Object.keys(heroSlugMap).length, 'entries');

const classCsvFiles = [
  'seven-knights-rebirth-build-attack.csv',
  'seven-knights-rebirth-build-defense.csv',
  'seven-knights-rebirth-build-magic.csv',
  'seven-knights-rebirth-build-support.csv',
  'seven-knights-rebirth-build-universal.csv',
];

const rareCsvFile = 'seven-knights-rebirth-build-rare.csv';

const allBuilds = [];
const seenSlugs = new Set();

// Parse class CSVs
for (const csvFile of classCsvFiles) {
  const filePath = path.join(__dirname, '..', 'data', 'seeds', 'raw', csvFile);
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const charBlocks = findCharBlocks(lines);
  const summaryLines = findSummaryLines(lines);
  const builds = parseClassCsv(lines, charBlocks, summaryLines, heroSlugMap);
  console.log(`${csvFile}: ${builds.length} builds (${charBlocks.length} blocks, ${summaryLines.length} summaries)`);
  for (const build of builds) {
    if (!seenSlugs.has(build.characterSlug)) {
      seenSlugs.add(build.characterSlug);
      allBuilds.push(build);
    }
  }
}

// Parse rare CSV
{
  const filePath = path.join(__dirname, '..', 'data', 'seeds', 'raw', rareCsvFile);
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const charBlocks = findCharBlocks(lines);
  const summaryLines = findSummaryLines(lines);
  const builds = parseRareCsv(lines, charBlocks, summaryLines, heroSlugMap);
  console.log(`${rareCsvFile}: ${builds.length} builds (${charBlocks.length} blocks, ${summaryLines.length} summaries)`);
  for (const build of builds) {
    if (!seenSlugs.has(build.characterSlug)) {
      seenSlugs.add(build.characterSlug);
      allBuilds.push(build);
    }
  }
}

console.log(`\nTotal unique builds: ${allBuilds.length}`);

// Check for missing coverage
const allSlugs = Object.values(heroSlugMap);
const missing = allSlugs.filter(s => !seenSlugs.has(s));
if (missing.length > 0) {
  console.log(`Missing builds for: ${missing.join(', ')}`);
}

// Write output
const outputPath = path.join(__dirname, '..', 'data', 'seeds', 'pruned', 'seven-knights-rebirth-builds.json');
fs.writeFileSync(outputPath, JSON.stringify(allBuilds, null, 2), 'utf8');
console.log('Written to', outputPath);
