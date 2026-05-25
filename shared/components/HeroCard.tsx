"use client";

import { useState } from 'react';
import Link from 'next/link';
import ImageWithFallback from './ImageWithFallback';
import { classColors, tierColors } from '@/shared/styles/tokens';

type Props = {
  gameSlug: string;
  character: {
    id: number;
    slug: string;
    name: string;
    rarity?: number | string | null;
    element?: string | null;
    class?: string | null;
    role?: string | null;
    description?: string | null;
    portraitUrl?: string | null;
  };
  tier?: string | null;
  compact?: boolean;
  accentPrimary?: string;
  accentSecondary?: string;
};

export default function HeroCard({ gameSlug, character, compact, tier, density, accentPrimary = '#7c5cff', accentSecondary = '#f4c542' }: Props & { density?: 'comfortable' | 'compact' | 'list' }) {
  const classColor = character.class ? classColors[character.class.toLowerCase()] : undefined;
  const tierColor = tier ? tierColors[tier] ?? '#888' : undefined;
  const [hovering, setHovering] = useState(false);

  if (compact) {
    if (density === 'list') {
      return (
        <Link
          href={`/games/${gameSlug}/heroes/${character.slug}`}
          className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-xs transition hover:bg-white/[0.04]"
          style={{ background: 'rgba(255,255,255,0.01)' }}
        >
          <div className="h-6 w-6 flex-shrink-0 overflow-hidden rounded relative">
            <ImageWithFallback src={character.portraitUrl} alt={character.name} nameFallback={character.name} className="h-6 w-6" sizes="24px" />
          </div>
          <span className="truncate min-w-0 flex-1">{character.name}</span>
          {character.class && (
            <span className="shrink-0 text-size-micro font-semibold uppercase tracking-wider" style={{ color: classColor || 'rgba(255,255,255,0.4)' }}>
              {character.class.slice(0, 3)}
            </span>
          )}
          {tier && (
            <span className="shrink-0 rounded px-1 py-0.5 text-size-micro font-bold" style={{ background: `${tierColor}22`, color: tierColor }}>
              {tier}
            </span>
          )}
        </Link>
      );
    }

    const padClass = density === 'compact' ? 'px-2 py-1.5' : 'px-2.5 py-2';
    const imgSize = density === 'compact' ? 'h-7 w-7' : 'h-9 w-9';
    const imgSizeNum = density === 'compact' ? '28px' : '36px';

    return (
      <div
        className="relative"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <Link
          href={`/games/${gameSlug}/heroes/${character.slug}`}
          className={`group flex items-center gap-2.5 rounded-lg ${padClass} transition hover:bg-white/[0.05]`}
          style={{ background: 'rgba(255,255,255,0.02)' }}
        >
          <div className={`${imgSize} flex-shrink-0 overflow-hidden rounded-md relative`}>
            <ImageWithFallback src={character.portraitUrl} alt={character.name} nameFallback={character.name} className={imgSize} sizes={imgSizeNum} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h3 className="truncate text-sm font-medium">{character.name}</h3>
              {character.class && (
                <span
                  className="shrink-0 rounded px-1 py-0.5 text-size-tiny font-semibold uppercase tracking-wider"
                  style={{ background: `${classColor || 'rgba(255,255,255,0.1)'}30`, color: classColor || 'rgba(255,255,255,0.6)' }}
                >
                  {character.class.slice(0, 3)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-size-small text-white/50">
              {character.element && <span>{character.element}</span>}
              {character.rarity != null && <span>{character.rarity}</span>}
            </div>
          </div>
          {tier && (
            <span
              className="shrink-0 rounded px-1.5 py-0.5 text-size-tiny font-bold leading-none"
              style={{ background: `${tierColor}22`, color: tierColor }}
            >
              {tier}
            </span>
          )}
        </Link>

        {hovering && (
          <div
            className="absolute left-0 right-0 top-full z-20 mt-0.5 overflow-hidden rounded-lg border"
            style={{
              borderColor: 'rgba(255,255,255,0.08)',
              background: 'color-mix(in srgb, var(--surface, #141b31) 96%, transparent)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <Link
              href={`/games/${gameSlug}/builds`}
              onClick={(e) => e.stopPropagation()}
              className="block px-2.5 py-1.5 text-size-tiny text-white/70 transition hover:bg-white/[0.04] hover:text-white"
            >
              Best Build
            </Link>
            <Link
              href={`/games/${gameSlug}/tier-lists`}
              onClick={(e) => e.stopPropagation()}
              className="block px-2.5 py-1.5 text-size-tiny text-white/70 transition hover:bg-white/[0.04] hover:text-white"
            >
              Tier Rank
            </Link>
            <Link
              href={`/games/${gameSlug}/teams`}
              onClick={(e) => e.stopPropagation()}
              className="block px-2.5 py-1.5 text-size-tiny text-white/70 transition hover:bg-white/[0.04] hover:text-white"
            >
              Top Team
            </Link>
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={`/games/${gameSlug}/heroes/${character.slug}`}
      className="relative block overflow-hidden rounded-lg transition-all duration-200 hover:z-10 hover:scale-[1.03]"
      style={{
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.04)',
        background: 'linear-gradient(180deg, rgba(17,25,46,0.12), rgba(17,25,46,0.22))',
      }}
    >
      <div className="aspect-square w-full bg-white/4 relative">
        <ImageWithFallback src={character.portraitUrl} alt={character.name} nameFallback={character.name} className="h-full w-full object-cover" sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" aria-hidden />
        <div className="absolute left-2.5 bottom-2.5 right-2.5 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="truncate text-sm font-semibold text-white">{character.name}</span>
              {tier && (
                <span
                  className="shrink-0 rounded px-1 py-0.5 text-size-tiny font-bold leading-none"
                  style={{ background: `${tierColor}44`, color: tierColor }}
                >
                  {tier}
                </span>
              )}
            </div>
            <div className="mt-0.5 flex items-center gap-2">
              {character.element && <span className="text-size-small text-white/70">{character.element}</span>}
              {character.class && (
                <span
                  className="rounded px-1 py-0.5 text-size-tiny font-medium text-white"
                  style={{ background: classColor || 'rgba(255,255,255,0.1)' }}
                >
                  {character.class}
                </span>
              )}
            </div>
          </div>
          {character.rarity && (
            <span
              className="shrink-0 rounded px-1.5 py-0.5 text-size-tiny font-semibold text-white"
              style={{ background: `linear-gradient(135deg, ${accentPrimary} 0%, ${accentSecondary} 100%)` }}
            >
              {character.rarity}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
