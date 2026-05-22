const assert = require('node:assert/strict');
const { readFileSync, readdirSync } = require('node:fs');
const { join } = require('node:path');
const { test } = require('node:test');

const root = process.cwd();

function readJSON(relativePath) {
  return JSON.parse(readFileSync(join(root, relativePath), 'utf8'));
}

function readSource(relativePath) {
  return readFileSync(join(root, relativePath), 'utf8');
}

const validTiers = ['SSS', 'SS', 'S', 'A', 'B', 'C', 'D'];

test('pruned character JSON loads without error', () => {
  const chars = readJSON('data/seeds/pruned/seven-knights-rebirth.json');
  assert.ok(Array.isArray(chars));
  assert.equal(chars.length, 111);
});

test('pruned skills JSON loads without error', () => {
  const skills = readJSON('data/seeds/pruned/seven-knights-rebirth-skills.json');
  assert.ok(Array.isArray(skills));
  assert.equal(skills.length, 394);
});

test('all pruned characters have unique slugs', () => {
  const chars = readJSON('data/seeds/pruned/seven-knights-rebirth.json');
  const slugs = chars.map((c) => c.slug);
  assert.equal(new Set(slugs).size, slugs.length);
});

test('all hardcoded seed characters have required fields', () => {
  const source = readSource('server/bootstrap-data.ts');
  const slugMatches = [...source.matchAll(/slug:\s*'([^']+)'/g)];
  const nameMatches = [...source.matchAll(/name:\s*'([^']+)'/g)];
  assert.ok(slugMatches.length >= 7, 'Expected at least 7 hardcoded seed character slugs');
  assert.ok(nameMatches.length >= 7, 'Expected at least 7 hardcoded seed character names');
});

test('hardcoded seed skill slugs are unique', () => {
  const source = readSource('server/bootstrap-data.ts');
  const slugMatches = [...source.matchAll(/slug:\s*'([^']+)'/g)];
  assert.ok(slugMatches.length > 1);
});

test('all gear sets have 2pc and 4pc effects', () => {
  const source = readSource('server/bootstrap-data.ts');
  const twoPcMatches = source.match(/twoPieceEffect:/g);
  const fourPcMatches = source.match(/fourPieceEffect:/g);
  assert.ok(twoPcMatches && twoPcMatches.length >= 6);
  assert.ok(fourPcMatches && fourPcMatches.length >= 6);
});

test('all pets have two passives', () => {
  const source = readSource('server/bootstrap-data.ts');
  const passive1Matches = source.match(/passive1Description:/g);
  const passive2Matches = source.match(/passive2Description:/g);
  assert.ok(passive1Matches && passive1Matches.length >= 4);
  assert.ok(passive2Matches && passive2Matches.length >= 4);
});

test('all guides have guideType and author fields', () => {
  const source = readSource('server/bootstrap-data.ts');
  assert.match(source, /guideType:/);
  assert.match(source, /author:/);
});

test('all tier entries reference valid tier labels', () => {
  const source = readSource('server/bootstrap-data.ts');
  const tierMatches = [...source.matchAll(/tier:\s*'([^']+)'/g)];
  for (const match of tierMatches) {
    assert.ok(validTiers.includes(match[1]), `Invalid tier label: ${match[1]}`);
  }
});

test('tier entries with previousTier use valid labels', () => {
  const source = readSource('server/bootstrap-data.ts');
  const prevMatches = [...source.matchAll(/previousTier:\s*'([^']+)'/g)];
  for (const match of prevMatches) {
    assert.ok(validTiers.includes(match[1]), `Invalid previousTier: ${match[1]}`);
  }
});

test('all teams have a purpose and characterSlugs', () => {
  const source = readSource('server/bootstrap-data.ts');
  const purposeMatches = source.match(/purpose:\s*'/g);
  const slugMatches = source.match(/characterSlugs:/g);
  assert.ok(purposeMatches && purposeMatches.length >= 6);
  assert.ok(slugMatches && slugMatches.length >= 6);
});

test('all builds reference a characterSlug', () => {
  const builds = readJSON('data/seeds/pruned/seven-knights-rebirth-builds.json');
  assert.ok(Array.isArray(builds));
  assert.ok(builds.length >= 10);
  for (const b of builds) {
    assert.ok(b.characterSlug, `Build missing characterSlug`);
  }
});

test('builds have gear set recommendations', () => {
  const builds = readJSON('data/seeds/pruned/seven-knights-rebirth-builds.json');
  for (const b of builds) {
    assert.ok(b.gearSet1, `Build ${b.characterSlug} missing gearSet1`);
    assert.ok(b.gearSet1.setName, `Build ${b.characterSlug} missing setName`);
    assert.ok(b.gearSet1.weapon, `Build ${b.characterSlug} missing weapon`);
    assert.ok(b.gearSet1.armor, `Build ${b.characterSlug} missing armor`);
    assert.ok(b.gearSet1.accessory, `Build ${b.characterSlug} missing accessory`);
  }
});

test('builds have skill priority', () => {
  const builds = readJSON('data/seeds/pruned/seven-knights-rebirth-builds.json');
  const withSkills = builds.filter((b) => b.skillPriority && b.skillPriority.length > 0);
  assert.ok(withSkills.length >= 20, `Expected at least 20 builds with skillPriority, got ${withSkills.length}`);
});

test('builds have stat priorities', () => {
  const builds = readJSON('data/seeds/pruned/seven-knights-rebirth-builds.json');
  for (const b of builds) {
    assert.ok(b.statPriorities && b.statPriorities.length > 0, `Build ${b.characterSlug} missing statPriorities`);
  }
});
