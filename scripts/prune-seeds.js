const fs = require('fs');
const path = require('path');

const normalizedDir = path.join(__dirname, '..', 'data', 'seeds', 'normalized');
const prunedDir = path.join(__dirname, '..', 'data', 'seeds', 'pruned');

const ensureDir = (d) => { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); };

const HERO_FIELDS = ['name','slug','characterClass','rarity','element','description','portrait_url','full_art_url','icon_url','release_patch'];
const SKILL_FIELDS = ['name','character_slug','slug','type','description','order','enhancements','transcendence','cooldownTurns','cost','powerType','scalingStat','targets','rangeType'];
const BUILD_FIELDS = ['team_name','mode','members','purpose','notes'];
const TIER_FIELDS = ['mode','title','tiers_json','author','source_date'];

function detectType(item) {
  if (item.owner || item.owner_slug || item.character_slug) return 'skill';
  if (item.team_name || item.members) return 'build';
  if (item.tiers_json || item.tiers) return 'tier';
  // default to hero
  return 'hero';
}

function pruneItem(item) {
  const type = detectType(item);

  if (type === 'skill') {
    const out = {};
    SKILL_FIELDS.forEach((k) => { if (Object.prototype.hasOwnProperty.call(item, k)) out[k] = item[k]; });
    // prefer owner_slug if owner present
    if (!out.owner_slug && out.owner) out.owner_slug = slugify(out.owner);
    return out;
  }

  if (type === 'build') {
    const out = {};
    BUILD_FIELDS.forEach((k) => { if (Object.prototype.hasOwnProperty.call(item, k)) out[k] = item[k]; });
    return out;
  }

  if (type === 'tier') {
    const out = {};
    TIER_FIELDS.forEach((k) => { if (Object.prototype.hasOwnProperty.call(item, k)) out[k] = item[k]; });
    return out;
  }

  // hero
  const out = {};
  HERO_FIELDS.forEach((k) => { if (Object.prototype.hasOwnProperty.call(item, k)) out[k] = item[k]; });
  if (!out.slug && out.name) out.slug = slugify(out.name);
  return out;
}

function slugify(text) {
  return String(text || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function processFiles() {
  ensureDir(prunedDir);

  if (!fs.existsSync(normalizedDir)) {
    console.error('No normalized seeds directory found at', normalizedDir);
    process.exit(1);
  }

  const files = fs.readdirSync(normalizedDir).filter((f) => f.endsWith('.json'));

  if (files.length === 0) {
    console.error('No normalized JSON files found in', normalizedDir);
    process.exit(1);
  }

  files.forEach((file) => {
    const srcPath = path.join(normalizedDir, file);
    const destPath = path.join(prunedDir, file);
    try {
      const raw = fs.readFileSync(srcPath, 'utf8');
      const data = JSON.parse(raw);

      if (!Array.isArray(data)) {
        console.warn('Skipping non-array seed file:', file);
        return;
      }

      const pruned = data.map(pruneItem);
      fs.writeFileSync(destPath, JSON.stringify(pruned, null, 2), 'utf8');
      console.log('Wrote pruned file:', destPath);
    } catch (err) {
      console.error('Failed processing', file, err.message);
    }
  });
}

processFiles();
