"use client";

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Fuse from 'fuse.js';
import HeroList from './HeroList';

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

const CLASSES = ['attack', 'defense', 'magic', 'support', 'universal'] as const;

const classColorMap: Record<string, string> = {
  attack: '#e74c3c', defense: '#3498db', magic: '#9b59b6',
  support: '#2ecc71', universal: '#f39c12',
};

export default function OverviewHeroSection({
  gameSlug,
  characters,
  tierMap,
}: {
  gameSlug: string;
  characters: Character[];
  tierMap?: Record<number, string>;
}) {
  const [query, setQuery] = useState('');
  const [selectedClasses, setSelectedClasses] = useState<Set<string>>(new Set());
  const [selectedRarity, setSelectedRarity] = useState<string | null>(null);
  const [density, setDensity] = useState<'comfortable' | 'compact' | 'list'>('comfortable');

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
      result = result.filter((c) => c.class && selectedClasses.has(c.class.toLowerCase()));
    }
    if (selectedRarity) {
      result = result.filter((c) => String(c.rarity) === selectedRarity);
    }
    if (q) {
      result = fuse.search(q).map((r) => r.item);
    }
    return result;
  }, [characters, query, selectedClasses, selectedRarity, fuse]);

  const toggleSet = (set: Set<string>, value: string, setter: (s: Set<string>) => void) => {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    setter(next);
  };

  const clearFilters = () => {
    setQuery('');
    setSelectedClasses(new Set());
    setSelectedRarity(null);
  };

  const anyFilter = selectedClasses.size > 0 || selectedRarity !== null;

  const topMetaTiers = new Set(['SSS', 'SS']);
  const metaHeroes = useMemo(() => {
    if (anyFilter) return [];
    return filtered.filter((c) => tierMap?.[c.id] && topMetaTiers.has(tierMap[c.id])).slice(0, 6);
  }, [filtered, anyFilter, tierMap]);

  const restHeroes = useMemo(() => {
    if (anyFilter) return filtered;
    const metaIds = new Set(metaHeroes.map((c) => c.id));
    return filtered.filter((c) => !metaIds.has(c.id));
  }, [filtered, anyFilter, metaHeroes]);

  return (
    <section>
      {/* Sticky filter bar */}
      <div className="sticky top-0 z-10 -mx-6 px-6 py-2 backdrop-blur-xl" style={{ background: 'color-mix(in srgb, var(--surface, #120f1f) 85%, transparent)' }}>
        <div className="flex flex-wrap items-center gap-2">
          <input
            aria-label="Search heroes"
            placeholder="Search heroes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="min-w-0 flex-1 rounded-lg border bg-white/3 px-3 py-1.5 text-sm text-white/90 outline-none transition focus:border-[#7c5cff]/50 focus:ring-1 focus:ring-[#7c5cff]/30"
            style={{ borderColor: 'rgba(255,255,255,0.1)' }}
          />

          {CLASSES.map((cl) => {
            const active = selectedClasses.has(cl);
            const color = classColorMap[cl];
            return (
              <button
                key={cl}
                onClick={() => toggleSet(selectedClasses, cl, setSelectedClasses)}
                className="rounded-full px-2 py-0.5 text-size-tiny font-semibold uppercase tracking-wider transition"
                style={{
                  background: active ? `${color}30` : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${active ? `${color}60` : 'rgba(255,255,255,0.1)'}`,
                  color: active ? color : 'rgba(255,255,255,0.5)',
                }}
              >
                {cl.slice(0, 3)}
              </button>
            );
          })}

          <span className="h-4 w-px bg-white/10" />

          {[5, 4, 3, 2, 1].map((n) => {
            const active = selectedRarity === String(n);
            return (
              <button
                key={n}
                onClick={() => setSelectedRarity(active ? null : String(n))}
                className="rounded-full px-2 py-0.5 text-size-tiny font-semibold tracking-wider transition"
                style={{
                  background: active ? 'rgba(255,215,0,0.2)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${active ? 'rgba(255,215,0,0.5)' : 'rgba(255,255,255,0.1)'}`,
                  color: active ? '#ffd700' : 'rgba(255,255,255,0.5)',
                }}
              >
                {n}★
              </button>
            );
          })}

          <span className="h-4 w-px bg-white/10" />

          {(['comfortable', 'compact', 'list'] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDensity(d)}
              className="rounded px-2 py-0.5 text-size-tiny font-medium capitalize tracking-wider transition"
              style={{
                background: density === d ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)',
                color: density === d ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)',
              }}
            >
              {d === 'comfortable' ? 'Std' : d === 'compact' ? 'Cmp' : 'List'}
            </button>
          ))}
        </div>

        <div className="mt-1.5 flex items-center gap-3 text-size-tiny">
          <span className="text-white/40">{filtered.length} of {characters.length} heroes</span>
          {anyFilter && (
            <button onClick={clearFilters} className="text-[#7c5cff] underline transition hover:text-[#f4c542]">
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Sectioned hero grid */}
      <div className="mt-2 space-y-4">
        {metaHeroes.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <h3 className="text-xs font-semibold text-white/80">Top Meta</h3>
              <span className="rounded bg-[#ff4444]/10 px-1.5 py-0.5 text-size-micro font-bold text-[#ff4444]">SSS / SS</span>
            </div>
            <HeroList gameSlug={gameSlug} characters={metaHeroes} compact tierMap={tierMap} density={density} />
          </div>
        )}
        {restHeroes.length > 0 && (
          <div>
            {(metaHeroes.length > 0 || anyFilter) && (
              <h3 className="text-xs font-semibold text-white/60 mb-1.5">All Heroes</h3>
            )}
            <HeroList gameSlug={gameSlug} characters={restHeroes} compact tierMap={tierMap} limit={anyFilter ? 24 : undefined} showViewAll={anyFilter} density={density} />
            {!anyFilter && restHeroes.length > 24 && (
              <Link
                href={`/games/${gameSlug}/heroes`}
                className="mt-2 inline-flex text-size-tiny uppercase tracking-[0.2em] text-white/40 transition hover:text-white/70"
              >
                View all characters →
              </Link>
            )}
          </div>
        )}
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-white/40">No heroes match your filters.</p>
        )}
      </div>
    </section>
  );
}
