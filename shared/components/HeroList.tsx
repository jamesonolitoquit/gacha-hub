"use client";

import HeroCard from './HeroCard';
import Link from 'next/link';

type Character = {
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

const gridClasses: Record<string, string> = {
  comfortable: "grid gap-1.5 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6",
  compact: "grid gap-1 grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7",
  list: "flex flex-col gap-px",
};

export default function HeroList({ gameSlug, characters, compact, limit, showViewAll, tierMap, density = 'comfortable' }: {
  gameSlug: string;
  characters: Character[];
  compact?: boolean;
  limit?: number;
  showViewAll?: boolean;
  tierMap?: Record<number, string>;
  density?: 'comfortable' | 'compact' | 'list';
}) {
  if (!characters || characters.length === 0) {
    return <p className="text-white/75">No characters available yet for this game.</p>;
  }

  const display = limit ? characters.slice(0, limit) : characters;

  return (
    <div>
      <ul className={compact ? gridClasses[density] : "mt-4 grid gap-3 grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12"}>
        {display.map((c) => (
          <li key={c.id}>
            <HeroCard gameSlug={gameSlug} character={c} compact={compact} tier={tierMap?.[c.id] ?? null} density={density} />
          </li>
        ))}
      </ul>
      {showViewAll && characters.length > (limit ?? Infinity) && (
        <Link
          href={`/games/${gameSlug}/characters`}
          className="mt-2 inline-flex text-size-tiny uppercase tracking-[0.2em] text-white/40 transition hover:text-white/70"
        >
          View all characters →
        </Link>
      )}
    </div>
  );
}
