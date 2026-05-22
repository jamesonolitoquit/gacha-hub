'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/games', label: 'Games' },
  { href: '/updates', label: 'Updates' },
];

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function PlatformNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary navigation"
      className="grid grid-cols-2 gap-1 text-[0.68rem] text-white/70 sm:flex sm:flex-wrap sm:gap-1.5 sm:text-[0.72rem]"
    >
      {navItems.map((item) => {
        const active = isActivePath(pathname, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={`inline-flex min-h-9 items-center justify-center rounded-full border px-2 py-1 text-center transition $
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
