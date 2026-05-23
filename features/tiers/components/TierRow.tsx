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
};

type Props = {
  tier: string;
  color: string;
  heroes: HeroSummary[];
  gameSlug: string;
  collapsed?: boolean;
  previousTier?: string;
  entries?: HeroEntry[];
};

export default function TierRow({ tier, color, heroes, gameSlug, collapsed, previousTier, entries }: Props) {
  if (heroes.length === 0) return null;

  const heroEntries = entries ?? heroes.map((h) => ({ character: h, previousTier: null }));

  return (
    <div
      className="rounded-2xl border p-4 transition"
      style={{
        borderColor: `${color}25`,
        background: `linear-gradient(135deg, ${color}08 0%, rgba(255,255,255,0.02) 100%)`,
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        <span
          className="inline-flex items-center rounded-lg px-3 py-1 text-base font-bold tracking-tight"
          style={{
            background: `${color}20`,
            color: color,
            border: `1px solid ${color}30`,
          }}
        >
          {tier}
        </span>
        <span className="text-xs text-white/30">{heroes.length} hero{heroes.length === 1 ? '' : 'es'}</span>
      </div>

      <div className="flex flex-wrap gap-3">
        {heroEntries.map((entry) => {
          const hero = entry.character;
          const isNew = entry.previousTier == null;
          const movedUp = entry.previousTier && tier !== entry.previousTier;

          return (
            <Link
              key={hero.slug}
              href={`/games/${gameSlug}/characters/${hero.slug}`}
              className="group flex items-center gap-3 rounded-xl border p-2 pr-4 transition hover:border-white/20"
              style={{
                borderColor: 'rgba(255,255,255,0.06)',
                background: 'rgba(255,255,255,0.02)',
              }}
            >
              <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg border relative"
                style={{ borderColor: 'rgba(255,255,255,0.08)' }}
              >
                <ImageWithFallback
                  src={hero.portraitUrl ?? hero.iconUrl}
                  alt={hero.name}
                  nameFallback={hero.name}
                  className="h-10 w-10 object-cover"
                  sizes="40px"
                />
                {isNew && (
                  <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-400 text-[6px] font-bold text-black shadow-sm">
                    N
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-semibold text-white truncate max-w-[120px]">{hero.name}</p>
                  {movedUp && (
                    <span className="text-[0.55rem] whitespace-nowrap text-white/40">
                      ↑{entry.previousTier}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {hero.class && (
                    <span className="text-[0.5rem] uppercase tracking-wider text-white/40">{hero.class}</span>
                  )}
                  {hero.element && (
                    <span className="text-[0.5rem] uppercase tracking-wider text-white/30">{hero.element}</span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
