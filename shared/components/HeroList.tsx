"use client";

import HeroCard from './HeroCard';

type Character = {
  id: number;
  slug: string;
  name: string;
  rarity?: number | string | null;
  element?: string | null;
  description?: string | null;
  portraitUrl?: string | null;
};

export default function HeroList({ gameSlug, characters, compact }: { gameSlug: string; characters: Character[]; compact?: boolean }) {
  if (!characters || characters.length === 0) {
    return <p className="text-white/75">No characters available yet for this game.</p>;
  }

  if (compact) {
    return (
      <ul className="mt-4 grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {characters.map((c) => (
          <li key={c.id}>
            <HeroCard gameSlug={gameSlug} character={c} compact={compact} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="mt-4 grid gap-3 grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12">
      {characters.map((c) => (
        <li key={c.id}>
          <HeroCard gameSlug={gameSlug} character={c} />
        </li>
      ))}
    </ul>
  );
}
