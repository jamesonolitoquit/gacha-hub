'use client';

import { useMemo, useState, useRef, useCallback, useEffect } from 'react';
import { useGame } from '../../../platform/hooks/useGame';
import Fuse from 'fuse.js';
import SkrCharacterCard from './SkrCharacterCard';

const BATCH_SIZE = 24;

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

export default function SkrCharactersIndex({
  gameSlug,
  characters,
}: {
  gameSlug: string;
  characters: Character[];
}) {
  const game = useGame();
  const taxonomies = game?.taxonomies;

  const [query, setQuery] = useState('');
  const [selectedClasses, setSelectedClasses] = useState<Set<string>>(new Set());
  const [selectedRarities, setSelectedRarities] = useState<Set<number>>(new Set());
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const fuse = useMemo(
    () =>
      new Fuse(characters, {
        keys: ['name', 'slug'],
        threshold: 0.4,
        distance: 100,
      }),
    [characters],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let result = characters;

    if (selectedClasses.size > 0) {
      result = result.filter((c) => c.characterClass && selectedClasses.has(c.characterClass.toLowerCase()));
    }
    if (selectedRarities.size > 0) {
      result = result.filter((c) => typeof c.rarity === 'number' && selectedRarities.has(c.rarity));
    }
    if (q) {
      result = fuse.search(q).map((r) => r.item);
    }
    return result;
  }, [characters, query, selectedClasses, selectedRarities, fuse]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  // reset batch when filters change
  useEffect(() => {
    setVisibleCount(BATCH_SIZE);
  }, [query, selectedClasses, selectedRarities]);

  // infinite scroll via IntersectionObserver
  useEffect(() => {
    if (!hasMore) return;
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, filtered.length));
        }
      },
      { rootMargin: '200px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, filtered.length]);

  const toggleClass = useCallback((slug: string) => {
    setSelectedClasses((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }, []);

  const toggleRarity = useCallback((stars: number) => {
    setSelectedRarities((prev) => {
      const next = new Set(prev);
      if (next.has(stars)) next.delete(stars);
      else next.add(stars);
      return next;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setQuery('');
    setSelectedClasses(new Set());
    setSelectedRarities(new Set());
  }, []);

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

  const anyFilter = selectedClasses.size > 0 || selectedRarities.size > 0;

  return (
    <section>
      {/* Search + filters */}
      <div className="mb-2 space-y-1.5">
        <input
          aria-label="Search characters"
          placeholder="Search characters..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full max-w-xs rounded-lg border bg-white/3 px-3 py-1.5 text-sm text-white/90 outline-none transition focus:border-[#7c5cff]/50 focus:ring-1 focus:ring-[#7c5cff]/30"
          style={{ borderColor: 'rgba(255,255,255,0.1)' }}
        />
        <div className="flex flex-wrap items-center gap-1">
          {classes.map((cl) => {
            const active = selectedClasses.has(cl.slug);
            return (
              <button
                key={cl.slug}
                onClick={() => toggleClass(cl.slug)}
                className="rounded-full px-2 py-0.5 text-[0.55rem] font-semibold uppercase tracking-wider transition"
                style={{
                  background: active ? `${cl.color}30` : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${active ? `${cl.color}60` : 'rgba(255,255,255,0.1)'}`,
                  color: active ? cl.color : 'rgba(255,255,255,0.6)',
                }}
              >
                {cl.label}
              </button>
            );
          })}
          {[...rarities].reverse().map((r) => {
            const active = selectedRarities.has(r.stars);
            return (
              <button
                key={r.slug}
                onClick={() => toggleRarity(r.stars)}
                className="rounded-full px-2 py-0.5 text-[0.55rem] font-semibold uppercase tracking-wider transition"
                style={{
                  background: active ? `${r.color}30` : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${active ? `${r.color}60` : 'rgba(255,255,255,0.1)'}`,
                  color: active ? r.color : 'rgba(255,255,255,0.6)',
                }}
              >
                {r.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Count */}
      <p className="mb-3 text-xs text-white/50">
        {filtered.length} character{filtered.length === 1 ? '' : 's'}
        {anyFilter && filtered.length < characters.length && (
          <button
            onClick={clearFilters}
            className="ml-3 text-[#7c5cff] underline transition hover:text-[#f4c542]"
          >
            Clear filters
          </button>
        )}
      </p>

      {/* Grid */}
      {visible.length > 0 ? (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
          {visible.map((character) => {
            const stars = resolveStars(character);
            const raritySlug = resolveRaritySlug(character);
            const elementConfig = resolveElement(character.element);
            const classConfig = resolveClass(character.characterClass ?? character.role);
            return (
              <SkrCharacterCard
                key={character.id}
                character={character}
                href={`/games/${gameSlug}/characters/${character.slug}`}
                elementConfig={elementConfig}
                classConfig={classConfig}
                stars={stars}
                raritySlug={raritySlug}
              />
            );
          })}
        </div>
      ) : (
        <p className="py-12 text-center text-sm text-white/40">No characters match your filters.</p>
      )}

      {/* Infinite scroll sentinel */}
      {hasMore && <div ref={sentinelRef} className="h-10" />}

      {/* No more indicator */}
      {!hasMore && visible.length > 0 && (
        <p className="mt-4 text-center text-xs text-white/30">
          Showing all {filtered.length} characters
        </p>
      )}


    </section>
  );
}
