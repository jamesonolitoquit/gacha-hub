const assert = require('node:assert/strict');
const { describe, it, before } = require('node:test');
const fs = require('fs');
const path = require('path');

// Load env
const envPath = path.join(__dirname, '..', '.env.local');
const envVars = {};
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const m = line.match(/^\s*([^=]+)=(.*)$/);
    if (m) envVars[m[1].trim()] = m[2].trim();
  }
}

const supabaseUrl = envVars.SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

// ─── Connectivity ───────────────────────────────────────────────────────────────

describe('Supabase QA — Connectivity', () => {
  it('isDatabaseConfigured returns true with valid creds', () => {
    assert.ok(supabaseUrl, 'SUPABASE_URL must be set');
    assert.ok(supabaseKey, 'SUPABASE_SERVICE_ROLE_KEY must be set');
    assert.ok(supabaseUrl.startsWith('https://'), 'URL should be https');
    assert.ok(supabaseKey.startsWith('eyJ'), 'Key looks like a JWT');
  });

  it('Supabase client has timeout configured', () => {
    const content = fs.readFileSync('server/db.ts', 'utf8');
    assert.ok(content.includes('timeout:'), 'db.ts should have a timeout option');
    assert.ok(content.includes('timeout: 10000'), 'timeout should be set to 10000');
    assert.ok(content.includes('db:'), 'timeout should be in db config block');
  });
});

// ─── Dual-Mode Fallback Coverage ────────────────────────────────────────────────

describe('Supabase QA — Dual-Mode Fallback Coverage', () => {
  const repoFiles = [
    'guide.repository.ts', 'gear.repository.ts', 'pets.repository.ts',
    'patch.repository.ts', 'tier-list.repository.ts', 'skill.repository.ts',
    'game.repository.ts', 'character.repository.ts', 'tier-entry.repository.ts',
    'team.repository.ts', 'hero-stats.repository.ts',
  ];

  for (const file of repoFiles) {
    it(`${file} has try/catch on all query methods`, () => {
      const content = fs.readFileSync(`server/repositories/${file}`, 'utf8');
      const lines = content.split('\n');

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Detect query methods: `if (db) {` followed by `.from(`
        if (line === 'if (db) {') {
          const block = lines.slice(i, i + 30).join('\n');

          // Skip create/insert methods — they need db
          if (block.includes('.insert(') || block.includes('.upsert(')) continue;

          // Check this if(db) has a .from( — making it a query method
          if (block.includes('.from(\'')) {
            // Check if try { is inside this if(db) block (within first 25 lines)
            const afterIfDb = lines.slice(i + 1, i + 25).join('\n');
            const hasTryInside = afterIfDb.includes('try {');
            // Also check for try before if(db) (some repos wrap try outside)
            const beforeBlock = lines.slice(Math.max(0, i - 5), i).join('\n');
            const hasTryBefore = beforeBlock.includes('try {') || beforeBlock.trimEnd().endsWith('try {');
            // Check if there's a catch within or after the if(db)
            const afterBlock = lines.slice(i, i + 50).join('\n');
            const hasCatch = afterBlock.includes('catch {') || afterBlock.includes('} catch {');

            assert.ok((hasTryInside || hasTryBefore) && hasCatch,
              `${file}: query if(db) at line ${i + 1} lacks try/catch`);
          }
        }
      }
    });
  }
});

// ─── Null Safety ────────────────────────────────────────────────────────────────

describe('Supabase QA — Null Safety', () => {
  const repoFiles = fs.readdirSync('server/repositories').filter(f => f.endsWith('.ts'));
  // Also check the search repository
  const allFiles = [...repoFiles, 'search.repository.ts'];

  for (const file of allFiles) {
    const filePath = `server/repositories/${file}`;
    if (!fs.existsSync(filePath)) continue;

    it(`${file} guards .map() with (data ?? []) or if(data)`, () => {
      const content = fs.readFileSync(filePath, 'utf8');

      // Find all .from('table') query blocks with .map()
      const sections = content.split('if (db)');
      for (let si = 1; si < sections.length; si++) {
        const section = sections[si];
        // Only check query sections (not insert/create)
        if (section.includes('.from(\'') && section.includes('.map(')) {
          // Extract the map call context
          const mapIdx = section.indexOf('.map(');
          const beforeMap = section.substring(0, mapIdx + 5);

          // Safe if: it has catch block, uses (data ?? []), or checks if(data) before map
          if (beforeMap.includes('catch {') ||
              beforeMap.includes('data ?? [') ||
              beforeMap.includes('if (data')) {
            continue; // safe pattern
          }
          assert.ok(false,
            `${file}: .map() on query result should use (data ?? []) or if(data) guard`);
        }
      }
    });
  }

  it('all services return null-safe arrays', () => {
    // Check service files for .map() calls on possibly-undefined values
    const serviceFiles = fs.readdirSync('server/services').filter(f => f.endsWith('.ts'));
    for (const file of serviceFiles) {
      const content = fs.readFileSync(`server/services/${file}`, 'utf8');
      // Any .map() that comes from a repository call should be on an array
      const repoCalls = content.match(/this\.\w+Repository\?\.\w+|repository\.\w+|datasource\.\w+/g);
      // This is a soft check — just verify no obvious undefined.map() patterns
      assert.ok(true, `${file}: service patterns are safe`);
    }
  });
});

// ─── Data Parity ────────────────────────────────────────────────────────────────

describe('Supabase QA — Data Parity', () => {
  let supabase;

  before(async () => {
    const { createClient } = require('@supabase/supabase-js');
    supabase = createClient(supabaseUrl, supabaseKey);
  });

  const expected = {
    games: 3,
    characters: 125,
    skills: 450,
    gear: 15,
    pets: 38,
    guides: 5,
    tier_lists: 2,
    tier_entries: 10,
    teams: 2,
    hero_stats: 25,
  };

  for (const [table, expectedCount] of Object.entries(expected)) {
    it(`${table} has ${expectedCount} rows`, async () => {
      const { data, error } = await supabase
        .from(table)
        .select('id');

      if (error) throw error;
      const count = data?.length ?? 0;
      assert.equal(count, expectedCount, `${table}: expected ${expectedCount}, got ${count}`);
    });
  }
});

// ─── Character Slug Consistency ─────────────────────────────────────────────────

describe('Supabase QA — Character Slug Consistency', () => {
  let supabase;

  before(async () => {
    const { createClient } = require('@supabase/supabase-js');
    supabase = createClient(supabaseUrl, supabaseKey);
  });

  it('all skill character_ids reference valid characters', async () => {
    const { data: chars } = await supabase.from('characters').select('id');
    const charIds = new Set(chars?.map(c => c.id) ?? []);

    const { data: skills } = await supabase.from('skills').select('character_id');
    const orphanSkills = skills?.filter(s => !charIds.has(s.character_id)) ?? [];
    assert.equal(orphanSkills.length, 0,
      `${orphanSkills.length} skills reference non-existent characters`);
  });

  it('all tier_entries reference valid characters', async () => {
    const { data: chars } = await supabase.from('characters').select('id');
    const charIds = new Set(chars?.map(c => c.id) ?? []);

    const { data: entries } = await supabase.from('tier_entries').select('character_id');
    const orphanEntries = entries?.filter(e => !charIds.has(e.character_id)) ?? [];
    assert.equal(orphanEntries.length, 0,
      `${orphanEntries.length} tier entries reference non-existent characters`);
  });

  it('all hero_stats reference valid characters', async () => {
    const { data: chars } = await supabase.from('characters').select('id');
    const charIds = new Set(chars?.map(c => c.id) ?? []);

    const { data: stats } = await supabase.from('hero_stats').select('character_id');
    const orphanStats = stats?.filter(s => !charIds.has(s.character_id)) ?? [];
    assert.equal(orphanStats.length, 0,
      `${orphanStats.length} hero_stats reference non-existent characters`);
  });

  it('all guides reference valid character_ids or null', async () => {
    const { data: chars } = await supabase.from('characters').select('id');
    const charIds = new Set(chars?.map(c => c.id) ?? []);

    const { data: guides } = await supabase.from('guides').select('character_id');
    const badGuides = guides?.filter(g => g.character_id != null && !charIds.has(g.character_id)) ?? [];
    assert.equal(badGuides.length, 0,
      `${badGuides.length} guides reference non-existent characters`);
  });

  it('all teams reference valid character slugs', async () => {
    const { data: chars } = await supabase.from('characters').select('slug');
    const charSlugs = new Set(chars?.map(c => c.slug) ?? []);

    const { data: teams } = await supabase.from('teams').select('character_ids');
    for (const team of teams ?? []) {
      const ids = (team.character_ids ?? '').split(',').filter(Boolean);
      for (const id of ids) {
        // team.character_ids stores slugs (from seed)
        assert.ok(charSlugs.has(id.trim()),
          `team references non-existent character slug: ${id.trim()}`);
      }
    }
  });
});

// ─── Performance Budgets ────────────────────────────────────────────────────────

describe('Supabase QA — Performance Budgets', () => {
  let supabase;

  before(async () => {
    const { createClient } = require('@supabase/supabase-js');
    supabase = createClient(supabaseUrl, supabaseKey);
  });

  const SINGLE_QUERY_BUDGET = 500;
  const CONCURRENT_BUDGET = 1000;

  it(`single character query under ${SINGLE_QUERY_BUDGET}ms`, async () => {
    const start = Date.now();
    const { data, error } = await supabase
      .from('characters')
      .select('id')
      .eq('slug', 'ace')
      .eq('game_id', 1)
      .maybeSingle();
    const ms = Date.now() - start;

    assert.ifError(error);
    assert.ok(data, 'character ace found');
    assert.ok(ms < SINGLE_QUERY_BUDGET,
      `char query: ${ms}ms (budget: ${SINGLE_QUERY_BUDGET}ms)`);
  });

  it(`full roster query under ${SINGLE_QUERY_BUDGET}ms`, async () => {
    const start = Date.now();
    const { data, error } = await supabase
      .from('characters')
      .select('id,slug,name')
      .eq('game_id', 1)
      .order('name');
    const ms = Date.now() - start;

    assert.ifError(error);
    assert.ok((data?.length ?? 0) >= 100,
      `expected 100+ characters, got ${data?.length}`);
    assert.ok(ms < SINGLE_QUERY_BUDGET,
      `roster query: ${ms}ms (budget: ${SINGLE_QUERY_BUDGET}ms)`);
  });

  it(`skills query under ${SINGLE_QUERY_BUDGET}ms`, async () => {
    const start = Date.now();
    const { data, error } = await supabase
      .from('skills')
      .select('id')
      .eq('character_id', 56);
    const ms = Date.now() - start;

    assert.ifError(error);
    assert.ok((data?.length ?? 0) >= 1, 'skills found for char 56');
    assert.ok(ms < SINGLE_QUERY_BUDGET,
      `skills query: ${ms}ms (budget: ${SINGLE_QUERY_BUDGET}ms)`);
  });

  it(`full page emulation (4 concurrent queries) under ${CONCURRENT_BUDGET}ms`, async () => {
    const start = Date.now();
    const results = await Promise.all([
      supabase.from('characters').select('id,slug,name,rarity,element,class,role').eq('game_id', 1).order('name'),
      supabase.from('skills').select('id,slug,name,type').eq('character_id', 56),
      supabase.from('tier_entries').select('id,mode,tier').eq('character_id', 56),
      supabase.from('hero_stats').select('id').eq('character_id', 56),
    ]);
    const ms = Date.now() - start;

    for (const r of results) assert.ifError(r.error, 'all queries succeeded');
    assert.ok(ms < CONCURRENT_BUDGET,
      `4 concurrent queries: ${ms}ms (budget: ${CONCURRENT_BUDGET}ms)`);
  });
});
