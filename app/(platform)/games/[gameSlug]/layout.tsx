import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import { moduleRegistry } from '../../../../core/module-registry';
import { RuntimeShell } from '../../../../core/runtime-shell';
import { GameProvider } from '../../../../platform/components/game-provider';
import { AppShell } from '../../app-shell';
import GameSubnav from './game-subnav';
import SearchTrigger from './search-trigger';
import { hexToRgbTriplet } from '../../../../shared/utils/color';

type Props = {
  children: ReactNode;
  params: { gameSlug: string };
};

export default function GameLayout({ children, params }: Props) {
  const game = moduleRegistry.get(params.gameSlug);

  if (!game) {
    notFound();
  }

  return (
    <RuntimeShell game={game}>
      <GameProvider game={game}>
        <AppShell
          skipTargetId="game-main"
          skipLabel="Skip to game content"
          header={(
            <header
              className="sticky top-[92px] z-40 border-b px-6 py-2.5 backdrop-blur-xl md:top-[64px] xl:px-10"
              style={{
                borderColor: 'rgba(255,255,255,0.06)',
                background: 'rgba(10,15,24,0.7)',
                ['--skr-primary-rgb' as string]: hexToRgbTriplet(game.theme.colors.primary),
                ['--skr-secondary-rgb' as string]: hexToRgbTriplet(game.theme.colors.secondary),
                ['--skr-background-rgb' as string]: hexToRgbTriplet(game.theme.colors.background),
                ['--skr-surface-rgb' as string]: hexToRgbTriplet(game.theme.colors.surface),
                ['--skr-text-rgb' as string]: hexToRgbTriplet(game.theme.colors.text),
              }}
            >
              <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span
                    className="text-sm font-bold uppercase tracking-[0.2em]"
                    style={{ color: game.theme.colors.secondary }}
                  >
                    {game.name}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <GameSubnav gameSlug={game.slug} />
                  <SearchTrigger />
                </div>
              </div>
            </header>
          )}
        >
          <section id="game-main" className="mx-auto w-full max-w-[1600px] px-6 py-8 xl:px-10">
            {children}
          </section>
        </AppShell>
      </GameProvider>
    </RuntimeShell>
  );
}
