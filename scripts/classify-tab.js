const fs = require('fs');
const path = require('path');

const rawDir = path.join(__dirname, '..', 'data', 'seeds', 'raw');

function classifyTab(filepath) {
  const raw = fs.readFileSync(filepath, 'utf8');
  const head = raw.split('\n').slice(0, 20).join(' ').toUpperCase();

  if (head.includes('RECOMMENDED BUILDS') || head.includes('GEAR BUILDS')) {
    return 'build';
  }

  if (head.includes('SET NAME') || (head.includes('2-PIECE') && head.includes('4-PIECE'))) {
    return 'item';
  }

  if (head.includes('TIER') && (head.includes('SSS') || head.includes('SS') || head.includes('S TIER'))) {
    return 'tier';
  }

  if (head.includes('RAID') || head.includes('SUDDEN RAID') || head.includes('CASTLE RUSH') ||
      head.includes('DUNGEON') || head.includes('ADVENTURE') || head.includes('BOSS')) {
    return 'guide';
  }

  const lines = raw.split('\n').slice(0, 20);
  const headerLine = lines.find(l => l.includes('NO.') && l.includes('HERO'));
  const isRoster = headerLine && (
    headerLine.includes('TYPE') ||
    headerLine.includes('PASSIVE') ||
    headerLine.includes('BASIC ATTACK') ||
    headerLine.includes('AWK SKILL') ||
    headerLine.includes('SKILL1')
  );

  if (isRoster) {
    return 'roster';
  }

  const headerRow = (lines[1] || lines[0] || '').toUpperCase();
  if (headerRow.includes('ACCESSORY') || headerRow.includes('EQUIPMENT') || headerRow.includes('WEAPON') || headerRow.includes('ARMOR')) {
    return 'item';
  }

  if (head.includes('ADVENT') || head.includes('ADV &') || head.includes('MERC LAB') || head.includes('TOWER')) {
    return 'guide';
  }

  if (head.includes('PET')) {
    return 'reference';
  }

  return 'reference';
}

function classifyAll() {
  if (!fs.existsSync(rawDir)) {
    console.error('No raw directory at', rawDir);
    return {};
  }

  const files = fs.readdirSync(rawDir).filter(f => f.endsWith('.csv') && f.startsWith('seven-knights-rebirth'));
  const result = {};

  for (const file of files) {
    const filepath = path.join(rawDir, file);
    const type = classifyTab(filepath);
    result[file] = type;
    console.log(`  ${type.padEnd(10)} ${file}`);
  }

  return result;
}

if (require.main === module) {
  console.log('Tab classification:');
  classifyAll();
}

module.exports = { classifyTab, classifyAll };
