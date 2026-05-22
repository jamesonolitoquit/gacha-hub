import Link from 'next/link';
import Image from 'next/image';
import { gameService } from '../../../server/services/game.service';
import { getOptimizedBannerUrl } from '../../../shared/utils/banner';

export const metadata = {
  title: 'Games Directory',
  description: 'Choose a game world and enter its dedicated hub in GachaHub.',
};

export default async function GamesDirectoryPage() {
  const games = await gameService.listGames();
  const visibleGames = games.slice(0, 6);

  return (
    <section aria-labelledby="games-directory-title" className="px-6 py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <section className="fantasy-panel w-full rounded-[2rem] p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-sky-300">World directory</p>
              <h1 id="games-directory-title" className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
                Choose your next adventure
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-white/80 md:text-lg">
                Each card leads into a distinct game hub. Pick the world you want to explore and the shell will reshape itself around it.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 text-center sm:grid-cols-3 md:min-w-[280px]">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-2xl font-semibold text-sky-300" aria-label="Total games">{games.length}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.25em] text-white/70 font-medium">Worlds</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-2xl font-semibold text-white">SSR</p>
                <p className="mt-1 text-xs uppercase tracking-[0.25em] text-white/70 font-medium">Ready</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-2xl font-semibold text-white">Live</p>
                <p className="mt-1 text-xs uppercase tracking-[0.25em] text-white/70 font-medium">Hubs</p>
              </div>
            </div>
          </div>
        </section>

        <ul className="w-full grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visibleGames.length > 0 ? (
            visibleGames.map((game) => (
              <li key={game.id}>
                <Link
                  href={`/games/${game.slug}`}
                  className="fantasy-card group rounded-3xl p-6 transition hover:-translate-y-0.5 hover:border-sky-300/40 focus-visible:border-sky-300/55 block w-full"
                >
                  {game.bannerUrl ? (
                    <div className="absolute inset-0 -z-10">
                      <Image src={getOptimizedBannerUrl(game.bannerUrl, 720)} alt={`${game.name} banner`} fill className="object-cover opacity-20" />
                    </div>
                  ) : null}
                  <div
                    className="absolute inset-0 w-full h-full bg-gradient-to-b from-slate-950/10 via-slate-950/45 to-slate-950/85"
                    style={{ left: 0, right: 0, top: 0, bottom: 0 }}
                    aria-hidden="true"
                  />
                  <div className="fantasy-orb fantasy-orb--violet right-[-1rem] top-[-1rem] h-24 w-24" aria-hidden="true" />
                  <div className="relative z-10">
                    <p className="text-xs uppercase tracking-[0.25em] text-sky-300">World hub</p>
                    <h2 className="mt-3 text-2xl font-semibold text-white group-hover:text-sky-100">{game.name}</h2>
                    <p className="mt-3 text-sm leading-6 text-white/75 font-medium">Enter the {game.name} hub and continue the adventure.</p>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-4 text-xs uppercase tracking-[0.25em] text-white/60 font-medium">
                      <span>{game.slug}</span>
                      <span>Open world hub</span>
                    </div>
                  </div>
                </Link>
              </li>
            ))
          ) : (
            <li className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white/75">No games are registered yet.</li>
          )}
        </ul>
      </div>
    </section>
  );
}
