'use client';

import { useContext, useEffect, useRef, useState, useCallback, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { GameContext } from '../game-context';
import { gameModules } from '../../config/games.config';
import { SidebarIcon } from '../../shared/ui/SidebarIcon';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import type { NavItem } from '../../shared/types/taxonomies';

function getMonogram(name: string) {
  const words = name.replace(/[^a-z0-9]+/gi, ' ').trim().split(/\s+/).filter(Boolean);
  const initials = words.length > 1 ? words.map((w) => w[0]).join('') : name.slice(0, 3);
  return initials.toUpperCase();
}

function isActive(href: string, pathname: string): boolean {
  if (href === '/games') return pathname === '/games';
  const segments = href.split('/').filter(Boolean);
  const isRoot = segments.length === 2;
  if (isRoot) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function GameSidebar() {
  const ctx = useContext(GameContext);
  const pathname = usePathname();
  const router = useRouter();
  const game = ctx.selectedGame;
  const isLauncher = !game;

  const [expanded, setExpanded] = useState(false);
  const [view, setView] = useState<'nav' | 'switcher'>(isLauncher ? 'switcher' : 'nav');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isLauncher) setView('switcher');
  }, [isLauncher]);

  useEffect(() => {
    setExpanded(false);
  }, [pathname]);

  const handleEnter = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setExpanded(true);
  }, []);

  const handleLeave = useCallback(() => {
    timerRef.current = setTimeout(() => setExpanded(false), 200);
  }, []);

  const toggleView = useCallback(() => {
    setView((prev) => (prev === 'nav' ? 'switcher' : 'nav'));
  }, []);

  const handleMonogramClick = useCallback(() => {
    if (expanded) {
      toggleView();
    } else {
      setExpanded(true);
      setView('switcher');
    }
  }, [expanded, toggleView]);

  const switchGame = useCallback((slug: string) => {
    router.push(`/games/${slug}`);
    setView('nav');
    setExpanded(false);
  }, [router]);

  const goLauncher = useCallback(() => {
    router.push('/');
    setExpanded(false);
  }, [router]);

  const openSearch = useCallback(() => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true }));
  }, []);

  const navItems = game?.nav ?? [];
  const primaryColor = game?.theme?.colors?.primary ?? '#7c5cff';

  return (
      <aside
        className="fixed left-0 top-12 bottom-0 z-30 hidden lg:block overflow-hidden whitespace-nowrap border-r backdrop-blur-xl transition-[width] duration-200 ease-in-out"
        style={{
          width: expanded ? '224px' : '48px',
          borderColor: 'var(--border-color)',
          background: 'color-mix(in srgb, var(--surface) 92%, transparent)',
        }}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        role="navigation"
        aria-label={game ? `${game.name} navigation` : 'Site navigation'}
      >
        {/* Game pill / Switcher header — collapsed always shows monogram */}
        <div
          className={'flex items-center border-b ' + (expanded ? 'px-3 py-2' : 'justify-center py-2')}
          style={{ borderColor: 'var(--border-color)' }}
        >
          {!expanded ? (
            <button
              onClick={handleMonogramClick}
              className="flex items-center justify-center h-8 w-8 rounded-lg text-[0.55rem] font-bold text-white"
              style={{
                background: game
                  ? `linear-gradient(135deg, ${game.theme.colors.primary}, ${game.theme.colors.secondary})`
                  : 'linear-gradient(135deg, #5c7cff, #a96cff)',
              }}
            >
              {game ? (game.theme.logo?.monogram ?? getMonogram(game.name)) : 'GH'}
            </button>
          ) : view === 'switcher' ? (
            <button onClick={goLauncher} className="flex items-center gap-2 text-sm h-8" style={{ color: 'var(--muted)' }}>
              <ArrowLeft className="h-4 w-4 shrink-0" />
              <span className="leading-[18px]">GachaHub</span>
            </button>
          ) : (
            <button onClick={handleMonogramClick} className="flex items-center gap-2 w-full text-left">
              <span
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[0.55rem] font-bold text-white"
                style={{
                  background: `linear-gradient(135deg, ${game!.theme.colors.primary}, ${game!.theme.colors.secondary})`,
                }}
              >
                {game!.theme.logo?.monogram ?? getMonogram(game!.name)}
              </span>
              <span className="flex flex-col flex-1 min-w-0">
                <span className="text-[0.5rem] uppercase tracking-[0.2em]" style={{ color: 'var(--muted)' }}>Realm</span>
                <span className="text-sm font-semibold truncate" style={{ color: 'var(--foreground)' }}>{game!.name}</span>
              </span>
              <ChevronDown className="h-3 w-3 shrink-0" style={{ color: 'var(--muted)' }} />
            </button>
          )}
        </div>

      {/* Search row */}
      <button
        onClick={openSearch}
        className={'flex items-center gap-2 w-full text-sm border-b transition-colors ' + (expanded ? 'px-3 py-2' : 'justify-center py-2')}
        style={{ borderColor: 'var(--border-color)', color: 'var(--muted)' }}
        aria-label="Search (⌘K)"
      >
        <SidebarIcon name="Search" />
        {expanded && <span className="leading-[18px]">Search</span>}
      </button>

      {view === 'switcher' ? (
        /* Game switcher */
        <div className="mt-2 px-2 space-y-0.5">
          {gameModules.map((m) => {
            const isCurrent = game?.slug === m.slug;
            return (
              <button
                key={m.slug}
                onClick={() => switchGame(m.slug)}
                className={'flex items-center gap-2 w-full rounded-xl transition ' + (expanded ? 'px-2 py-2' : 'justify-center py-2')}
                style={{ background: isCurrent ? `${m.theme.colors.primary}12` : 'transparent' }}
              >
                <span
                  className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[0.5rem] font-bold text-white"
                  style={{ background: `linear-gradient(135deg, ${m.theme.colors.primary}, ${m.theme.colors.secondary})` }}
                >
                  {m.theme.logo?.monogram ?? getMonogram(m.name)}
                </span>
                {expanded && (
                  <span className="text-sm font-medium truncate leading-[18px]" style={{ color: isCurrent ? m.theme.colors.primary : 'var(--foreground)' }}>
                    {m.name}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      ) : (
        /* Nav items */
        <div className="mt-2 px-2 space-y-0.5">
          {navItems.map((item) => (
            <NavItemRow key={item.slug} item={item} gameSlug={game!.slug} pathname={pathname} primaryColor={primaryColor} expanded={expanded} />
          ))}
        </div>
      )}
    </aside>
  );
}

function NavItemRow({ item, gameSlug, pathname, primaryColor, expanded }: { item: NavItem; gameSlug: string; pathname: string; primaryColor: string; expanded: boolean }) {
  const href = item.page
    ? item.page === 'index' ? `/games/${gameSlug}` : `/games/${gameSlug}/${item.page}`
    : `/games/${gameSlug}/${item.slug}`;
  const active = isActive(href, pathname);
  const hasChildren = !!item.children?.length;

  if (hasChildren) {
    return (
      <div className="group">
        <div
          className={'flex items-center gap-2 rounded-xl transition ' + (expanded ? 'px-2 py-2' : 'justify-center py-2')}
          style={{ color: active ? primaryColor : 'var(--foreground)' }}
        >
          <SidebarIcon name={item.icon!} />
          {expanded && (
            <>
              <span className="text-sm font-medium flex-1 leading-[18px]">{item.label}</span>
              <ChevronDown className="h-3 w-3" style={{ color: 'var(--muted)' }} />
            </>
          )}
        </div>
        {expanded && (
          <div className="nav-children ml-9 pl-2 space-y-0.5" style={{ borderLeft: '1px solid var(--border-color)' }}>
            {item.children!.map((child) => {
              const childHref = child.page ? `/games/${gameSlug}/${child.page}` : `/games/${gameSlug}/${child.slug}`;
              const childActive = isActive(childHref, pathname);
              return (
                <Link
                  key={child.slug}
                  href={childHref}
                  className="block rounded-lg px-2 py-1.5 text-sm transition"
                  style={{
                    color: childActive ? primaryColor : 'color-mix(in srgb, var(--foreground) 75%, transparent)',
                    background: childActive ? `${primaryColor}12` : 'transparent',
                  }}
                >
                  {child.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      key={item.slug}
      href={href}
      className={'flex items-center gap-2 rounded-xl transition ' + (expanded ? 'px-2 py-2' : 'justify-center py-2')}
      style={{
        color: active ? primaryColor : 'var(--foreground)',
        background: active ? `${primaryColor}12` : 'transparent',
      }}
    >
      <SidebarIcon name={item.icon!} />
      {expanded && (
        <span className="text-sm font-medium leading-[18px]">{item.label}</span>
      )}
    </Link>
  );
}
