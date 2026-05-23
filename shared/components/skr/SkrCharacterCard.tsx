'use client';

import Link from 'next/link';
import ImageWithFallback from '../ImageWithFallback';

type Character = {
  id: number;
  slug: string;
  name: string;
  rarity?: number | string | null;
  element?: string | null;
  characterClass?: string | null;
  portraitUrl?: string | null;
};

const RARITY_DISPLAY: Record<string, { stars: number; glow?: string }> = {
  'rare': { stars: 4 },
  'legendary': { stars: 5 },
  'legendary-p': { stars: 6, glow: '#ff4444' },
  'legendary-pp': { stars: 6, glow: '#8e44ad' },
};

export default function SkrCharacterCard({
  character,
  href,
  elementConfig,
  classConfig,
  stars,
  raritySlug,
  isActive,
}: {
  character: Character;
  href: string;
  elementConfig?: { label: string; color: string } | null;
  classConfig?: { label: string; color: string } | null;
  stars?: number;
  raritySlug?: string;
  isActive?: boolean;
}) {
  const display = raritySlug ? RARITY_DISPLAY[raritySlug] : undefined;
  const displayStars = display?.stars ?? stars ?? 0;
  const glowColor = display?.glow;
  const hasProfileImage = ['melia', 'ryan', 'teo'].includes(character.slug);
  const skrProfile = hasProfileImage ? `/skr/${character.slug}-profile.png` : null;
  return (
    <Link
      href={href}
      className="group relative flex flex-col overflow-hidden rounded-xl border transition-all duration-200 hover:z-10"
      style={{
        borderColor: isActive ? '#7c5cff' : 'rgba(255,255,255,0.08)',
        boxShadow: isActive ? '0 0 20px rgba(124,92,255,0.3)' : 'none',
      }}
    >
      <div className="aspect-[3/4] w-full min-h-[180px] overflow-hidden bg-[#1a1430]">
        <ImageWithFallback
          src={skrProfile ?? character.portraitUrl}
          backupSrc={skrProfile ? character.portraitUrl ?? null : null}
          alt={character.name}
          nameFallback={character.name}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-2.5">
        <p className="truncate text-xs font-semibold text-white drop-shadow-lg">{character.name}</p>
        <div className="mt-1 flex flex-wrap items-center gap-1">
          {elementConfig && (
            <span
              className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[0.55rem] font-semibold uppercase tracking-wider"
              style={{
                background: `${elementConfig.color}20`,
                border: `1px solid ${elementConfig.color}40`,
                color: elementConfig.color,
              }}
            >
              {elementConfig.label}
            </span>
          )}
          {classConfig && (
            <span
              className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[0.55rem] font-semibold uppercase tracking-wider"
              style={{
                background: `${classConfig.color}20`,
                border: `1px solid ${classConfig.color}40`,
                color: classConfig.color,
              }}
            >
              {classConfig.label}
            </span>
          )}
        </div>
        {displayStars > 0 && (
          <div
            className="mt-0.5 text-[0.6rem] tracking-wide"
            style={{
              color: '#ffd700',
              textShadow: glowColor
                ? `0 0 6px ${glowColor}, 0 0 12px ${glowColor}`
                : undefined,
            }}
          >
            {'★'.repeat(displayStars)}
          </div>
        )}
      </div>
    </Link>
  );
}
