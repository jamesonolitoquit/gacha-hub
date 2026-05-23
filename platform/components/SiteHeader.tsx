'use client';

import { useContext } from 'react';
import Link from 'next/link';
import { GameContext } from '../game-context';
import { Heart, Search } from 'lucide-react';

export function SiteHeader() {
  const ctx = useContext(GameContext);
  const game = ctx.selectedGame;
  const isLauncher = !game;

  function openSearch() {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true }));
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 h-12 z-40 border-b backdrop-blur-xl"
      style={{
        borderColor: 'var(--border-color)',
        background: 'color-mix(in srgb, var(--surface) 85%, transparent)',
      }}
    >
      <div className="mx-auto max-w-[1600px] h-full flex items-center px-4 md:px-6">
        {/* Left: Search icon — mobile only */}
        <div className="flex items-center lg:hidden">
          <button onClick={openSearch} aria-label="Search (⌘K)" className="p-1.5">
            <Search className="h-4 w-4" style={{ color: 'var(--muted)' }} />
          </button>
        </div>
        <div className="hidden lg:block w-[80px]" />

        {/* Center: Game name (tappable on mobile) */}
        <div className="flex-1 text-center">
          <button
            onClick={() => ctx.setMobileNavOpen(true)}
            className="lg:cursor-default text-sm font-semibold"
            style={{ color: 'var(--foreground)' }}
          >
            {isLauncher ? 'GachaHub' : game.name}
          </button>
        </div>

        {/* Right: Donate */}
        <div className="flex items-center justify-end w-[80px]">
          <Link
            href="/donate"
            className="flex items-center gap-1.5 text-xs"
            style={{ color: 'var(--muted)' }}
          >
            <Heart className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Donate</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
