'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment } from 'react';

function formatSegment(segment: string): string {
  return segment
    .split(/[-_]/g)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

type Crumb = {
  label: string;
  href: string;
};

export default function Breadcrumbs({ gameName, gameSlug }: { gameName: string; gameSlug: string }) {
  const pathname = usePathname();

  const segments = pathname.split('/').filter(Boolean);

  const gameIndex = segments.indexOf('games');
  if (gameIndex === -1 || gameIndex + 2 > segments.length) return null;

  const gameSegments = segments.slice(gameIndex + 2);
  if (gameSegments.length === 0) return null;

  const crumbs: Crumb[] = [
    { label: 'Home', href: '/' },
    { label: gameName, href: `/games/${gameSlug}` },
  ];

  for (let i = 0; i < gameSegments.length; i++) {
    const seg = gameSegments[i];
    const isLast = i === gameSegments.length - 1;
    if (isLast && seg === gameSegments[i - 1]) break;
    if (isLast && !isNaN(Number(seg))) break;
    crumbs.push({
      label: formatSegment(seg),
      href: isLast ? '' : `/games/${gameSlug}/${gameSegments.slice(0, i + 1).join('/')}`,
    });
  }

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-white/50">
        {crumbs.map((crumb, i) => (
          <Fragment key={crumb.href || i}>
            {i > 0 && (
              <li aria-hidden className="select-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
                </svg>
              </li>
            )}
            <li>
              {crumb.href ? (
                <Link href={crumb.href} className="transition hover:text-white">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-white/80">{crumb.label.replace(/-\d+$/, '')}</span>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
