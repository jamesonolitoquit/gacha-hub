import Link from 'next/link';
import { notFound } from 'next/navigation';
import { moduleRegistry } from '../../../../core/module-registry';
import { characterService } from '../../../../server/services/character.service';
import { guideService } from '../../../../server/services/guide.service';
import { gameService } from '../../../../server/services/game.service';
import { tierListService } from '../../../../server/services/tier-list.service';
import { getOptimizedBannerUrl } from '../../../../shared/utils/banner';

export async function generateMetadata({ params }: GamePageProps) {
  const game = moduleRegistry.get(params.gameSlug);

  if (!game) {
    return {};
  }

  return {
    title: game.name,
    description: `Browse characters, guides, and tier lists for ${game.name}.`,
  };
}

type GamePageProps = {
  params: {
    gameSlug: string;
  };
};

export default async function GameLandingPage({ params }: GamePageProps) {
  const game = moduleRegistry.get(params.gameSlug);

  if (!game) {
    notFound();
  }

  const gameRecord = await gameService.getGameBySlug(params.gameSlug);

  if (!gameRecord) {
    notFound();
  }

  const characters = await characterService.listCharacters(gameRecord.id);
  const guides = await guideService.listGuides(gameRecord.id);
  const tierLists = await tierListService.listTierLists(gameRecord.id);

  return (
    <section aria-labelledby="game-title" className="mx-auto max-w-6xl px-6 py-10">
      <section className="fantasy-panel relative overflow-hidden rounded-[2rem] p-5 sm:p-6 md:p-8">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${getOptimizedBannerUrl(game.bannerUrl, 1280)})` }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 w-full h-full bg-gradient-to-r from-slate-950/10 via-slate-950/45 to-slate-950/85"
          aria-hidden="true"
        />
        <div className="relative z-10 grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.8fr)] lg:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Realm hub</p>
            <h1 id="game-title" className="mt-3 text-3xl font-semibold sm:text-4xl md:text-5xl">{game.name}</h1>
            <p className="mt-3 max-w-2xl text-sm text-white/80 sm:text-base">
              Enter the world hub for {game.name}. Follow the trail into characters, guides, and update logs built for this realm.
            </p>

            <div className="mt-5 flex flex-wrap gap-2.5 text-[0.65rem] uppercase tracking-[0.2em] text-white/70 sm:mt-6 sm:gap-3 sm:text-xs">
              <span className="rounded-full border border-white/15 bg-white/5 px-3 py-2">{game.theme.name}</span>
              <span className="rounded-full border border-white/15 bg-white/5 px-3 py-2">{Object.keys(game.routes).length} paths</span>
              <span className="rounded-full border border-white/15 bg-white/5 px-3 py-2">{game.subdomain}</span>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/40 p-4 shadow-2xl shadow-black/30 backdrop-blur-sm">
            <div
              className="relative aspect-[16/9] overflow-hidden rounded-[1.25rem] border border-white/10 bg-cover bg-center"
              style={{ backgroundImage: `url(${getOptimizedBannerUrl(game.bannerUrl, 720)})` }}
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
                <div>
                  <p className="text-[0.6rem] uppercase tracking-[0.22em] text-white/60 sm:text-[0.65rem]">World focus</p>
                  <p className="mt-1 text-base font-semibold text-white sm:text-lg">{game.name}</p>
                </div>
                <div
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-[0.6rem] font-semibold tracking-[0.2em] text-white sm:h-10 sm:w-10 sm:text-[0.65rem]"
                  style={{
                    background: `linear-gradient(135deg, ${game.theme.colors.primary}, ${game.theme.colors.secondary})`,
                  }}
                >
                  {game.name
                    .split(/[^a-z0-9]+/i)
                    .filter(Boolean)
                    .map((word) => word[0])
                    .join('')
                    .slice(0, 3)
                    .toUpperCase()}
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-3 text-sm text-white/75">
              <p>Choose a path, then let the page shift into the hub for that world.</p>
              <Link
                href={`/games/${game.slug}/characters`}
                className="inline-flex w-fit items-center rounded-full border border-sky-300/30 bg-sky-300/10 px-4 py-2 text-xs uppercase tracking-[0.22em] text-sky-100 transition hover:border-sky-300/55 hover:bg-sky-300/15"
              >
                Explore characters
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="font-medium">Theme</h2>
          <p className="mt-2 text-sm text-white/75 font-medium">{game.theme.name}</p>
        </article>
        <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="font-medium">Realm traits</h2>
          <p className="mt-2 text-sm text-white/75 font-medium">Abilities and content paths available in this world.</p>
        </article>
        <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="font-medium">Paths</h2>
          <p className="mt-2 text-sm text-white/75 font-medium">{Object.keys(game.routes).length} routes ready to explore.</p>
        </article>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-semibold">Characters</h2>
        <p id="characters-status" role="status" aria-live="polite" className="mt-2 text-sm text-white/75">
          {characters.length} character record{characters.length === 1 ? '' : 's'} loaded.
        </p>
        {characters.length > 0 ? (
          <ul className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {characters.map((character) => (
              <li key={character.id}>
                <Link
                  href={`/games/${game.slug}/characters/${character.slug}`}
                  className="block rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-sky-300/40 hover:bg-white/10 focus-visible:border-sky-300/55 focus-visible:bg-white/15"
                >
                  <p className="text-xs uppercase tracking-[0.25em] text-sky-300">{character.element ?? 'Unknown'}</p>
                  <h3 className="mt-2 text-xl font-medium">{character.name}</h3>
                  <p className="mt-2 text-sm text-white/75 font-medium">{character.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p role="status" aria-live="polite" className="mt-4 text-white/75">No characters available yet for this game.</p>
        )}
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-semibold">Guides</h2>
          <p id="guides-status" role="status" aria-live="polite" className="mt-2 text-sm text-white/75">
            {guides.length} guide{guides.length === 1 ? '' : 's'} available.
          </p>
          {guides.length > 0 ? (
            <ul className="mt-4 grid gap-4">
              {guides.map((guide) => (
                <li key={guide.id}>
                  <Link
                    href={`/games/${game.slug}/guides`}
                    className="block rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-sky-300/40 hover:bg-white/10 focus-visible:border-sky-300/55 focus-visible:bg-white/15"
                  >
                    <h3 className="text-lg font-medium">{guide.title}</h3>
                    <p className="mt-2 text-sm text-white/75 font-medium">{guide.summary}</p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p role="status" aria-live="polite" className="mt-4 text-white/75">No guides available yet for this game.</p>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-semibold">Tier Lists</h2>
          <p id="tier-lists-status" role="status" aria-live="polite" className="mt-2 text-sm text-white/75">
            {tierLists.length} tier list{tierLists.length === 1 ? '' : 's'} available.
          </p>
          {tierLists.length > 0 ? (
            <ul className="mt-4 grid gap-4">
              {tierLists.map((tierList) => (
                <li key={tierList.id}>
                  <Link
                    href={`/games/${game.slug}/tier-lists`}
                    className="block rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-sky-300/40 hover:bg-white/10 focus-visible:border-sky-300/55 focus-visible:bg-white/15"
                  >
                    <h3 className="text-lg font-medium">{tierList.title}</h3>
                    <p className="mt-2 text-sm text-white/75 font-medium">{tierList.tierType}</p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p role="status" aria-live="polite" className="mt-4 text-white/75">No tier lists published yet for this game.</p>
          )}
        </div>
      </div>
    </section>
  );
}