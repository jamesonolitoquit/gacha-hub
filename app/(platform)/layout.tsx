import { ReactNode } from 'react';
import { GameSwitcher } from './game-switcher';
import { PlatformNav } from './platform-nav';
import { gameModules } from '../../config/games.config';

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
    <div className="min-h-screen">
      <a
        href="#platform-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-40 focus:rounded focus:bg-sky-300 focus:px-4 focus:py-2 focus:font-semibold focus:text-slate-950"
      >
        Skip to main content
      </a>
      <header className="sticky top-0 z-30 border-b border-white/10 bg-black/30 px-4 py-3 backdrop-blur md:px-6 md:py-4">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-4">
          <GameSwitcher games={gameSwitcherItems} />
          <PlatformNav />
        </div>
      </header>
      <main id="platform-main" className="pb-16">
        {children}
      </main>
      <footer className="border-t border-white/10 px-4 py-6 text-center text-xs tracking-[0.2em] text-white/40 md:px-6">
        SSR-first runtime shell for GachaHub
      </footer>
    </div>
  );
}
