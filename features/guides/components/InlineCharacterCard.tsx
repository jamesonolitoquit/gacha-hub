"use client";

import Link from 'next/link';
import ImageWithFallback from '@/shared/components/ImageWithFallback';
import { classColors } from '@/shared/styles/tokens';

type Props = {
  gameSlug: string;
  character: {
    id: number;
    slug: string;
    name: string;
    rarity?: string | null;
    element?: string | null;
    characterClass?: string | null;
    role?: string | null;
    portraitUrl?: string | null;
  };
};

export default function InlineCharacterCard({ gameSlug, character }: Props) {
  const classColor = character.characterClass ? classColors[character.characterClass.toLowerCase()] : undefined;

  return (
    <Link
      href={`/games/${gameSlug}/heroes/${character.slug}`}
      className="inline-flex items-center gap-3 rounded-lg border border-white/10 p-3 transition hover:border-sky-300/40 hover:bg-white/5"
    >
      <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-md relative">
        <ImageWithFallback
          src={character.portraitUrl}
          alt={character.name}
          nameFallback={character.name}
          className="h-14 w-14 object-cover"
          sizes="56px"
        />
      </div>
      <div className="min-w-0">
        <div className="font-semibold text-white">{character.name}</div>
        <div className="mt-1 flex items-center gap-2 flex-wrap">
          {character.element && (
            <span className="text-[0.7rem] text-white/70 bg-white/5 rounded px-2 py-0.5">
              {character.element}
            </span>
          )}
          {character.characterClass && (
            <span
              className="text-[0.7rem] font-medium text-white rounded px-2 py-0.5"
              style={{ background: classColor || 'rgba(255,255,255,0.1)' }}
              title={character.characterClass}
            >
              {character.characterClass}
            </span>
          )}
          {character.rarity && (
            <span className="text-[0.7rem] font-semibold text-white/80">★ {character.rarity}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
