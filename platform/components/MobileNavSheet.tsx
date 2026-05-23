'use client';

import { useContext, useState } from 'react';
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

export function MobileNavSheet() {
  const ctx = useContext(GameContext);
  const pathname = usePathname();
  const router = useRouter();
  const game = ctx.selectedGame;
  const isLauncher = !game;
  const gameTheme = game?.theme;

  const [sheetView, setSheetView] = useState<'nav' | 'switcher'>('nav');
  const [nestedOpen, setNestedOpen] = useState<Record<string, boolean>>({});

  if (!ctx.mobileNavOpen) return null;

  function handleNavigate(href: string) {
    router.push(href);
    ctx.closeNav();
    setSheetView('nav');
    setNestedOpen({});
  }

  function openSwitcher() { setSheetView('switcher'); }
  function closeSwitcher() { setSheetView('nav'); }
  function toggleNested(slug: string) {
    setNestedOpen((prev) => ({ ...prev, [slug]: !prev[slug] }));
  }

  const navItems = game?.nav ?? [];
  const primaryColor = game?.theme?.colors?.primary ?? '#7c5cff';

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden animate-fadeIn"
        onClick={() => ctx.closeNav()}
      />
      <div
        className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl border p-4 shadow-2xl backdrop-blur-xl md:hidden animate-slideUp"
        style={{
          maxHeight: '85dvh',
          overflowY: 'auto',
          borderColor: 'var(--border-color)',
          background: 'color-mix(in srgb, var(--surface) 95%, transparent)',
        }}
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full" style={{ background: 'var(--muted)' }} />

        {sheetView === 'switcher' ? (
          /* Game switcher */
          <>
            <button
              onClick={closeSwitcher}
              className="flex items-center gap-2 text-sm mb-3"
              style={{ color: 'var(--muted)' }}
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to navigation</span>
            </button>
            <div className="space-y-1">
              {gameModules.map((m) => (
                <button
                  key={m.slug}
                  onClick={() => handleNavigate(`/games/${m.slug}`)}
                  className="flex items-center gap-3 w-full rounded-xl px-3 py-3 transition"
                  style={{ color: 'var(--foreground)' }}
                >
                  <span
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-[0.6rem] font-bold text-white"
                    style={{
                      background: `linear-gradient(135deg, ${m.theme.colors.primary}, ${m.theme.colors.secondary})`,
                    }}
                  >
                    {m.theme.logo?.monogram ?? getMonogram(m.name)}
                  </span>
                  <span className="text-sm font-semibold">{m.name}</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          /* Nav items */
          <>
            {/* Game pill */}
            <button
              onClick={openSwitcher}
              className="flex items-center gap-3 w-full border-b pb-3 mb-2"
              style={{ borderColor: 'var(--border-color)' }}
            >
              <span
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-[0.6rem] font-bold text-white"
                style={{
                  background: game
                    ? `linear-gradient(135deg, ${gameTheme?.colors.primary}, ${gameTheme?.colors.secondary})`
                    : 'linear-gradient(135deg, #5c7cff, #a96cff)',
                }}
              >
                {gameTheme ? (gameTheme.logo?.monogram ?? getMonogram(game.name)) : 'GH'}
              </span>
              <div className="flex flex-col flex-1 text-left">
                <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                  {game ? game.name : 'GachaHub'}
                </span>
                <span className="text-[0.55rem] uppercase tracking-[0.2em]" style={{ color: 'var(--muted)' }}>
                  {gameTheme ? (gameTheme.label ?? 'Game hub') : 'Launcher'} &mdash; tap to change
                </span>
              </div>
              <ChevronDown className="h-4 w-4" style={{ color: 'var(--muted)' }} />
            </button>

            {/* Search trigger */}
            <button
              onClick={() => {
                window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true }));
                ctx.closeNav();
              }}
              className="flex items-center gap-3 w-full rounded-xl px-3 py-3 text-sm mb-2"
              style={{ color: 'var(--muted)' }}
            >
              <SidebarIcon name="Search" />
              <span>Search this realm</span>
            </button>

            {/* Nav items */}
            <div className="space-y-0.5">
              {navItems.map((item) => (
                <MobileNavItemRow
                  key={item.slug}
                  item={item}
                  gameSlug={game?.slug ?? ''}
                  pathname={pathname}
                  primaryColor={primaryColor}
                  nestedOpen={nestedOpen}
                  onToggleNested={toggleNested}
                  onNavigate={handleNavigate}
                />
              ))}
            </div>

            {/* Launcher link */}
            <div className="mt-3 border-t pt-3" style={{ borderColor: 'var(--border-color)' }}>
              <button
                onClick={() => handleNavigate('/')}
                className="flex items-center gap-2 w-full rounded-xl px-3 py-3 text-sm"
                style={{ color: 'var(--muted)' }}
              >
                <ArrowLeft className="h-4 w-4" />
                <span>GachaHub Launcher</span>
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

function MobileNavItemRow({
  item, gameSlug, pathname, primaryColor,
  nestedOpen, onToggleNested, onNavigate,
}: {
  item: NavItem; gameSlug: string; pathname: string; primaryColor: string;
  nestedOpen: Record<string, boolean>; onToggleNested: (slug: string) => void; onNavigate: (href: string) => void;
}) {
  const hasChildren = !!item.children?.length;

  if (hasChildren) {
    const expanded = nestedOpen[item.slug] ?? false;
    const href = item.page
      ? item.page === 'index' ? `/games/${gameSlug}` : `/games/${gameSlug}/${item.page}`
      : `/games/${gameSlug}/${item.slug}`;
    const active = isActive(href, pathname);

    return (
      <div>
        <button
          onClick={() => onToggleNested(item.slug)}
          className="flex items-center gap-3 w-full rounded-xl px-3 py-3 text-sm transition"
          style={{
            color: 'var(--foreground)',
            background: expanded ? `${primaryColor}08` : 'transparent',
          }}
        >
          <SidebarIcon name={item.icon!} className="shrink-0" />
          <span className="font-medium flex-1 text-left">{item.label}</span>
          <ChevronDown
            className={'h-3 w-3 transition-transform duration-200 ' + (expanded ? 'rotate-180' : '')}
            style={{ color: 'var(--muted)' }}
          />
        </button>
        {expanded && (
          <div className="ml-9 mt-0.5 space-y-0.5 border-l pl-2" style={{ borderColor: 'var(--border-color)' }}>
            {item.children!.map((child) => {
              const childHref = child.page ? `/games/${gameSlug}/${child.page}` : `/games/${gameSlug}/${child.slug}`;
              const childActive = isActive(childHref, pathname);
              return (
                <button
                  key={child.slug}
                  onClick={() => onNavigate(childHref)}
                  className="w-full text-left rounded-xl px-3 py-2 text-sm transition"
                  style={{
                    color: childActive ? primaryColor : 'color-mix(in srgb, var(--foreground) 75%, transparent)',
                    background: childActive ? `${primaryColor}12` : 'transparent',
                  }}
                >
                  {child.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  const href = item.page
    ? item.page === 'index' ? `/games/${gameSlug}` : `/games/${gameSlug}/${item.page}`
    : `/games/${gameSlug}/${item.slug}`;
  const active = isActive(href, pathname);

  return (
    <button
      onClick={() => onNavigate(href)}
      className="flex items-center gap-3 w-full rounded-xl px-3 py-3 text-sm font-medium transition"
      style={{
        color: active ? primaryColor : 'var(--foreground)',
        background: active ? `${primaryColor}12` : 'transparent',
      }}
    >
      <SidebarIcon name={item.icon!} className="shrink-0" />
      <span>{item.label}</span>
    </button>
  );
}
