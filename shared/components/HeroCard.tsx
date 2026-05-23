"use client";

import Link from 'next/link';
import ImageWithFallback from './ImageWithFallback';

type Props = {
  gameSlug: string;
  character: {
    id: number;
    slug: string;
    name: string;
    rarity?: number | string | null;
    element?: string | null;
    description?: string | null;
    portraitUrl?: string | null;
  };
  accentPrimary?: string;
  accentSecondary?: string;
};

export default function HeroCard({ gameSlug, character, compact, accentPrimary = '#7c5cff', accentSecondary = '#f4c542' }: Props & { compact?: boolean }) {
  if (compact) {
    return (
      <Link
        href={`/games/${gameSlug}/characters/${character.slug}`}
        className="block rounded-md border p-2 transition"
        style={{
          borderColor: 'rgb(var(--skr-primary-rgb) / 0.12)',
          background: 'rgb(var(--skr-background-rgb) / 0.20)',
        }}
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md relative">
            <ImageWithFallback src={character.portraitUrl} alt={character.name} nameFallback={character.name} className="h-10 w-10" sizes="40px" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-sm font-medium">{character.name}</h3>
              <div className="text-xs text-white/60">{character.rarity ?? '-'}</div>
            </div>
            <p className="mt-1 truncate text-xs text-white/70">{character.element ?? ''}</p>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/games/${gameSlug}/characters/${character.slug}`}
      className="relative block overflow-hidden rounded-lg shadow-sm transition-transform hover:scale-[1.02]"
      style={{
        border: '1px solid rgba(255,255,255,0.06)',
        background: 'linear-gradient(180deg, rgba(17,25,46,0.18), rgba(17,25,46,0.28))',
      }}
    >
      <div className="aspect-square w-full bg-white/4 relative">
        <ImageWithFallback src={character.portraitUrl} alt={character.name} nameFallback={character.name} className="h-full w-full object-cover" sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" aria-hidden />
        <div className="absolute left-3 bottom-3 right-3 flex items-center justify-between gap-2">
          <div className="truncate">
            <div className="text-sm font-semibold text-white truncate">{character.name}</div>
            <div className="text-[0.65rem] text-white/75 truncate">{character.element ?? ''}</div>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="rounded px-2 py-0.5 text-[0.65rem] font-semibold text-white"
              style={{ background: `linear-gradient(135deg, ${accentPrimary} 0%, ${accentSecondary} 100%)` }}
            >
              {character.rarity ?? '-'}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
