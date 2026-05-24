'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { tierColors } from '../../../../../shared/styles/tokens';
import { classColors } from '../../../../../shared/styles/tokens';

type FeaturedHero = {
  id: number;
  slug: string;
  name: string;
  class?: string | null;
  tier: string;
  rarity?: string | number | null;
  portraitUrl?: string | null;
};

export default function FeaturedHeroes({
  heroes,
  gameSlug,
}: {
  heroes: FeaturedHero[];
  gameSlug: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (heroes.length === 0) return null;

  return (
    <section>
      <SectionHeading title="Featured Heroes" />

      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto pb-1 scrollbar-none"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {heroes.map((h) => {
          const tierColor = tierColors[h.tier] ?? '#888';
          const classColor = classColors[h.class?.toLowerCase() ?? ''] ?? '#888';
          return (
            <Link
              key={h.id}
              href={`/games/${gameSlug}/characters/${h.slug}`}
              className="group shrink-0 rounded-xl p-3 transition hover:-translate-y-0.5"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-color)',
                scrollSnapAlign: 'start',
                width: '140px',
              }}
            >
              <div
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl text-lg font-bold"
                style={{ background: `${tierColor}15`, color: tierColor }}
              >
                {h.portraitUrl ? (
                  <img src={h.portraitUrl} alt={h.name} className="h-full w-full rounded-xl object-cover" />
                ) : (
                  h.name?.[0] ?? '?'
                )}
              </div>

              <div className="mt-2 text-center">
                <p className="truncate text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                  {h.name}
                </p>

                <div className="mt-1 flex items-center justify-center gap-1">
                  {h.class && (
                    <span
                      className="rounded px-1 py-0.5 text-size-micro font-semibold uppercase tracking-wider"
                      style={{ background: `${classColor}20`, color: classColor }}
                    >
                      {h.class.slice(0, 3)}
                    </span>
                  )}
                  <span
                    className="rounded px-1 py-0.5 text-size-micro font-bold"
                    style={{ background: `${tierColor}25`, color: tierColor }}
                  >
                    {h.tier}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <h2 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{title}</h2>
      <span className="h-px flex-1" style={{ background: 'var(--border-color)' }} />
    </div>
  );
}
