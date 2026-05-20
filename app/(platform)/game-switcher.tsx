'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { getOptimizedBannerUrl } from '../../shared/utils/banner';

type GameSwitcherTheme = {
  colors: Record<string, string>;
};

export type GameSwitcherItem = {
  slug: string;
  name: string;
  href: string;
  label: string;
  subdomain?: string;
  bannerUrl?: string;
  theme?: GameSwitcherTheme;
};

type GameSwitcherProps = {
  games: GameSwitcherItem[];
};

function getCurrentGame(pathname: string, games: GameSwitcherItem[]) {
  const match = games.find((game) => pathname === game.href || pathname.startsWith(`${game.href}/`));

  return match ?? null;
}

function getMonogram(name: string) {
  const words = name.replace(/[^a-z0-9]+/gi, ' ').trim().split(/\s+/).filter(Boolean);
  const initials = words.length > 1 ? words.map((word) => word[0]).join('') : name.slice(0, 3);

  return initials.toUpperCase();
}

export function GameSwitcher({ games }: GameSwitcherProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const currentGame = useMemo(() => getCurrentGame(pathname, games), [games, pathname]);
  const isLauncherHub = currentGame === null;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div className="relative z-30">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="game-switcher-menu"
        onClick={() => setOpen((value) => !value)}
        className="relative inline-flex min-h-11 items-center gap-3 overflow-hidden rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-left transition hover:border-white/25 hover:bg-white/10 focus-visible:border-sky-300/55 focus-visible:bg-white/10"
      >
        {currentGame ? (
          <span
            className="absolute inset-0 w-full h-full bg-cover bg-center opacity-20"
            style={{ backgroundImage: `url(${getOptimizedBannerUrl(currentGame.bannerUrl, 240)})` }}
            aria-hidden="true"
          />
        ) : (
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-slate-950/35 via-slate-950/65 to-slate-950/85" aria-hidden="true" />
        )}
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-slate-950/20 via-slate-950/55 to-slate-950/80" aria-hidden="true" />
        <span
          className="relative z-10 inline-flex h-9 w-9 items-center justify-center rounded-xl text-[0.65rem] font-semibold tracking-[0.2em] text-white"
          style={{
            background: isLauncherHub
              ? 'linear-gradient(135deg, #5c7cff, #a96cff)'
              : `linear-gradient(135deg, ${currentGame.theme?.colors.primary ?? '#5ac8fa'}, ${currentGame.theme?.colors.secondary ?? '#8bd3ff'})`,
          }}
          aria-hidden="true"
        >
          {currentGame ? getMonogram(currentGame.name) : 'GH'}
        </span>
        <span className="relative z-10 min-w-0">
          <span className="block text-[0.65rem] uppercase tracking-[0.28em] text-white/55 font-semibold">
            {isLauncherHub ? 'Main hub' : 'Current realm'}
          </span>
          <span className="block truncate text-sm font-semibold text-white">{currentGame?.name ?? 'GachaHub'}</span>
        </span>
        <span className="relative z-10 ml-1 text-xs uppercase tracking-[0.25em] text-sky-300">Switch</span>
      </button>

      {open ? (
        <div
          id="game-switcher-menu"
          role="menu"
          aria-label="Switch game hub"
          className="absolute left-0 mt-3 w-[min(92vw,20rem)] overflow-hidden rounded-3xl border border-white/10 bg-slate-950/95 shadow-2xl shadow-black/40 backdrop-blur"
        >
          <div className="border-b border-white/10 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.25em] text-white/55 font-semibold">Choose a hub</p>
            <p className="mt-1 text-sm text-white/70">Jump into one game at a time.</p>
          </div>

          <div className="max-h-[20rem] overflow-auto p-2">
            <Link
              href="/"
              role="menuitem"
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-2xl px-3 py-3 transition focus-visible:bg-white/10 ${
                pathname === '/' || pathname === '/games' ? 'bg-sky-300/15 text-sky-100' : 'hover:bg-white/10 text-white'
              }`}
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-[0.7rem] font-semibold tracking-[0.2em] text-sky-200">
                GH
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold">GachaHub</span>
                <span className="block truncate text-xs text-white/60">Launcher hub</span>
              </span>
            </Link>

            {games.map((game) => {
              const active = pathname === game.href || pathname.startsWith(`${game.href}/`);

              return (
                <Link
                  key={game.slug}
                  href={game.href}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className={`relative flex items-center gap-3 overflow-hidden rounded-2xl px-3 py-3 transition focus-visible:bg-white/10 ${
                    active ? 'bg-sky-300/15 text-sky-100' : 'hover:bg-white/10 text-white'
                  }`}
                >
                  <span
                    className="absolute inset-0 w-full h-full bg-cover bg-center opacity-10"
                    style={{ backgroundImage: `url(${getOptimizedBannerUrl(game.bannerUrl, 160)})` }}
                    aria-hidden="true"
                  />
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-slate-950/10 via-slate-950/45 to-slate-950/75" aria-hidden="true" />
                  <span
                    className="relative z-10 inline-flex h-9 w-9 items-center justify-center rounded-xl text-[0.65rem] font-semibold tracking-[0.2em] text-white"
                    style={{
                      background: `linear-gradient(135deg, ${game.theme?.colors.primary ?? '#5ac8fa'}, ${game.theme?.colors.secondary ?? '#8bd3ff'})`,
                    }}
                    aria-hidden="true"
                  >
                    {getMonogram(game.name)}
                  </span>
                  <span className="relative z-10 min-w-0">
                    <span className="block text-sm font-semibold">{game.name}</span>
                    <span className="block truncate text-xs text-white/60">{game.subdomain ?? game.label}</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}