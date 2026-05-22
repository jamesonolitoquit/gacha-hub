import { ReactNode } from 'react';
import { GameSwitcher } from './game-switcher';
import { PlatformNav } from './platform-nav';
import { gameModules } from '../../config/games.config';
import SearchProvider from '../../features/search/components/SearchProvider';
import HeaderSearch from '../../features/search/components/HeaderSearch';
import { AppShell } from './app-shell';

const gameSwitcherItems = gameModules.map((game) => ({
  slug: game.slug,
  name: game.name,
  href: `/games/${game.slug}`,
  label: game.id,
  subdomain: game.subdomain,
  bannerUrl: game.bannerUrl,
  theme: game.theme,
}));

export default function PlatformLayout({ children }: { children: ReactNode }) {
  return (
    <SearchProvider>
      <AppShell
        skipTargetId="platform-main"
        skipLabel="Skip to main content"
        header={(
          <header className="sticky top-0 z-50 border-b border-white/10 bg-black/55 px-4 py-1 backdrop-blur-xl md:px-6 md:py-1.5">
            <div className="mx-auto flex max-w-6xl items-center gap-3">
              <GameSwitcher games={gameSwitcherItems} />
              <div className="hidden md:block flex-1 max-w-[200px]">
                <HeaderSearch />
              </div>
              <div className="md:ml-auto">
                <PlatformNav />
              </div>
            </div>
          </header>
        )}
        footer={(
          <footer className="border-t border-white/10 px-4 py-6 text-center text-xs tracking-[0.2em] text-white/40 md:px-6">
            SSR-first runtime shell for GachaHub
          </footer>
        )}
      >
        {children}
      </AppShell>
    </SearchProvider>
  );
}
