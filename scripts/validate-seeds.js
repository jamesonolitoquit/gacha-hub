const fs = require('fs');
const path = require('path');

function validatePrunedSeeds(prunedDir = path.join(__dirname, '..', 'data', 'seeds', 'pruned')) {
  if (!fs.existsSync(prunedDir)) {
    throw new Error(`Pruned seeds directory not found: ${prunedDir}`);
  }

  const files = fs.readdirSync(prunedDir).filter((f) => f.endsWith('.json'));
  if (files.length === 0) {
    throw new Error('No pruned JSON files found in ' + prunedDir);
  }

  const problems = [];

  for (const file of files) {
    const raw = fs.readFileSync(path.join(prunedDir, file), 'utf8');
    let arr;
    try {
      arr = JSON.parse(raw);
    } catch (e) {
      problems.push({ file, reason: 'invalid-json' });
      continue;
    }

    if (!Array.isArray(arr)) {
      problems.push({ file, reason: 'not-array' });
      continue;
    }

    const isBuildsFile = file.includes('-builds.');
    arr.forEach((entry, i) => {
      const context = `${file}[${i}]`;
      if (!isBuildsFile) {
        if (!entry.slug) problems.push({ entry: context, reason: 'missing-slug' });
        if (!entry.name) problems.push({ entry: context, reason: 'missing-name' });
      }
      if (entry.characterClass !== undefined && !entry.rarity && !entry.slug?.startsWith('seed-')) problems.push({ entry: context, reason: 'missing-rarity' });
      // portrait/fullArt are optional — populated by asset pipeline
    });
  }

  return { ok: problems.length === 0, problems };
}

if (require.main === module) {
  try {
    const res = validatePrunedSeeds();
    if (!res.ok) {
      console.error('Seed validation failed:', res.problems);
      process.exit(2);
    }
    console.log('Seed validation passed');
    process.exit(0);
  } catch (err) {
    console.error('Seed validation error:', err.message || err);
    process.exit(3);
  }
}

module.exports = { validatePrunedSeeds };
