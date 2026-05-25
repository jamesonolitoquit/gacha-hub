const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { test } = require('node:test');

const root = process.cwd();

function read(relativePath) {
  return readFileSync(join(root, relativePath), 'utf8');
}

test('route resolver is host aware', () => {
  const source = read('core/route-resolver.ts');

  assert.match(source, /findByHost\(host\)/);
  assert.match(source, /segments\[0\] === 'games'/);
  assert.match(source, /routeSegment = routeSegments\[0\] \?\? \(gameModule \? 'home' : segments\[0\] \?\? 'home'\)/);
  assert.match(source, /extractPatternParams/);
});

test('middleware injects resolved route headers', () => {
  const source = read('middleware.ts');

  assert.match(source, /resolveRoute\(request\.nextUrl\.pathname/);
  assert.match(source, /x-gachahub-game-slug/);
  assert.match(source, /x-gachahub-route-segment/);
});

test('search service uses module registry for game resolution', () => {
  const source = read('server/services/search.service.ts');

  assert.match(source, /moduleRegistry\.list\(\)/);
  assert.match(source, /scoreCandidate/);
});

test('skills content slice is wired end to end', () => {
  const repository = read('server/repositories/skill.repository.ts');
  const service = read('server/services/skill.service.ts');
  const heroPage = read('app/(platform)/games/[gameSlug]/heroes/[slug]/page.tsx');

  assert.match(repository, /\.from\('skills'\)/);
  assert.match(repository, /findByCharacterId/);
  assert.match(service, /getSkill\(gameId: number, slug: string\)/);
  assert.match(heroPage, /skillService\.listSkillsForCharacter/);
});

test('game repository uses the Supabase table API', () => {
  const source = read('server/repositories/game.repository.ts');

  assert.match(source, /\.from\('games'\)/);
  assert.match(source, /\.insert\(\{/);
  assert.doesNotMatch(source, /db\.query\(/);
  assert.doesNotMatch(source, /id: 1,/);
  assert.match(source, /Database client not available/);
});

test('character page no longer falls back to game id 1', () => {
  const source = read('app/(platform)/games/[gameSlug]/heroes/[slug]/page.tsx');

  assert.doesNotMatch(source, /\?\? 1/);
  assert.match(source, /notFound\(\);/);
});

test('database boundary reads env-driven supabase config', () => {
  const source = read('server/db.ts');

  assert.match(source, /createClient\(/);
  assert.match(source, /SUPABASE_URL/);
  assert.match(source, /SUPABASE_SERVICE_ROLE_KEY/);
});

test('patches content slice is wired end to end', () => {
  const repository = read('server/repositories/patch.repository.ts');
  const service = read('server/services/patch.service.ts');
  const patchListPage = read('app/(platform)/games/[gameSlug]/patches/page.tsx');
  const patchDetailPage = read('app/(platform)/games/[gameSlug]/patches/[version]/page.tsx');

  assert.match(repository, /\.from\('patches'\)/);
  assert.match(repository, /findByGameId/);
  assert.match(repository, /findByVersion/);
  assert.match(service, /listPatchesForGame\(gameId: number\)/);
  assert.match(service, /getPatch\(gameId: number, version: string\)/);
  assert.match(patchListPage, /patchService\.listPatchesForGame/);
  assert.match(patchDetailPage, /patchService\.getPatch/);
});

test('unified navbar composes header, sidebar, and mobile sheet', () => {
  const source = read('platform/components/UnifiedNavbar.tsx');

  assert.match(source, /SiteHeader/);
  assert.match(source, /GameSidebar/);
  assert.match(source, /MobileNavSheet/);
});

test('search page implements accessible form feedback', () => {
  const source = read('app/(platform)/search/page.tsx');
  const formSource = read('app/(platform)/search/search-form.tsx');

  assert.match(source, /SearchForm/);
  assert.match(formSource, /<label htmlFor="search-q"/);
  assert.match(formSource, /required/);
  assert.match(formSource, /minLength=\{2\}/);
  assert.match(formSource, /aria-invalid=\{queryTooShort \? true : undefined\}/);
  assert.match(formSource, /aria-errormessage=\{queryTooShort \? 'search-error' : undefined\}/);
  assert.match(formSource, /aria-describedby=\{describedBy\}/);
  assert.match(source, /id="search-error" role="alert"/);
  assert.match(source, /Search the realm/);
  assert.match(formSource, /if \(localScope === 'game'\) \{/);
  assert.match(formSource, /if \(localGameSlug\) \{/);
  assert.match(formSource, /router\.push\(`\/search\?\$\{params\.toString\(\)\}`\)/);
  assert.match(source, /<ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-label="Search results">/);
  assert.match(source, /<li key=\{`\$\{result\.type\}:\$\{result\.slug\}`\}>/);
});

test('global styles provide focus-visible states for form controls', () => {
  const source = read('styles/globals.css');

  assert.match(source, /input:focus-visible/);
  assert.match(source, /select:focus-visible/);
  assert.match(source, /textarea:focus-visible/);
  assert.match(source, /\.fantasy-shell::before/);
  assert.match(source, /@keyframes float-orb/);
});

test('root metadata and seo routes are configured', () => {
  const layout = read('app/layout.tsx');
  const robots = read('app/robots.ts');
  const sitemap = read('app/sitemap.ts');

  assert.match(layout, /metadataBase: new URL\(siteUrl\)/);
  assert.match(layout, /openGraph:/);
  assert.match(layout, /twitter:/);

  assert.match(robots, /sitemap: `\$\{siteUrl\}\/sitemap\.xml`/);
  assert.match(sitemap, /const staticRoutes = \['', '\/games', '\/search', '\/trending', '\/updates', '\/tools'\]/);
  assert.match(sitemap, /const games = await gameService\.listGames\(\)/);
});

test('module metadata keeps dragon traveler and brown dust 2 labels consistent', () => {
  const dragonTravelerModule = read('games/dragon-traveler/module.ts');
  const brownDust2Module = read('games/brown-dust-2/module.ts');
  const sevenKnightsModule = read('games/seven-knights-rebirth/module.ts');

  assert.match(dragonTravelerModule, /id: 'dragontraveler'/);
  assert.match(dragonTravelerModule, /name: 'Dragon Traveler'/);
  assert.match(dragonTravelerModule, /subdomain: 'dragontraveler\.gachahub\.com'/);
  assert.match(dragonTravelerModule, /bannerUrl:/);

  assert.match(brownDust2Module, /id: 'browndust2'/);
  assert.match(brownDust2Module, /name: 'Brown Dust 2'/);
  assert.match(brownDust2Module, /subdomain: 'browndust2\.gachahub\.com'/);
  assert.match(brownDust2Module, /bannerUrl:/);

  assert.match(sevenKnightsModule, /bannerUrl:/);
});

test('platform card grids use semantic list markup', () => {
  const gamesPage = read('app/(platform)/games/page.tsx');

  assert.match(gamesPage, /<ul className="w-full grid gap-4 md:grid-cols-2 xl:grid-cols-3">/);
  assert.match(gamesPage, /<li key=\{game\.id\}>/);
});

test('platform layout wires unified navbar and theme applier', () => {
  const source = read('app/(platform)/layout.tsx');

  assert.match(source, /UnifiedNavbar/);
  assert.match(source, /ThemeApplier/);
  assert.match(source, /GameProvider/);
  assert.match(source, /SearchProvider/);
});

test('homepage frames the hub as a chooser', () => {
  const source = read('app/(platform)/page.tsx');

  assert.match(source, /Step into the archive of worlds and choose the game you want to explore\./i);
  assert.match(source, /Choose a game hub/);
  assert.match(source, /GachaHub Portal/);
  assert.match(source, /gameModules/);
});

test('game layout activates game context and provides main section', () => {
  const source = read('app/(platform)/games/[gameSlug]/layout.tsx');

  assert.match(source, /GameActivator/);
  assert.match(source, /moduleRegistry\.get/);
  assert.match(source, /notFound\(\);/);
  assert.match(source, /id="game-main"/);
});

test('guides and tier lists pages expose metadata and empty states', () => {
  const guidesPage = read('app/(platform)/games/[gameSlug]/guides/page.tsx');
  const tierListsPage = read('app/(platform)/games/[gameSlug]/tier-lists/page.tsx');

  assert.match(guidesPage, /export async function generateMetadata/);
  assert.match(guidesPage, /title: `Guides \| \$\{game\.name\}`/);
  assert.match(guidesPage, /No guides available yet for this game\./);

  assert.match(tierListsPage, /export async function generateMetadata/);
  assert.match(tierListsPage, /title:.*`Tier Lists \| \$\{game\.name\}`/);
  assert.match(tierListsPage, /No tier lists published yet for this game\./);
});

test('hero and patch pages use stronger readability classes', () => {
  const heroPage = read('app/(platform)/games/[gameSlug]/heroes/[slug]/page.tsx');
  const patchesPage = read('app/(platform)/games/[gameSlug]/patches/page.tsx');

  assert.match(heroPage, /HeroDetail/);
  assert.match(heroPage, /moduleRegistry\.get/);
  assert.match(patchesPage, /<time dateTime=\{new Date\(patch\.releaseDate\)\.toISOString\(\)\}/);
  assert.match(patchesPage, /text-white\/50/);
});

test('heroes index page exists with metadata and semantic list markup', () => {
  const source = read('app/(platform)/games/[gameSlug]/heroes/page.tsx');

  assert.match(source, /export async function generateMetadata/);
  assert.match(source, /title: `Heroes \| \$\{game\.name\}`/);
  assert.match(source, /characterService\.listCharacters\(gameRecord\.id\)/);
  assert.match(source, /CharactersIndex/);
  assert.match(source, /No heroes available yet for this game\./);
});

test('game module pages use semantic list markup for content groups', () => {
  const gameLandingPage = read('app/(platform)/games/[gameSlug]/page.tsx');
  const heroesPage = read('app/(platform)/games/[gameSlug]/heroes/page.tsx');
  const guidesPage = read('app/(platform)/games/[gameSlug]/guides/page.tsx');
  const tierListsPage = read('app/(platform)/games/[gameSlug]/tier-lists/page.tsx');
  const patchesPage = read('app/(platform)/games/[gameSlug]/patches/page.tsx');

  assert.match(gameLandingPage, /GameIdentityHero game=\{game\}/);
  assert.match(gameLandingPage, /MetaStrip stats=\{stats\} gameSlug=\{game\.slug\}/);
  assert.match(gameLandingPage, /ActionGrid stats=\{stats\} game=\{game\}/);
  assert.match(gameLandingPage, /LiveMetaSection/);
  assert.match(gameLandingPage, /FeaturedGuides/);
  assert.match(gameLandingPage, /RecentUpdates/);
  assert.match(gameLandingPage, /FeaturedHeroes heroes=\{featuredHeroes\} gameSlug=\{game\.slug\}/);
  assert.match(gameLandingPage, /DatabaseShortcuts gameSlug=\{game\.slug\}/);
  assert.match(gameLandingPage, /SeoFooter game=\{game\}/);
  assert.match(gameLandingPage, /const sectionGap = 'mt-6 lg:mt-7'/);

  assert.match(heroesPage, /aria-labelledby="heroes-title"/);
  assert.match(heroesPage, /role="status" aria-live="polite" className="mt-8 text-white\/75">No heroes available yet for this game\./);

  assert.match(guidesPage, /aria-labelledby="guides-title"/);
  assert.match(guidesPage, /GuideCard guide=\{guide\}/);
  assert.match(guidesPage, /div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">/);
  assert.match(guidesPage, /role="status" aria-live="polite" className="text-white\/50 text-xs">No guides available yet for this game\./);

  assert.match(tierListsPage, /aria-labelledby="tier-lists-title"/);
  assert.match(tierListsPage, /<div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">/);
  assert.match(tierListsPage, /Link\s*key=\{tierList\.id\}/);
  assert.match(tierListsPage, /className="mt-8 text-center text-size-small text-white\/50">No tier lists published yet for this game\./);

  assert.match(patchesPage, /aria-labelledby="patches-title"/);
  assert.match(patchesPage, /Link\s*key=\{patch\.id\}/);
  assert.match(patchesPage, /className="text-xs text-white\/50">No patches available yet\./);
});