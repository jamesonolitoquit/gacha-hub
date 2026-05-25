const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { test } = require('node:test');

const root = process.cwd();

function read(relativePath) {
  return readFileSync(join(root, relativePath), 'utf8');
}

test('all datasources are implemented', () => {
  const datasources = [
    'server/datasources/game.datasource.ts',
    'server/datasources/character.datasource.ts',
    'server/datasources/skill.datasource.ts',
    'server/datasources/guide.datasource.ts',
    'server/datasources/tier-list.datasource.ts',
    'server/datasources/patch.datasource.ts',
    'server/datasources/search.datasource.ts',
    'server/datasources/evidence.datasource.ts',
    'server/datasources/team.datasource.ts',
  ];

  for (const ds of datasources) {
    const source = read(ds);
    assert.match(source, /export class \w+Datasource/);
    assert.match(source, /export const \w+Datasource = new \w+Datasource\(\)/);
  }
});

test('all services are implemented', () => {
  const services = [
    'server/services/game.service.ts',
    'server/services/character.service.ts',
    'server/services/skill.service.ts',
    'server/services/guide.service.ts',
    'server/services/tier-list.service.ts',
    'server/services/patch.service.ts',
    'server/services/search.service.ts',
    'server/services/evidence.service.ts',
    'server/services/team.service.ts',
    'server/services/ai-content.service.ts',
  ];

  for (const svc of services) {
    const source = read(svc);
    assert.match(source, /export class \w+Service/);
    assert.match(source, /export const \w+Service = new \w+Service\(\)/);
  }
});

test('all repositories are implemented', () => {
  const repos = [
    'server/repositories/game.repository.ts',
    'server/repositories/character.repository.ts',
    'server/repositories/skill.repository.ts',
    'server/repositories/guide.repository.ts',
    'server/repositories/tier-list.repository.ts',
    'server/repositories/patch.repository.ts',
    'server/repositories/search.repository.ts',
    'server/repositories/evidence.repository.ts',
    'server/repositories/team.repository.ts',
  ];

  for (const repo of repos) {
    const source = read(repo);
    assert.match(source, /export class \w+Repository/);
    assert.match(source, /export const \w+Repository = new \w+Repository\(\)/);
  }
});

test('evidence repository uses Supabase table API', () => {
  const source = read('server/repositories/evidence.repository.ts');

  assert.match(source, /\.from\('evidence'\)/);
  assert.match(source, /findByGameId/);
  assert.match(source, /findBySourceHash/);
  assert.match(source, /Database client not available/);
});

test('team repository uses Supabase table API', () => {
  const source = read('server/repositories/team.repository.ts');

  assert.match(source, /\.from\('teams'\)/);
  assert.match(source, /findByGameId/);
  assert.match(source, /findBySlug/);
  assert.match(source, /Database client not available/);
});

test('AI content service processes evidence', () => {
  const source = read('server/services/ai-content.service.ts');

  assert.match(source, /processEvidence/);
  assert.match(source, /requiresReview/);
  assert.match(source, /confidence/);
  assert.match(source, /evidenceService\.createEvidence/);
});

test('evidence API route exists', () => {
  const source = read('app/api/evidence/route.ts');

  assert.match(source, /export async function GET/);
  assert.match(source, /export async function POST/);
  assert.match(source, /evidenceService/);
});

test('teams API route exists', () => {
  const source = read('app/api/teams/route.ts');

  assert.match(source, /export async function GET/);
  assert.match(source, /export async function POST/);
  assert.match(source, /teamService/);
});

test('tier list detail page exists', () => {
  const source = read('app/(platform)/games/[gameSlug]/tier-lists/[slug]/page.tsx');

  assert.match(source, /export async function generateMetadata/);
  assert.match(source, /tierListService\.getTierList/);
  assert.match(source, /tierEntryService\.getEntriesForTierList/);
});

test('database migration exists', () => {
  const source = read('db/migrations/001_init_schema.sql');

  assert.match(source, /CREATE TABLE.*games/);
  assert.match(source, /CREATE TABLE.*characters/);
  assert.match(source, /CREATE TABLE.*skills/);
  assert.match(source, /CREATE TABLE.*evidence/);
  assert.match(source, /CREATE TABLE.*teams/);
});

test('datasource injector exports all datasources', () => {
  const source = read('core/datasource-injector.ts');

  assert.match(source, /gameDatasource/);
  assert.match(source, /characterDatasource/);
  assert.match(source, /skillDatasource/);
  assert.match(source, /evidenceDatasource/);
  assert.match(source, /teamDatasource/);
  assert.match(source, /getDatasource/);
});

test('seed games script exists', () => {
  const source = read('scripts/seed-games.js');

  assert.match(source, /seven-knights-rebirth/);
  assert.match(source, /blue-archive/);
  assert.match(source, /nikke/);
  assert.match(source, /supabase/);
});
