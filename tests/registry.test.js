const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { test } = require('node:test');

const root = process.cwd();

function readSource(relativePath) {
  return readFileSync(join(root, relativePath), 'utf8');
}

test('module registry exports list and get and register', () => {
  const source = readSource('core/module-registry.ts');
  assert.match(source, /register\(/);
  assert.match(source, /get\(/);
  assert.match(source, /list\(\)/);
  assert.match(source, /findByHost\(/);
});

test('SKR module has taxonomies and nav', () => {
  const source = readSource('games/seven-knights-rebirth/module.ts');
  assert.match(source, /skrTaxonomies/);
  assert.match(source, /skrNav/);
  assert.match(source, /taxonomies:/);
  assert.match(source, /nav:/);
});

test('DT module has taxonomies and nav', () => {
  const source = readSource('games/dragon-traveler/module.ts');
  assert.match(source, /dtTaxonomies/);
  assert.match(source, /dtNav/);
  assert.match(source, /taxonomies:/);
  assert.match(source, /nav:/);
});

test('BD2 module has taxonomies and nav', () => {
  const source = readSource('games/brown-dust-2/module.ts');
  assert.match(source, /bd2Taxonomies/);
  assert.match(source, /bd2Nav/);
  assert.match(source, /taxonomies:/);
  assert.match(source, /nav:/);
});

test('each game module has required fields', () => {
  for (const game of ['seven-knights-rebirth', 'dragon-traveler', 'brown-dust-2']) {
    const source = readSource(`games/${game}/module.ts`);
    assert.match(source, /id:/);
    assert.match(source, /slug:/);
    assert.match(source, /name:/);
    assert.match(source, /routes:/);
    assert.match(source, /theme:/);
    assert.match(source, /capabilities:/);
  }
});

test('each game module has routes defined', () => {
  for (const game of ['seven-knights-rebirth', 'dragon-traveler', 'brown-dust-2']) {
    const source = readSource(`games/${game}/routes.ts`);
    assert.match(source, /export const/);
    assert.match(source, /characters/);
    assert.match(source, /skills/);
    assert.match(source, /guides/);
    assert.match(source, /tier-lists/);
  }
});

test('SKR has extended routes beyond DT/BD2', () => {
  const skr = readSource('games/seven-knights-rebirth/routes.ts');
  const dt = readSource('games/dragon-traveler/routes.ts');
  const bd2 = readSource('games/brown-dust-2/routes.ts');

  assert.match(skr, /gear-detail/);
  assert.match(skr, /pet-detail/);
  assert.match(skr, /database-skills/);
  assert.match(skr, /teams/);
  assert.match(skr, /team-detail/);

  assert.ok(!dt.includes('gear-detail'));
  assert.ok(!bd2.includes('gear-detail'));
  assert.ok(!dt.includes('teams'));
  assert.ok(!bd2.includes('teams'));
});

test('SKR config defines all taxonomy sections', () => {
  const source = readSource('games/seven-knights-rebirth/config.ts');
  assert.match(source, /classes:/);
  assert.match(source, /rarities:/);
  assert.match(source, /elements:/);
  assert.match(source, /tiers:/);
  assert.match(source, /stats:/);
  assert.match(source, /acquisitions:/);
  assert.match(source, /skillTypes:/);
  assert.match(source, /guideTypes:/);
});

test('DT config defines all taxonomy sections', () => {
  const source = readSource('games/dragon-traveler/config.ts');
  assert.match(source, /classes:/);
  assert.match(source, /rarities:/);
  assert.match(source, /elements:/);
  assert.match(source, /tiers:/);
  assert.match(source, /stats:/);
  assert.match(source, /acquisitions:/);
  assert.match(source, /skillTypes:/);
  assert.match(source, /guideTypes:/);
});

test('BD2 config defines all taxonomy sections', () => {
  const source = readSource('games/brown-dust-2/config.ts');
  assert.match(source, /classes:/);
  assert.match(source, /rarities:/);
  assert.match(source, /elements:/);
  assert.match(source, /tiers:/);
  assert.match(source, /stats:/);
  assert.match(source, /acquisitions:/);
  assert.match(source, /skillTypes:/);
  assert.match(source, /guideTypes:/);
});

test('SKR nav has all expected items', () => {
  const source = readSource('games/seven-knights-rebirth/config.ts');
  assert.match(source, /overview/);
  assert.match(source, /roster/);
  assert.match(source, /tier-lists/);
  assert.match(source, /builds/);
  assert.match(source, /teams/);
  assert.match(source, /database/);
  assert.match(source, /guides/);
  assert.match(source, /tools/);
  assert.match(source, /updates/);
});
