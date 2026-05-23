'use client';

import { useContext } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GameContext } from '../game-context';
import { House, Menu, Search } from 'lucide-react';

export function MobileBottomNav() {
  const ctx = useContext(GameContext);
  const pathname = usePathname();
  const game = ctx.selectedGame;

  const homeHref = game ? `/games/${game.slug}` : '/';

  function openSearch() {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true }));
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 h-14 z-40 border-t backdrop-blur-xl md:hidden flex items-center justify-around px-4"
      style={{
        borderColor: 'var(--border-color)',
        background: 'color-mix(in srgb, var(--surface) 92%, transparent)',
      }}
    >
      <Link
        href={homeHref}
        className="flex flex-col items-center gap-0.5 text-[0.55rem] uppercase tracking-[0.1em]"
        style={{ color: pathname === homeHref ? 'var(--accent)' : 'var(--muted)' }}
      >
        <House className="h-5 w-5" />
        <span>Home</span>
      </Link>

      <button
        onClick={() => ctx.setMobileNavOpen(true)}
        className="flex flex-col items-center gap-0.5 text-[0.55rem] uppercase tracking-[0.1em]"
        style={{ color: 'var(--muted)' }}
      >
        <Menu className="h-5 w-5" />
        <span>Menu</span>
      </button>

      <button
        onClick={openSearch}
        className="flex flex-col items-center gap-0.5 text-[0.55rem] uppercase tracking-[0.1em]"
        style={{ color: 'var(--muted)' }}
      >
        <Search className="h-5 w-5" />
        <span>Search</span>
      </button>
    </nav>
  );
}
