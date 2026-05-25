'use client';

import Link from 'next/link';
import ImageWithFallback from '../../../shared/components/ImageWithFallback';

type HeroSummary = {
  slug: string;
  name: string;
  class?: string | null;
  role?: string | null;
  element?: string | null;
  portraitUrl?: string | null;
  iconUrl?: string | null;
};

type HeroEntry = {
  character: HeroSummary;
  previousTier?: string | null;
  notes?: string | null;
};

type Props = {
  tier: string;
  color: string;
  heroes: HeroSummary[];
  gameSlug: string;
  entries?: HeroEntry[];
};

export default function TierRow({ tier, color, heroes, gameSlug, entries }: Props) {
  if (heroes.length === 0) return null;

  const heroEntries = entries ?? heroes.map((h) => ({ character: h, previousTier: null, notes: null }));

  return (
    <div
      className="rounded-xl border p-3 transition"
      style={{
        borderColor: `${color}18`,
        background: `linear-gradient(135deg, ${color}06 0%, rgba(255,255,255,0.01) 100%)`,
      }}
    >
      <div className="flex items-center gap-2 mb-2.5">
        <span
          className="inline-flex items-center rounded-lg px-2.5 py-0.5 text-sm font-bold tracking-tight"
          style={{ background: `${color}20`, color, border: `1px solid ${color}25` }}
        >
          {tier}
        </span>
        <span className="text-size-tiny text-white/30">{heroes.length} hero{heroes.length === 1 ? '' : 'es'}</span>
      </div>

      <div
        className="flex gap-2 overflow-x-auto pb-1 scrollbar-none"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {heroEntries.map((entry) => {
          const hero = entry.character;
          const isNew = entry.previousTier == null;
          const movedUp = entry.previousTier && tier !== entry.previousTier;
          const movedDown = entry.previousTier && tier !== entry.previousTier;

          return (
            <Link
              key={hero.slug}
              href={`/games/${gameSlug}/heroes/${hero.slug}`}
              className="group shrink-0 rounded-xl p-1.5 transition hover:-translate-y-0.5"
              style={{
                background: 'rgba(255,255,255,0.02)',
                scrollSnapAlign: 'start',
                width: '88px',
              }}
              title={entry.notes ?? hero.name}
            >
              <div className="relative mx-auto h-16 w-16 overflow-hidden rounded-lg border" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                <ImageWithFallback
                  src={hero.portraitUrl ?? hero.iconUrl}
                  alt={hero.name}
                  nameFallback={hero.name}
                  className="h-16 w-16 object-cover"
                  sizes="64px"
                />
                {isNew && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[7px] font-bold text-black shadow-sm">
                    N
                  </span>
                )}
                {movedUp && entry.previousTier && (
                  <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[7px] font-bold text-white shadow-sm">
                    ↑
                  </span>
                )}
              </div>

              <p className="mt-1 truncate text-center text-size-tiny font-medium leading-tight" style={{ color: 'var(--foreground)' }}>
                {hero.name}
              </p>

              <div className="mt-0.5 flex items-center justify-center gap-1">
                {hero.class && (
                  <span className="truncate text-size-micro uppercase tracking-wider text-white/35">
                    {hero.class}
                  </span>
                )}
                {movedDown && entry.previousTier && (
                  <span className="text-size-micro text-white/30">↓{entry.previousTier}</span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
