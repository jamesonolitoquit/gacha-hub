const fs = require('fs');
const path = require('path');

const rawDir = path.join(__dirname, '..', 'data', 'seeds', 'raw');
const normalizedDir = path.join(__dirname, '..', 'data', 'seeds', 'normalized');

const TYPE_MAP = { ATK: 'Attack', DEF: 'Defense', MAG: 'Magic', MAGIC: 'Magic', SUP: 'Support', SUPPORT: 'Support', UNI: 'Universal', UNIVERSAL: 'Universal' };

const RARITY_MAP = { 'roster-l++': 'Legendary++', 'roster-l+': 'Legendary+', 'roster-l': 'Legendary', 'roster-r': 'Rare', 'roster-collab': 'Collab' };

const SKILL_NAMES = ['passive', 'basicAttack', 'skill1', 'skill2', 'awakenedSkill'];

const MAIN_SKILL_COLS = [10, 14, 18, 22, 26];
const SUB_ENHANCE_COLS = [10, 14, 18, 22, 26];
const SUB_TRANSCEND_COLS = [11, 15, 19, 23, 27];

function slugify(text) {
  return String(text || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
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

function cleanCell(val) {
  if (!val) return '';
  return val.trim();
}

function isNumberRow(cells) {
  const v = cleanCell(cells[1] || '');
  return /^\d+$/.test(v);
}

function isSubRow(cells) {
  const v = cleanCell(cells[8] || '');
  return v === 'Skill Enhancements' || v === 'Transcendence Effects' || v === 'Effect Descriptions';
}

function isSectionBreak(line) {
  return /^,+,LEGENDARY|^,+,COLLAB|^,+,.+LEGENDARY/i.test(line);
}

function parseRoster(csvText, rarity) {
  const lines = joinMultilineCSV(csvText);
  const heroes = [];
  let currentHero = null;

  for (let i = 0; i < lines.length; i++) {
    const cells = parseCSVLine(lines[i]);

    if (isNumberRow(cells)) {
      if (currentHero) heroes.push(currentHero);
      const rawName = cleanCell(cells[4] || '');
      const name = rawName.replace(/-T\d+$/, '').trim();
      if (!name) {
        currentHero = null;
        continue;
      }
      const typeCode = cleanCell(cells[5] || '').toUpperCase();
      currentHero = {
        name,
        slug: slugify(name),
        type: TYPE_MAP[typeCode] || null,
        rarity,
        skills: {},
        subData: {},
      };
      for (let si = 0; si < SKILL_NAMES.length; si++) {
        const val = cleanCell(cells[MAIN_SKILL_COLS[si]] || '');
        if (val) {
          currentHero.skills[SKILL_NAMES[si]] = { description: val };
        }
      }
    } else if (currentHero && isSubRow(cells)) {
      const subType = cleanCell(cells[8]);
      const key = subType === 'Skill Enhancements' ? 'enhancements'
                : subType === 'Transcendence Effects' ? 'transcendence'
                : subType === 'Effect Descriptions' ? 'effectDescriptions'
                : null;
      if (!key) continue;

      const subCols = subType === 'Transcendence Effects' ? SUB_TRANSCEND_COLS : SUB_ENHANCE_COLS;

      if (key === 'effectDescriptions') {
        for (let si = 0; si < subCols.length; si++) {
          const val = cleanCell(cells[subCols[si]] || '');
          if (val && val !== '-') {
            if (!currentHero.subData[key]) currentHero.subData[key] = {};
            if (!currentHero.subData[key][SKILL_NAMES[si]]) currentHero.subData[key][SKILL_NAMES[si]] = [];
            val.split('\n').filter(Boolean).forEach(line => {
              const trimmed = line.trim();
              if (trimmed) currentHero.subData[key][SKILL_NAMES[si]].push(trimmed);
            });
          }
        }
      } else {
        for (let si = 0; si < SKILL_NAMES.length; si++) {
          const val = cleanCell(cells[subCols[si]] || '');
          if (val && val !== '-') {
            if (!currentHero.subData[key]) currentHero.subData[key] = {};
            if (!currentHero.subData[key][SKILL_NAMES[si]]) currentHero.subData[key][SKILL_NAMES[si]] = [];
            currentHero.subData[key][SKILL_NAMES[si]].push(val);
          }
        }
      }
    }
  }

  if (currentHero) heroes.push(currentHero);

  for (const hero of heroes) {
    for (const skillName of SKILL_NAMES) {
      if (!hero.skills[skillName]) continue;
      const skill = hero.skills[skillName];
      if (hero.subData.enhancements && hero.subData.enhancements[skillName]) {
        skill.enhancements = hero.subData.enhancements[skillName];
      }
      if (hero.subData.transcendence && hero.subData.transcendence[skillName]) {
        skill.transcendence = hero.subData.transcendence[skillName];
      }
    }
    hero.effectDescriptions = hero.subData.effectDescriptions || {};
    delete hero.subData;
  }

  return heroes;
}

function parseAllRosters() {
  if (!fs.existsSync(rawDir)) {
    console.error('No raw directory at', rawDir);
    return;
  }

  if (!fs.existsSync(normalizedDir)) fs.mkdirSync(normalizedDir, { recursive: true });

  const files = fs.readdirSync(rawDir).filter(f => f.startsWith('seven-knights-rebirth-roster') && f.endsWith('.csv'));
  const allHeroes = [];

  for (const file of files) {
    const filepath = path.join(rawDir, file);
    const csvText = fs.readFileSync(filepath, 'utf8');
    const fileBase = path.basename(file, '.csv');
    const rarityKey = fileBase.replace('seven-knights-rebirth-', '');
    const rarity = RARITY_MAP[rarityKey] || 'Unknown';

    console.log(`Parsing ${file} (rarity: ${rarity})...`);
    const heroes = parseRoster(csvText, rarity);
    console.log(`  Found ${heroes.length} heroes`);
    allHeroes.push(...heroes);

    const outFile = path.join(normalizedDir, `seven-knights-rebirth-${rarityKey}-parsed.json`);
    fs.writeFileSync(outFile, JSON.stringify(heroes, null, 2), 'utf8');
    console.log(`  Wrote to ${path.basename(outFile)}`);
  }

  const combined = path.join(normalizedDir, 'seven-knights-rebirth-roster-combined.json');
  fs.writeFileSync(combined, JSON.stringify(allHeroes, null, 2), 'utf8');
  console.log(`\nCombined: ${allHeroes.length} heroes across all roster tabs`);
}

if (require.main === module) {
  parseAllRosters();
}

module.exports = { parseRoster, parseAllRosters };
