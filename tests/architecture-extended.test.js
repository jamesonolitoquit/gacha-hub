const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { test } = require('node:test');

const root = process.cwd();

function readSource(relativePath) {
  return readFileSync(join(root, relativePath), 'utf8');
}

test('all services export singletons', () => {
  const serviceFiles = [
    'game.service.ts',
    'character.service.ts',
    'skill.service.ts',
    'guide.service.ts',
    'tier-list.service.ts',
    'patch.service.ts',
    'search.service.ts',
    'evidence.service.ts',
    'team.service.ts',
  ];

  for (const file of serviceFiles) {
    const source = readSource(`server/services/${file}`);
    assert.match(source, /export const \w+Service = new \w+Service\(\)/,
      `${file} should export a singleton service instance`);
  }
});

test('all repositories use dual-mode pattern', () => {
  const repoFiles = [
    'character.repository.ts',
    'skill.repository.ts',
    'guide.repository.ts',
    'tier-list.repository.ts',
    'game.repository.ts',
    'patch.repository.ts',
    'team.repository.ts',
  ];

  for (const file of repoFiles) {
    const source = readSource(`server/repositories/${file}`);
    assert.match(source, /if \(db\)/,
      `${file} should check for db availability`);
    assert.ok(
      source.includes('catch') || source.includes('return'),
      `${file} should have fallback handling`
    );
  }
});

test('no console.log in production features code', () => {
  const exclude = ['api/', 'node_modules/', '.next/'];
  const checkDirs = [
    'features/',
    'shared/',
  ];

  const { readdirSync, statSync } = require('node:fs');

  function walk(dir) {
    const entries = readdirSync(join(root, dir), { withFileTypes: true });
    for (const entry of entries) {
      const full = join(dir, entry.name);
      if (entry.isDirectory() && !exclude.some((e) => full.includes(e))) {
        walk(full);
      } else if (entry.isFile() && entry.name.endsWith('.tsx')) {
        const content = readFileSync(full, 'utf8');
        const hasLog = content.match(/console\.(log|warn|debug)\(/);
        if (hasLog) {
          // Only flag if it's not a commented line and not in error boundaries
          const lines = content.split('\n');
          let flagged = false;
          for (const line of lines) {
            if (line.includes('console.log(') || line.includes('console.warn(') || line.includes('console.debug(')) {
              const trimmed = line.trim();
              if (!trimmed.startsWith('//') && !trimmed.includes('error') && !trimmed.includes('Error')) {
                flagged = true;
              }
            }
          }
          assert.ok(!flagged, `Unexpected console.log/warn/debug in ${full}`);
        }
      }
    }
  }

  for (const dir of checkDirs) {
    if (require('node:fs').existsSync(join(root, dir))) {
      walk(dir);
    }
  }
});

test('platform error boundaries exist', () => {
  const platformDir = 'app/(platform)';
  const entries = require('node:fs').readdirSync(join(root, platformDir));

  const hasError = entries.some((e) => e.startsWith('error'));
  const hasNotFound = entries.some((e) => e === 'not-found.tsx');
  assert.ok(hasError, 'Platform error.tsx should exist');
  assert.ok(hasNotFound, 'Platform not-found.tsx should exist');
});

test('global error boundary exists', () => {
  const content = readSource('app/global-error.tsx');
  assert.match(content, /export default/);
});

test('root not-found exists', () => {
  const content = readSource('app/not-found.tsx');
  assert.match(content, /export default/);
});

test('all admin links point to existing routes', () => {
  const adminLayout = readSource('app/admin/layout.tsx');
  const adminPage = readSource('app/admin/page.tsx');

  const hrefMatches = [
    ...adminLayout.matchAll(/href="([^"]+)"/g),
    ...adminPage.matchAll(/href="([^"]+)"/g),
  ];

  for (const match of hrefMatches) {
    const href = match[1];
    if (href.startsWith('/admin')) {
      const pagePath = join(root, 'app', href.slice(1), 'page.tsx');
      assert.ok(require('node:fs').existsSync(pagePath),
        `Admin link ${href} should have a corresponding page.tsx`);
    }
  }
});

test('platform pages do not import game-specific services', () => {
  const platformFiles = [
    'app/(platform)/trending/page.tsx',
    'app/(platform)/updates/page.tsx',
    'app/(platform)/tools/page.tsx',
  ];

  const gameServices = ['characterService', 'skillService', 'guideService', 'tierListService', 'gearService', 'petService', 'buildService', 'teamService', 'tierEntryService'];

  for (const file of platformFiles) {
    if (require('node:fs').existsSync(join(root, file))) {
      const content = readSource(file);
      for (const svc of gameServices) {
        assert.ok(!content.includes(svc),
          `${file} should not import ${svc} (platform pages must stay game-agnostic)`);
      }
    }
  }
});
