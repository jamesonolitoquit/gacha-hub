const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { test } = require('node:test');

const root = process.cwd();

function readSource(relativePath) {
  return readFileSync(join(root, relativePath), 'utf8');
}

test('character detail page uses generateStaticParams', () => {
  const source = readSource('app/(platform)/games/[gameSlug]/characters/[slug]/page.tsx');
  assert.match(source, /export async function generateStaticParams/);
});

test('character detail page returns many character slugs', () => {
  const source = readSource('app/(platform)/games/[gameSlug]/characters/[slug]/page.tsx');
  assert.match(source, /characterService\.listCharacters/);
});

test('skill detail page does NOT have generateStaticParams (dynamic)', () => {
  const source = readSource('app/(platform)/games/[gameSlug]/skills/[slug]/page.tsx');
  assert.ok(!source.includes('generateStaticParams'), 'Skill pages should be dynamic, not SSG');
});

test('gear detail page uses generateStaticParams', () => {
  const source = readSource('app/(platform)/games/[gameSlug]/database/gear/[slug]/page.tsx');
  assert.match(source, /export async function generateStaticParams/);
});

test('pet detail page uses generateStaticParams', () => {
  const source = readSource('app/(platform)/games/[gameSlug]/database/pets/[slug]/page.tsx');
  assert.match(source, /export async function generateStaticParams/);
});

test('guide detail page uses generateStaticParams', () => {
  const source = readSource('app/(platform)/games/[gameSlug]/guides/[slug]/page.tsx');
  assert.match(source, /export async function generateStaticParams/);
});

test('tier list detail page uses generateStaticParams', () => {
  const source = readSource('app/(platform)/games/[gameSlug]/tier-lists/[slug]/page.tsx');
  assert.match(source, /export async function generateStaticParams/);
});

test('team detail page uses generateStaticParams', () => {
  const source = readSource('app/(platform)/games/[gameSlug]/teams/[slug]/page.tsx');
  assert.match(source, /export async function generateStaticParams/);
});

test('generateMetadata exists on all detail pages', () => {
  const detailPages = [
    'characters/[slug]/page.tsx',
    'skills/[slug]/page.tsx',
    'database/gear/[slug]/page.tsx',
    'database/pets/[slug]/page.tsx',
    'guides/[slug]/page.tsx',
    'tier-lists/[slug]/page.tsx',
    'teams/[slug]/page.tsx',
  ];

  const basePath = 'app/(platform)/games/[gameSlug]/';
  for (const page of detailPages) {
    const source = readSource(basePath + page);
    assert.match(source, /export async function generateMetadata/,
      `${page} should export generateMetadata`);
  }
});
