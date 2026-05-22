import Link from 'next/link';
import { gameService } from '../../../server/services/game.service';
import { getOptimizedBannerUrl } from '../../../shared/utils/banner';

export const metadata = {
  title: 'Updates',
  description: 'Patch and content update entry points for GachaHub.',
};

export default async function UpdatesPage() {
  const games = await gameService.listGames();

    return (
      <section className="px-6 py-10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
          <section
            aria-labelledby="updates-title"
            className="fantasy-panel w-full rounded-[2rem] p-8 relative overflow-hidden"
            style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03)), rgba(7,11,22,0.92)' }}
          >
            <span aria-hidden className="absolute inset-0 rounded-[2rem] bg-[rgba(7,11,22,0.92)] pointer-events-none" />
            <div className="fantasy-orb fantasy-orb--blue left-[-3rem] top-[-3rem] h-36 w-36" aria-hidden="true" />
            <div className="fantasy-orb fantasy-orb--violet right-[-3rem] bottom-[-3rem] h-28 w-28" aria-hidden="true" />
            <div className="relative z-10">
              <h1 id="updates-title" className="text-3xl font-semibold">
                Updates
              </h1>
              <p className="mt-3 text-white/80">Patch notes and content updates are organized by registered game module.</p>

              <ul className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {games.map((game) => (
                  <li key={game.id}>
                    <Link
                      href={`/games/${game.slug}/patches`}
                      className="fantasy-card group rounded-3xl p-6 transition hover:-translate-y-0.5 hover:border-sky-300/40 focus-visible:border-sky-300/55 block w-full"
                    >
                      <div
                        className="absolute inset-0 w-full h-full bg-cover bg-center opacity-20"
                        style={{ backgroundImage: `url(${getOptimizedBannerUrl(game.bannerUrl, 720)})` }}
                        aria-hidden="true"
                      />
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-slate-950/10 via-slate-950/45 to-slate-950/85" aria-hidden="true" />
                      <div className="relative z-10">
                        <p className="text-xs uppercase tracking-[0.25em] text-sky-300">{game.status ?? 'active'}</p>
                        <h2 className="mt-2 text-xl font-medium">{game.name}</h2>
                        <p className="mt-2 text-sm text-white/75 font-medium">Update hub for guides, tier lists, and patch notes.</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </section>
    );
}
