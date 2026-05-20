'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type GameSubnavProps = {
  gameSlug: string;
};

const getItems = (gameSlug: string) => [
  { href: `/games/${gameSlug}`, label: 'Overview' },
  { href: `/games/${gameSlug}/characters`, label: 'Characters' },
  { href: `/games/${gameSlug}/guides`, label: 'Guides' },
  { href: `/games/${gameSlug}/tier-lists`, label: 'Tier Lists' },
  { href: `/games/${gameSlug}/patches`, label: 'Patches' },
];

function isActive(pathname: string, href: string) {
  const overviewMatch = /^\/games\/[^/]+$/.test(href);

  if (overviewMatch) {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function GameSubnav({ gameSlug }: GameSubnavProps) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Game section navigation"
      className="mt-4 grid grid-cols-2 gap-2 text-xs text-white/70 sm:flex sm:flex-wrap sm:gap-3 sm:text-sm"
    >
      {getItems(gameSlug).map((item) => {
        const active = isActive(pathname, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={`inline-flex min-h-11 items-center justify-center rounded-full border px-3 py-2 text-center transition ${
              active
                ? 'border-sky-300/55 bg-sky-300/15 text-sky-100'
                : 'border-white/10 bg-white/5 hover:border-white/25 hover:bg-white/10'
            } focus-visible:border-white/40 focus-visible:bg-white/15`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
