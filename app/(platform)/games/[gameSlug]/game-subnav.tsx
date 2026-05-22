'use client';

import { useContext, useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { GameContext } from '../../../../platform/game-context';

type Props = {
  gameSlug: string;
};

function isActive(pathname: string, href: string): boolean {
  const segments = href.split('/').filter(Boolean);
  const isRoot = segments.length === 2;
  if (isRoot) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function GameSubnav({ gameSlug }: Props) {
  const pathname = usePathname();
  const game = useContext(GameContext);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navItems = game?.nav ?? [
    { slug: 'overview', label: 'Overview', page: 'index' },
    { slug: 'roster', label: 'Roster', page: 'characters' },
    { slug: 'tier-lists', label: 'Tier Lists', page: 'tier-lists' },
    { slug: 'guides', label: 'Guides', page: 'guides' },
    { slug: 'database', label: 'Database', children: [
      { slug: 'heroes', label: 'Heroes', page: 'characters' },
      { slug: 'skills', label: 'Skills', page: 'skills' },
    ]},
    { slug: 'updates', label: 'Updates', page: 'patches' },
  ];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const primary = game?.theme?.colors?.primary ?? '#7c5cff';

  return (
    <nav aria-label="Game section navigation" ref={dropdownRef}>
      <div className="flex flex-wrap items-center gap-0.5">
        {navItems.map((item) => {
          const href = item.page
            ? item.page === 'index'
              ? `/games/${gameSlug}`
              : `/games/${gameSlug}/${item.page}`
            : `/games/${gameSlug}/${item.slug}`;
          const active = href ? isActive(pathname, href) : false;
          const hasDropdown = !!item.children?.length;

          if (hasDropdown) {
            const isOpen = openDropdown === item.slug;
            return (
              <div key={item.slug} className="relative">
                <button
                  onClick={() => setOpenDropdown(isOpen ? null : item.slug)}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-[0.15em] transition ${
                    isOpen
                      ? 'text-white'
                      : 'text-white/60 hover:text-white'
                  }`}
                  style={isOpen ? { background: `${primary}15`, color: primary } : {}}
                >
                  {item.label}
                  <svg
                    className={`h-3 w-3 transition ${isOpen ? 'rotate-180' : ''}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                {isOpen && (
                  <div
                    className="absolute left-0 top-full z-20 mt-1 min-w-[160px] overflow-hidden rounded-xl border p-1 shadow-2xl backdrop-blur-xl"
                    style={{
                      borderColor: 'rgba(255,255,255,0.1)',
                      background: 'rgba(10,15,24,0.95)',
                    }}
                  >
                    {item.children!.map((child) => {
                      const childHref = child.page ? `/games/${gameSlug}/${child.page}` : `/games/${gameSlug}/${child.slug}`;
                      const childActive = isActive(pathname, childHref);
                      return (
                        <Link
                          key={child.slug}
                          href={childHref}
                          onClick={() => setOpenDropdown(null)}
                          className={`block rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-[0.15em] transition ${
                            childActive
                              ? 'text-white'
                              : 'text-white/50 hover:text-white'
                          }`}
                          style={childActive ? { background: `${primary}15`, color: primary } : {}}
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
              href={href ?? '#'}
              className={`rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-[0.15em] transition ${
                active
                  ? 'text-white'
                  : 'text-white/60 hover:text-white'
              }`}
              style={active ? { background: `${primary}15`, color: primary } : {}}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
