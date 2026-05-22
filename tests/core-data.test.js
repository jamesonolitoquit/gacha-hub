const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { test } = require('node:test');

const root = process.cwd();

function readSource(relativePath) {
  return readFileSync(join(root, relativePath), 'utf8');
}

test('getGameSlugById is exported from bootstrap-data', () => {
  const source = readSource('server/bootstrap-data.ts');
  assert.match(source, /export function getGameSlugById/);
});

test('getSeedCharactersByGameSlug is exported from bootstrap-data', () => {
  const source = readSource('server/bootstrap-data.ts');
  assert.match(source, /export function getSeedCharactersByGameSlug/);
});

test('getSeedCharacters is exported from bootstrap-data', () => {
  const source = readSource('server/bootstrap-data.ts');
  assert.match(source, /export function getSeedCharacters\b/);
});

test('findSeedCharacter is exported from bootstrap-data', () => {
  const source = readSource('server/bootstrap-data.ts');
  assert.match(source, /export function findSeedCharacter/);
});

test('getSeedSkills is exported from bootstrap-data', () => {
  const source = readSource('server/bootstrap-data.ts');
  assert.match(source, /export function getSeedSkills/);
});

test('getSeedGear is exported from bootstrap-data', () => {
  const source = readSource('server/bootstrap-data.ts');
  assert.match(source, /export function getSeedGear\b/);
});

test('getSeedPets is exported from bootstrap-data', () => {
  const source = readSource('server/bootstrap-data.ts');
  assert.match(source, /export function getSeedPets/);
});

test('getSeedGuides is exported from bootstrap-data', () => {
  const source = readSource('server/bootstrap-data.ts');
  assert.match(source, /export function getSeedGuides/);
});

test('getSeedTierLists is exported from bootstrap-data', () => {
  const source = readSource('server/bootstrap-data.ts');
  assert.match(source, /export function getSeedTierLists/);
});

test('getSeedTierEntries is exported from bootstrap-data', () => {
  const source = readSource('server/bootstrap-data.ts');
  assert.match(source, /export function getSeedTierEntries/);
});

test('getSeedBuilds is exported from bootstrap-data', () => {
  const source = readSource('server/bootstrap-data.ts');
  assert.match(source, /export function getSeedBuilds/);
});

test('getSeedTeams is exported from bootstrap-data', () => {
  const source = readSource('server/bootstrap-data.ts');
  assert.match(source, /export function getSeedTeams/);
});

test('getSeedPatches is exported from bootstrap-data', () => {
  const source = readSource('server/bootstrap-data.ts');
  assert.match(source, /export function getSeedPatches/);
});

test('findSeedSkillByGameId is exported from bootstrap-data', () => {
  const source = readSource('server/bootstrap-data.ts');
  assert.match(source, /export function findSeedSkillByGameId/);
});

test('findSeedBuildForCharacter is exported from bootstrap-data', () => {
  const source = readSource('server/bootstrap-data.ts');
  assert.match(source, /export function findSeedBuildForCharacter/);
});

test('seedCharactersByGameSlug container object exists', () => {
  const source = readSource('server/bootstrap-data.ts');
  assert.match(source, /seedCharactersByGameSlug/);
});
