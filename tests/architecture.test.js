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

test('search service uses slug-based bootstrap lookup', () => {
  const source = read('server/services/search.service.ts');

  assert.match(source, /getSeedCharactersByGameSlug/);
  assert.doesNotMatch(source, /getSeedCharacters\(gameId\)/);
});

test('skills content slice is wired end to end', () => {
  const repository = read('server/repositories/skill.repository.ts');
  const service = read('server/services/skill.service.ts');
  const skillPage = read('app/(platform)/games/[gameSlug]/skills/[slug]/page.tsx');
  const characterPage = read('app/(platform)/games/[gameSlug]/characters/[slug]/page.tsx');

  assert.match(repository, /\.from\('skills'\)/);
  assert.match(repository, /findByCharacterId/);
  assert.match(service, /getSkill\(gameId: number, slug: string\)/);
  assert.match(skillPage, /skillService\.getSkill/);
  assert.match(skillPage, /characterService\.getCharacterById/);
  assert.match(characterPage, /skillService\.listSkillsForCharacter/);
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
  const source = read('app/(platform)/games/[gameSlug]/characters/[slug]/page.tsx');

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

test('platform navigation exposes active route semantics', () => {
  const source = read('app/(platform)/platform-nav.tsx');

  assert.match(source, /aria-label="Primary navigation"/);
  assert.match(source, /aria-current=\{active \? 'page' : undefined\}/);
  assert.match(source, /min-h-11/);
});

test('game subnav matches overview and sections correctly', () => {
  const source = read('app/(platform)/games/[gameSlug]/game-subnav.tsx');

  assert.ok(source.includes("const overviewMatch = /^\\/games\\/[^/]+$/.test(href);"));
  assert.match(source, /if \(overviewMatch\) \{/);
  assert.match(source, /return pathname === href;/);
  assert.match(source, /return pathname === href \|\| pathname\.startsWith\(`\$\{href\}\/`\);/);
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
  const trendingPage = read('app/(platform)/trending/page.tsx');
  const updatesPage = read('app/(platform)/updates/page.tsx');
  const toolsPage = read('app/(platform)/tools/page.tsx');

  assert.match(gamesPage, /<ul className="w-full grid gap-4 md:grid-cols-2 xl:grid-cols-3">/);
  assert.match(gamesPage, /<li key=\{game\.id\}>/);

  assert.match(trendingPage, /<ul className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">/);
  assert.match(trendingPage, /<li key=\{game\.id\}>/);

  assert.match(updatesPage, /<ul className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">/);
  assert.match(updatesPage, /<li key=\{game\.id\}>/);

  assert.match(toolsPage, /<ul className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">/);
  assert.match(toolsPage, /<li>/);
});

test('platform header brand link has touch-friendly target', () => {
  const source = read('app/(platform)/layout.tsx');

  assert.match(source, /GameSwitcher/);
  assert.match(source, /gameSwitcherItems/);
});

test('game switcher exposes a dropdown menu', () => {
  const source = read('app/(platform)/game-switcher.tsx');

  assert.match(source, /aria-haspopup="menu"/);
  assert.match(source, /Switch game hub/);
  assert.match(source, /GachaHub/);
  assert.match(source, /Choose a hub/);
  assert.match(source, /bannerUrl\?/);
  assert.match(source, /Current realm/);
  assert.match(source, /role="menu"/);
  assert.match(source, /return match \?\? null;/);
});

test('homepage frames the hub as a chooser', () => {
  const source = read('app/page.tsx');

  assert.match(source, /Step into the archive of worlds and choose the game you want to explore\./i);
  assert.match(source, /Choose a game hub/);
  assert.match(source, /Realm status/);
  assert.match(source, /Pick a game from the switcher or the cards below/);
  assert.match(source, /backgroundImage: `url\(\$\{getOptimizedBannerUrl\(game\.bannerUrl, 640\)\}\)`/);
  assert.match(source, /gameModules/);
});

test('game layout provides contextual navigation and skip target', () => {
  const source = read('app/(platform)/games/[gameSlug]/layout.tsx');

  assert.match(source, /href="#game-main"/);
  assert.match(source, /focus:absolute focus:left-6 focus:top-3 focus:z-40/);
  assert.match(source, /<GameSubnav gameSlug=\{game\.slug\} \/>/);
  assert.match(source, /<section id="game-main">\{children\}<\/section>/);
  assert.match(source, /backgroundImage: `url\(\$\{getOptimizedBannerUrl\(game\.bannerUrl, 1280\)\}\)`/);
});

test('guides and tier lists pages expose metadata and empty states', () => {
  const guidesPage = read('app/(platform)/games/[gameSlug]/guides/page.tsx');
  const tierListsPage = read('app/(platform)/games/[gameSlug]/tier-lists/page.tsx');

  assert.match(guidesPage, /export async function generateMetadata/);
  assert.match(guidesPage, /title: `Guides \| \$\{game\.name\}`/);
  assert.match(guidesPage, /No guides available yet for this game\./);

  assert.match(tierListsPage, /export async function generateMetadata/);
  assert.match(tierListsPage, /title: `Tier Lists \| \$\{game\.name\}`/);
  assert.match(tierListsPage, /No tier lists published yet for this game\./);
});

test('character and patch pages use stronger readability classes', () => {
  const characterPage = read('app/(platform)/games/[gameSlug]/characters/[slug]/page.tsx');
  const patchesPage = read('app/(platform)/games/[gameSlug]/patches/page.tsx');

  assert.match(characterPage, /text-white\/75 font-medium/);
  assert.match(characterPage, /focus-visible:border-sky-300\/55/);
  assert.match(patchesPage, /<time dateTime=\{new Date\(patch\.releaseDate\)\.toISOString\(\)\}/);
  assert.match(patchesPage, /text-white\/75/);
});

test('characters index page exists with metadata and semantic list markup', () => {
  const source = read('app/(platform)/games/[gameSlug]/characters/page.tsx');

  assert.match(source, /export async function generateMetadata/);
  assert.match(source, /title: `Characters \| \$\{game\.name\}`/);
  assert.match(source, /characterService\.listCharacters\(gameRecord\.id\)/);
  assert.match(source, /<ul className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">/);
  assert.match(source, /<li key=\{character\.id\}>/);
  assert.match(source, /No characters available yet for this game\./);
});

test('game module pages use semantic list markup for content groups', () => {
  const gameLandingPage = read('app/(platform)/games/[gameSlug]/page.tsx');
  const charactersPage = read('app/(platform)/games/[gameSlug]/characters/page.tsx');
  const guidesPage = read('app/(platform)/games/[gameSlug]/guides/page.tsx');
  const tierListsPage = read('app/(platform)/games/[gameSlug]/tier-lists/page.tsx');
  const patchesPage = read('app/(platform)/games/[gameSlug]/patches/page.tsx');

  assert.match(gameLandingPage, /World focus/);
  assert.match(gameLandingPage, /Explore characters/);
  assert.match(gameLandingPage, /backgroundImage: `url\(\$\{getOptimizedBannerUrl\(game\.bannerUrl, 1280\)\}\)`/);
  assert.match(gameLandingPage, /backgroundImage: `url\(\$\{getOptimizedBannerUrl\(game\.bannerUrl, 720\)\}\)`/);
  assert.match(gameLandingPage, /aspect-\[16\/9\] overflow-hidden rounded-\[1\.25rem\] border border-white\/10 bg-cover bg-center/);
  assert.match(gameLandingPage, /<ul className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">/);
  assert.match(gameLandingPage, /<li key=\{character\.id\}>/);
  assert.match(gameLandingPage, /id="characters-status" role="status" aria-live="polite"/);
  assert.match(gameLandingPage, /id="guides-status" role="status" aria-live="polite"/);
  assert.match(gameLandingPage, /id="tier-lists-status" role="status" aria-live="polite"/);
  assert.match(gameLandingPage, /Realm hub/);
  assert.match(gameLandingPage, /Realm traits/);
  assert.match(gameLandingPage, /Paths/);
  assert.match(gameLandingPage, /No characters available yet for this game\./);
  assert.match(gameLandingPage, /role="status" aria-live="polite" className="mt-4 text-white\/75">No guides available yet for this game\./);
  assert.match(gameLandingPage, /role="status" aria-live="polite" className="mt-4 text-white\/75">No tier lists published yet for this game\./);

  assert.match(charactersPage, /id="characters-status" role="status" aria-live="polite"/);
  assert.match(charactersPage, /role="status" aria-live="polite" className="mt-8 text-white\/75">No characters available yet for this game\./);

  assert.match(guidesPage, /id="guides-status" role="status" aria-live="polite"/);
  assert.match(guidesPage, /<ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">/);
  assert.match(guidesPage, /<li key=\{guide\.id\}>/);
  assert.match(guidesPage, /role="status" aria-live="polite" className="text-white\/75">No guides available yet for this game\./);

  assert.match(tierListsPage, /id="tier-lists-status" role="status" aria-live="polite"/);
  assert.match(tierListsPage, /<ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">/);
  assert.match(tierListsPage, /<li key=\{tierList\.id\}>/);
  assert.match(tierListsPage, /role="status" aria-live="polite" className="text-white\/75">No tier lists published yet for this game\./);

  assert.match(patchesPage, /id="patches-status" role="status" aria-live="polite"/);
  assert.match(patchesPage, /<ul className="space-y-4">/);
  assert.match(patchesPage, /<li key=\{patch\.id\}>/);
  assert.match(patchesPage, /role="status" aria-live="polite" className="text-white\/75">No patches available yet\./);
});