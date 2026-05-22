const fs = require('fs');
const path = require('path');
const { classifyTab } = require('./classify-tab');

const rawDir = path.join(__dirname, '..', 'data', 'seeds', 'raw');
const normalizedDir = path.join(__dirname, '..', 'data', 'seeds', 'normalized');

const CLASS_MAP = {
  attack: 'Attack',
  magic: 'Magic',
  defense: 'Defense',
  support: 'Support',
  universal: 'Universal',
  rare: null,
};

const NON_HERO_NAMES = new Set([
  'VIEW FULL SKILLSET', 'LAST UPDATED', 'HERO PROPERTIES', 'EXCLUSIVE EQUIPMENT',
  'Has awakening', 'OTHER PVE', 'OUTCLASSED', 'FODDER', 'NONE', 'FALSE', 'TRUE',
  'NEW', 'COLLAB',
]);

const PRE_SECTION_OVERRIDE = {
  'karl-heron': 'Legendary+',
  'o-mok': 'Legendary+',
};

function slugify(text) {
  return String(text || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parseCSVLine(line) {
  const cells = [];
  let current = '';
  let inQuotes = false;
  for (let k = 0; k < line.length; k++) {
    const ch = line[k];
    if (ch === '"') {
      if (inQuotes && k + 1 < line.length && line[k + 1] === '"') {
        current += '"';
        k++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      cells.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  cells.push(current);
  return cells;
}

function joinMultilineCSV(text) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let k = 0; k < text.length; k++) {
    const ch = text[k];
    if (ch === '"') {
      if (inQuotes && k + 1 < text.length && text[k + 1] === '"') {
        current += '"';
        k++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === '\n' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  if (current) result.push(current);
  return result;
}

function loadRareClassMap() {
  let rosterPath = path.join(rawDir, 'seven-knights-rebirth-roster-r.csv');
  if (!fs.existsSync(rosterPath)) {
    rosterPath = path.join(rawDir, 'seven-knights-rebirth-rareroster-sheet.csv');
  }
  if (!fs.existsSync(rosterPath)) return {};
  const raw = fs.readFileSync(rosterPath, 'utf8');
  const lines = joinMultilineCSV(raw);
  const typeMap = { ATK: 'Attack', DEF: 'Defense', MAG: 'Magic', MAGIC: 'Magic', SUP: 'Support', SUPPORT: 'Support', UNI: 'Universal', UNIVERSAL: 'Universal' };
  const map = {};
  let sectionCount = 0;
  for (let i = 0; i < lines.length; i++) {
    const cells = parseCSVLine(lines[i]);
    const col1 = (cells[1] || '').trim();
    const heroCell = (cells[4] || '').trim();
    const typeCell = (cells[5] || '').trim().toUpperCase();
    if (col1.match(/^\d+$/) && heroCell && typeMap[typeCell]) {
      const cleanName = heroCell.replace(/-T\d+$/,'');
      map[slugify(cleanName)] = typeMap[typeCell];
      sectionCount++;
    }
  }
  console.log(`  Loaded ${sectionCount} rare hero class mappings from roster CSV`);
  return map;
}

function getNotesCell(cells) {
  let last = '';
  for (let j = 0; j < cells.length - 1; j++) {
    const c = (cells[j] || '').trim().toUpperCase();
    if (c === 'NOTES:' || c === 'NOTES') {
      let val = (cells[j + 1] || '').trim();
      val = val.replace(/^"|"$/g, '').replace(/""/g, '"').replace(/\\n/g, ' ');
      if (val) last = val;
    }
  }
  return last;
}

function isHeroRow(cells) {
  const name = (cells[2] || '').trim();
  if (!name || name.length < 2) return false;
  if (/^[A-Z\s]+$/.test(name) && name.split(' ').length > 3) return false;
  if (NON_HERO_NAMES.has(name)) return false;
  if (name.includes('-T') || name.includes('-T0') || name.includes('-T1') || name.includes('-T2')) return false;
  const line = cells.join(',');
  if (line.includes('TRANSCENDENCE') || line.includes('SKILL ENHANCEMENT') || line.includes('POTENTIALS') || line.includes('CORE ROLE')) {
    return true;
  }
  return false;
}

function detectRarityMarker(line) {
  if (line.includes(',LEGENDARY++')) return 'Legendary++';
  if (line.match(/,LEGENDARY\+[^+]/)) return 'Legendary+';
  if (line.includes(',LEGENDARY,')) return 'Legendary';
  if (line.includes(',COLLAB,')) return 'Collab';
  return null;
}

function extractHeroesFromCSV(csvText, fileRole, rareClassMap) {
  const lines = csvText.split('\n');
  const heroes = [];
  let currentRarity = null;
  let hasSeenSection = false;
  const isRare = fileRole === 'rare';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const cells = parseCSVLine(line);

    if (i > 3) {
      const marker = detectRarityMarker(line);
      if (marker) {
        currentRarity = marker;
        hasSeenSection = true;
      }
    }

    if (isHeroRow(cells)) {
      const name = cells[2].trim();
      if (!name || name.length < 2 || name.startsWith('#') || name.startsWith('=')) continue;

      const nextHeroLine = lines.slice(i + 1).findIndex(l => {
        const c = parseCSVLine(l);
        return isHeroRow(c) || l.includes(',,OTHER PVE') || l.includes(',,OUTCLASSED') || l.includes(',,FODDER');
      });
      const blockEnd = nextHeroLine >= 0 ? i + 1 + nextHeroLine : lines.length;
      const block = lines.slice(i, blockEnd);
      let description = '';
      for (const bl of block) {
        const d = getNotesCell(parseCSVLine(bl));
        if (d) description = d;
      }

      const slug = slugify(name);
      let rarity = currentRarity;

      if (!rarity && PRE_SECTION_OVERRIDE[slug]) {
        rarity = PRE_SECTION_OVERRIDE[slug];
      }

      if (isRare) {
        rarity = 'Rare';
      }

      let characterClass = CLASS_MAP[fileRole] || null;
      if (isRare && characterClass === null) {
        characterClass = rareClassMap[slug] || null;
      }

      heroes.push({
        name,
        slug,
        characterClass,
        rarity,
        element: null,
        description: description || '',
      });
    }
  }

  return heroes;
}

function process() {
  if (!fs.existsSync(rawDir)) {
    console.error('No raw CSV directory found at', rawDir);
    console.log('Skipping CSV processing — no raw files available.');
    return;
  }

  const allFiles = fs.readdirSync(rawDir).filter(f => f.endsWith('.csv'));
  const files = allFiles.filter(f => {
    const type = classifyTab(path.join(rawDir, f));
    return type === 'build';
  });
  if (files.length === 0) {
    console.log('No CSV files found in', rawDir);
    return;
  }

  if (!fs.existsSync(normalizedDir)) {
    fs.mkdirSync(normalizedDir, { recursive: true });
  }

  const rareClassMap = loadRareClassMap();
  const allHeroes = [];

  files.forEach((file) => {
    const csvText = fs.readFileSync(path.join(rawDir, file), 'utf8');
    const fileBase = path.basename(file, '.csv').toLowerCase();
    const fileRole = fileBase.replace('seven-knights-rebirth-', '').replace('build-', '').replace('-sheet', '');

    const heroes = extractHeroesFromCSV(csvText, fileRole, rareClassMap);
    allHeroes.push(...heroes);

    const outName = `seven-knights-rebirth-hero-${fileRole}.json`;
    fs.writeFileSync(
      path.join(normalizedDir, outName),
      JSON.stringify(heroes, null, 2),
      'utf8'
    );
    console.log(`Wrote ${heroes.length} heroes to ${outName}`);
  });

  const seen = new Set();
  const deduped = allHeroes.filter(h => {
    if (seen.has(h.slug)) return false;
    seen.add(h.slug);
    return true;
  });

  if (deduped.length < allHeroes.length) {
    console.log(`Deduped ${allHeroes.length - deduped.length} duplicate hero entries`);
  }

  const combined = path.join(normalizedDir, 'seven-knights-rebirth.json');
  fs.writeFileSync(combined, JSON.stringify(deduped, null, 2), 'utf8');

  const nonNullRarity = deduped.filter(h => h.rarity).length;
  const nonNullClass = deduped.filter(h => h.characterClass).length;
  console.log(`Total: ${deduped.length} heroes (rarity=${nonNullRarity}/${deduped.length}, class=${nonNullClass}/${deduped.length})`);
}

process();
