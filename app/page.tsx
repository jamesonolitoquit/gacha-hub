import Link from 'next/link';
import dynamic from 'next/dynamic';
import { gameModules } from '../config/games.config';
import { getOptimizedBannerUrl } from '../shared/utils/banner';

export const metadata = {
  title: 'GachaHub',
  description: 'A fantasy launcher hub for game worlds, guides, and character content.',
};

// Skip to main content link for keyboard users
function SkipLink() {
  return (
    <a
      href="#main-content"
      className="absolute left-0 top-0 -translate-y-full rounded bg-sky-300 px-4 py-2 text-slate-950 font-semibold focus:translate-y-0 z-40"
    >
      Skip to main content
    </a>
  );
}

const featurePillars = [
  {
    title: 'Enter the realm',
    description: 'The root page should feel like a portal into the world, not a system dashboard.',
  },
  {
    title: 'Choose a path',
    description: 'The header switcher should read like a map of worlds, not a settings menu.',
  },
  {
    title: 'Distinct worlds',
    description: 'Each game hub needs its own mood, palette, and visual identity.',
  },
];

export default async function HomePage() {
  const games = gameModules;
  const featuredGame = games[0];
  const ScrollRailControls = dynamic(() => import('./components/scroll-rail-controls'), { ssr: false });
  const RailIndicator = dynamic(() => import('./components/rail-indicator'), { ssr: false });

  return (
    <>
      <SkipLink />
      <main id="main-content" className="fantasy-shell min-h-screen px-6 py-12 text-foreground">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
          <section className="fantasy-panel w-full overflow-visible rounded-[2rem]">
            <div className="absolute left-10 top-10 h-36 w-36 rounded-full bg-sky-300/10 blur-3xl" aria-hidden="true" />
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-amber-200/10 blur-3xl" aria-hidden="true" />
            <div className="grid gap-8 p-8 md:grid-cols-[minmax(0,1.4fr)_minmax(0,0.9fr)] md:p-10">
              <div className="min-w-0">
                <p className="text-sm uppercase tracking-[0.35em] text-sky-300">GachaHub Portal</p>
                <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">
                  Step into the archive of worlds and choose the game you want to explore.
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-7 text-white/75 md:text-lg">
                  GachaHub should feel like a living adventuring space: choose a realm, follow its trail, and dive into the characters, guides, and battles that belong to it.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/games"
                    className="rounded-full bg-sky-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-200 focus-visible:ring-2 focus-visible:ring-sky-200 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                  >
                    Choose a game hub
                  </Link>
                  <Link
                    href="/search"
                    className="rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/10 focus-visible:border-white/50 focus-visible:bg-white/15"
                  >
                    Search content
                  </Link>
                </div>
              </div>

              <aside className="fantasy-card grid min-w-0 gap-4 rounded-[1.5rem] p-5">
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/65 font-semibold">Featured realm</p>
                  <div className="mt-3 overflow-hidden rounded-[1.25rem] border border-white/10 bg-slate-950/40">
                    <div
                      className="min-h-40 bg-cover bg-center"
                      style={{
                        backgroundImage: featuredGame
                          ? `linear-gradient(135deg, ${featuredGame.theme.colors.primary}33, ${featuredGame.theme.colors.secondary}66), url(${getOptimizedBannerUrl(featuredGame.bannerUrl, 960)})`
                          : undefined,
                      }}
                      aria-hidden="true"
                    />
                    <div className="border-t border-white/10 p-4">
                      <p className="text-[0.7rem] uppercase tracking-[0.3em] text-white/60 font-semibold">Ready to enter</p>
                      <div className="mt-2 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-lg font-semibold text-white">
                            {featuredGame?.name ?? 'Choose a realm'}
                          </p>
                          <p className="text-sm text-white/70 font-medium">
                            {featuredGame?.subdomain ?? 'Launcher preview'}
                          </p>
                        </div>
                        <div
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xs font-semibold text-white"
                          style={{
                            background: featuredGame
                              ? `linear-gradient(135deg, ${featuredGame.theme.colors.primary}, ${featuredGame.theme.colors.secondary})`
                              : 'linear-gradient(135deg, #7dd3fc, #dbeafe)',
                          }}
                          aria-hidden="true"
                        >
                          {featuredGame
                            ? featuredGame.name
                                .replace(/[^a-z0-9]+/gi, ' ')
                                .trim()
                                .split(/\s+/)
                                .map((word) => word[0])
                                .join('')
                                .slice(0, 3)
                                .toUpperCase()
                            : 'HUB'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="min-w-0 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/65 font-semibold">Portal preview</p>
                  <p className="mt-3 text-sm text-white/75 font-medium">
                    Choose a world below and the launcher shell follows it into that realm.
                  </p>
                  <p className="mt-3 text-sm text-white/75 font-medium">Realm status: Ready to preview</p>
                  <p className="mt-2 text-sm text-white/70">Pick a game from the switcher or the cards below</p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-2xl font-semibold text-sky-300" aria-label="Games registered">
                      {games.length}
                    </p>
                    <p className="mt-1 text-xs text-white/70 font-medium">Active worlds</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-2xl font-semibold text-white">SSR</p>
                    <p className="mt-1 text-xs text-white/70 font-medium">Live scenes</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-2xl font-semibold text-white">AI</p>
                    <p className="mt-1 text-xs text-white/70 font-medium">Lore tools</p>
                  </div>
                </div>
              </aside>
            </div>
          </section>

        <section className="grid w-full gap-4 md:grid-cols-3">
          {featurePillars.map((pillar) => (
            <article key={pillar.title} className="fantasy-card rounded-3xl p-6">
              <h2 className="text-lg font-semibold text-white">{pillar.title}</h2>
              <p className="mt-3 text-sm leading-6 text-white/75 font-medium">{pillar.description}</p>
            </article>
          ))}
        </section>

        <section className="fantasy-panel w-full rounded-[2rem] p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Choose a hub</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">Select one world and let the whole hub shift with it.</h2>
            </div>
            <Link
              href="/games"
              className="text-sm font-semibold text-sky-300 transition hover:text-sky-200 focus-visible:text-sky-100"
            >
              View the chooser →
            </Link>
          </div>

                <div id="game-rail" tabIndex={0} className="mt-6 -mx-5 px-5 overflow-x-auto motion-scroll-rail snap-x snap-mandatory flex gap-4 py-4 relative">
            {games.map((game) => (
              <Link
                key={game.slug}
                href={`/games/${game.slug}`}
                className="fantasy-card group rounded-2xl p-5 transition hover:-translate-y-0.5 hover:border-sky-300/40 focus-visible:border-sky-300/55 shrink-0 w-[min(70vw,26rem)] snap-start"
              >
                <div
                  className="absolute inset-0 w-full h-full bg-cover bg-center opacity-18"
                  style={{ backgroundImage: `url(${getOptimizedBannerUrl(game.bannerUrl, 640)})` }}
                  aria-hidden="true"
                />
                <div
                  className="absolute inset-0 w-full h-full bg-gradient-to-b from-slate-950/10 via-slate-950/40 to-slate-950/80"
                  style={{ left: 0, right: 0, top: 0, bottom: 0 }}
                  aria-hidden="true"
                />
                <div className="fantasy-orb fantasy-orb--blue right-[-1rem] top-[-1rem] h-24 w-24" aria-hidden="true" />
                <div className="fantasy-orb fantasy-orb--gold bottom-[-1rem] left-[-1rem] h-20 w-20" aria-hidden="true" />
                <div
                  className="relative z-10 inline-flex h-10 w-10 items-center justify-center rounded-xl text-[0.65rem] font-semibold tracking-[0.2em] text-white"
                  style={{
                    background: `linear-gradient(135deg, ${game.theme.colors.primary}, ${game.theme.colors.secondary})`,
                  }}
                  aria-hidden="true"
                >
                  {game.name
                    .replace(/[^a-z0-9]+/gi, ' ')
                    .trim()
                    .split(/\s+/)
                    .map((word) => word[0])
                    .join('')
                    .slice(0, 3)
                    .toUpperCase()}
                </div>
                <div className="relative z-10">
                  <p className="mt-4 text-xs uppercase tracking-[0.25em] text-sky-300">World hub</p>
                  <h3 className="mt-3 text-xl font-semibold text-white group-hover:text-sky-100">{game.name}</h3>
                  <p className="mt-2 text-sm text-white/75 font-medium">Open the hub and explore its characters, guides, and story beats.</p>
                  <p className="mt-4 text-xs uppercase tracking-[0.25em] text-white/60 font-medium">{game.subdomain}</p>
                </div>
              </Link>
            ))}
          </div>
          {/* client scroll controls for the rail */}
          <div className="relative mt-2">
            <ScrollRailControls railId="game-rail" />
            <RailIndicator railId="game-rail" />
          </div>
        </section>
      </div>
    </main>
    </>
  );
}
