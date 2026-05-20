import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import { moduleRegistry } from '../../../../core/module-registry';
import { RuntimeShell } from '../../../../core/runtime-shell';
import { GameProvider } from '../../../../platform/components/game-provider';
import { GameSubnav } from './game-subnav';
import { getOptimizedBannerUrl } from '../../../../shared/utils/banner';

export default function GameLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { gameSlug: string };
}) {
  const game = moduleRegistry.get(params.gameSlug);

  if (!game) {
    notFound();
  }

  return (
    <RuntimeShell game={game}>
      <GameProvider game={game}>
        <div className="min-h-screen">
          <div className="mx-auto w-full max-w-6xl px-6 pt-6">
            <a
              href="#game-main"
              className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-3 focus:z-40 focus:rounded focus:bg-sky-300 focus:px-4 focus:py-2 focus:font-semibold focus:text-slate-950"
            >
              Skip to game content
            </a>
            <section className="fantasy-panel relative overflow-hidden rounded-[2rem] p-6 md:p-8">
              <div
                className="absolute inset-0 w-full h-full bg-cover bg-center opacity-20"
                style={{ backgroundImage: `url(${getOptimizedBannerUrl(game.bannerUrl, 1280)})` }}
                aria-hidden="true"
              />
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-slate-950/15 via-slate-950/55 to-slate-950/85" aria-hidden="true" />
              <div className="relative z-10">
                <p className="text-sm uppercase tracking-[0.25em] text-sky-300">{game.name}</p>
                <p className="mt-3 max-w-2xl text-white/75">
                  A dedicated hub for {game.name}. Explore the realm, open its characters, and follow the latest updates.
                </p>
                <GameSubnav gameSlug={game.slug} />
              </div>
            </section>
          </div>
          <section id="game-main">{children}</section>
        </div>
      </GameProvider>
    </RuntimeShell>
  );
}
