const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { test } = require('node:test');

const root = process.cwd();

function readSource(relativePath) {
  return readFileSync(join(root, relativePath), 'utf8');
}

test('game service exports listGames', () => {
  const source = readSource('server/services/game.service.ts');
  assert.match(source, /listGames/);
  assert.match(source, /export const gameService/);
});

test('character service exports listCharacters and getCharacter', () => {
  const source = readSource('server/services/character.service.ts');
  assert.match(source, /listCharacters/);
  assert.match(source, /getCharacter/);
  assert.match(source, /getCharacterById/);
  assert.match(source, /export const characterService/);
});

test('skill service exports getSkill and listSkillsForCharacter', () => {
  const source = readSource('server/services/skill.service.ts');
  assert.match(source, /getSkill/);
  assert.match(source, /listSkillsForCharacter/);
  assert.match(source, /listSkillsForGame/);
  assert.match(source, /export const skillService/);
});

test('guide service exports listGuides and getGuide', () => {
  const source = readSource('server/services/guide.service.ts');
  assert.match(source, /listGuides/);
  assert.match(source, /getGuide/);
  assert.match(source, /export const guideService/);
});

test('tier list service exports listTierLists and getTierList', () => {
  const source = readSource('server/services/tier-list.service.ts');
  assert.match(source, /listTierLists/);
  assert.match(source, /getTierList/);
  assert.match(source, /export const tierListService/);
});

test('tier entry service exports getTiersForCharacter', () => {
  const source = readSource('server/services/tier-entry.service.ts');
  assert.match(source, /getTiersForCharacter/);
  assert.match(source, /export const tierEntryService/);
});

test('patch service exports listPatches and getPatch', () => {
  const source = readSource('server/services/patch.service.ts');
  assert.match(source, /listPatches/);
  assert.match(source, /getPatch/);
  assert.match(source, /export const patchService/);
});

test('search service exports search method', () => {
  const source = readSource('server/services/search.service.ts');
  assert.match(source, /search/);
  assert.match(source, /export const searchService/);
});

test('gear service exports listGearSets and getGearSetBySlug', () => {
  const source = readSource('server/services/gear.service.ts');
  assert.match(source, /listGearSets/);
  assert.match(source, /getGearSetBySlug/);
  assert.match(source, /export const gearService/);
});

test('pet service exports listPets and getPetBySlug', () => {
  const source = readSource('server/services/pets.service.ts');
  assert.match(source, /listPets/);
  assert.match(source, /getPetBySlug/);
  assert.match(source, /export const petService/);
});

test('build service exports listBuilds and getBuildForCharacter', () => {
  const source = readSource('server/services/build.service.ts');
  assert.match(source, /listBuilds/);
  assert.match(source, /getBuildForCharacter/);
  assert.match(source, /export const buildService/);
});

test('team service exports listTeams and getTeamBySlug', () => {
  const source = readSource('server/services/team.service.ts');
  assert.match(source, /listTeams/);
  assert.match(source, /getTeamBySlug/);
  assert.match(source, /export const teamService/);
});

test('hero stats service imports characterRepository', () => {
  const source = readSource('server/services/character.service.ts');
  assert.match(source, /characterRepository/);
});

test('evidence service exports listEvidence and createEvidence', () => {
  const source = readSource('server/services/evidence.service.ts');
  assert.match(source, /listEvidence/);
  assert.match(source, /createEvidence/);
  assert.match(source, /export const evidenceService/);
});

test('ai content service exports processEvidence', () => {
  const source = readSource('server/services/ai-content.service.ts');
  assert.match(source, /processEvidence/);
  assert.match(source, /export const aiContentService/);
});

test('search service references all content types', () => {
  const source = readSource('server/services/search.service.ts');
  assert.match(source, /game/);
  assert.match(source, /character/);
  assert.match(source, /skill/);
  assert.match(source, /guide/);
  assert.match(source, /gear/);
  assert.match(source, /pet/);
});

test('character service uses characterRepository', () => {
  const source = readSource('server/services/character.service.ts');
  assert.match(source, /characterRepository/);
});

test('skill service uses skillRepository', () => {
  const source = readSource('server/services/skill.service.ts');
  assert.match(source, /skillRepository/);
});

test('guide service uses guideRepository', () => {
  const source = readSource('server/services/guide.service.ts');
  assert.match(source, /guideRepository/);
});

test('tier list service uses tierListRepository', () => {
  const source = readSource('server/services/tier-list.service.ts');
  assert.match(source, /tierListRepository/);
});

test('team service uses teamRepository', () => {
  const source = readSource('server/services/team.service.ts');
  assert.match(source, /teamRepository/);
});

test('patch service uses patchRepository', () => {
  const source = readSource('server/services/patch.service.ts');
  assert.match(source, /patchRepository/);
});
