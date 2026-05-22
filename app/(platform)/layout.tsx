import { ReactNode } from 'react';
import ScrollCollapseHeader from './scroll-collapse-header';
import { gameModules } from '../../config/games.config';
import SearchProvider from '../../features/search/components/SearchProvider';
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
        header={<ScrollCollapseHeader games={gameSwitcherItems} />}
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
