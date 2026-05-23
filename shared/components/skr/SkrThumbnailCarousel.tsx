'use client';

import { useMemo, useCallback } from 'react';
import { useGame } from '../../../platform/hooks/useGame';
import SkrCharacterCard from './SkrCharacterCard';

type Character = {
  id: number;
  slug: string;
  name: string;
  rarity?: number | string | null;
  element?: string | null;
  characterClass?: string | null;
  role?: string | null;
  portraitUrl?: string | null;
};

type Props = {
  gameSlug: string;
  characters: Character[];
  currentSlug?: string;
};

export default function SkrThumbnailCarousel({ gameSlug, characters, currentSlug }: Props) {
  const game = useGame();
  const taxonomies = game?.taxonomies;
  const elements = taxonomies?.elements ?? [];
  const classes = taxonomies?.classes ?? [];
  const rarities = taxonomies?.rarities ?? [];

  const rarityMap = useMemo(() => {
    const m = new Map<string, number>();
    rarities.forEach((r) => {
      m.set(String(r.stars), r.stars);
      m.set(r.slug, r.stars);
    });
    return m;
  }, [rarities]);

  const resolveStars = useCallback(
    (character: Character): number | undefined => {
      if (typeof character.rarity === 'number') return character.rarity;
      if (typeof character.rarity === 'string') {
        const fromMap = rarityMap.get(character.rarity.toLowerCase());
        if (fromMap != null) return fromMap;
      }
      return undefined;
    },
    [rarityMap],
  );

  const resolveRaritySlug = useCallback(
    (character: Character): string | undefined => {
      if (typeof character.rarity === 'string') return character.rarity.toLowerCase();
      if (typeof character.rarity === 'number') {
        const found = rarities.find((r) => r.stars === character.rarity);
        return found?.slug;
      }
      return undefined;
    },
    [rarities],
  );

  const resolveElement = useCallback(
    (slug?: string | null) => elements.find((e) => e.slug === slug?.toLowerCase()),
    [elements],
  );

  const resolveClass = useCallback(
    (slug?: string | null) => classes.find((c) => c.slug === slug?.toLowerCase()),
    [classes],
  );

  if (characters.length === 0) return null;

  return (
    <div>
      <p className="mb-3 text-[0.55rem] uppercase tracking-[0.2em] text-white/40">Roster</p>
      <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'thin' }}>
        {characters.map((character) => {
          const isActive = character.slug === currentSlug;
          const stars = resolveStars(character);
          const raritySlug = resolveRaritySlug(character);
          const elementConfig = resolveElement(character.element);
          const classConfig = resolveClass(character.characterClass ?? character.role);
          return (
            <div key={character.id} className="w-[100px] flex-shrink-0">
              <SkrCharacterCard
                character={character}
                href={`/games/${gameSlug}/characters/${character.slug}`}
                elementConfig={elementConfig}
                classConfig={classConfig}
                stars={stars}
                raritySlug={raritySlug}
                isActive={isActive}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
