"use client";

import { useMemo, useState } from 'react';
import Fuse from 'fuse.js';
import HeroList from './HeroList';

const PAGE_SIZE = 24;

type Character = {
  id: number;
  slug: string;
  name: string;
  rarity?: number | string | null;
  element?: string | null;
  description?: string | null;
  portraitUrl?: string | null;
  role?: string | null;
};

export default function CharactersIndex({ gameSlug, characters }: { gameSlug: string; characters: Character[] }) {
  const [query, setQuery] = useState('');
  const [rarity, setRarity] = useState<'any' | number | '0'>('any');
  const [role, setRole] = useState<'any' | string>('any');
  const [compactView, setCompactView] = useState(false);
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);

  const roles = useMemo(() => {
    const set = new Set<string>();
    characters.forEach((c) => c.role && set.add(c.role));
    return Array.from(set).sort();
  }, [characters]);

  const rarities = useMemo(() => {
    const set = new Set<number>();
    characters.forEach((c) => typeof c.rarity === 'number' && set.add(c.rarity));
    return Array.from(set).sort((a, b) => a - b);
  }, [characters]);

  const fuse = useMemo(() => {
    return new Fuse(characters, {
      keys: ['name', 'slug', 'description'],
      threshold: 0.4,
      distance: 100,
    });
  }, [characters]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let matched = characters;

    if (rarity !== 'any') {
      matched = matched.filter((c) => c.rarity === rarity);
    }
    if (role !== 'any') {
      matched = matched.filter((c) => c.role?.toLowerCase() === String(role).toLowerCase());
    }
    if (q) {
      matched = fuse.search(q).map((r) => r.item);
    }
    return matched;
  }, [characters, query, rarity, role, fuse]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function handleFilterChange(updater: () => void) {
    updater();
    setPage(1);
  }

  return (
    <section>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <input
            aria-label="Search characters"
            placeholder="Search characters..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            className="rounded-md border border-white/10 bg-white/3 px-3 py-2 text-sm text-white/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
          />

          <select
            value={String(rarity)}
            onChange={(e) => { setRarity(e.target.value === 'any' ? 'any' : Number(e.target.value)); setPage(1); }}
            className="rounded-md border border-white/10 bg-white/3 px-2 py-2 text-sm text-white/90"
            aria-label="Filter by rarity"
          >
            <option value="any">Any rarity</option>
            {rarities.map((r) => (
              <option key={r} value={r}>{`${r}★`}</option>
            ))}
          </select>

          <select
            value={role}
            onChange={(e) => { setRole(e.target.value === 'any' ? 'any' : e.target.value); setPage(1); }}
            className="rounded-md border border-white/10 bg-white/3 px-2 py-2 text-sm text-white/90"
            aria-label="Filter by role"
          >
            <option value="any">Any role</option>
            {roles.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setFilterOpen(true)}
            className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/3 px-3 py-2 text-sm text-white/90"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
              <path strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" d="M10 6h8M6 12h12M3 18h18" />
            </svg>
            Filter
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm text-white/75">{filtered.length} result{filtered.length === 1 ? '' : 's'}</div>
          {totalPages > 1 && (
            <div className="flex items-center gap-1 text-sm text-white/60">
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded border border-white/10 px-2 py-1 hover:bg-white/5 disabled:opacity-30"
              >
                Prev
              </button>
              <span className="px-1">{safePage} / {totalPages}</span>
              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="rounded border border-white/10 px-2 py-1 hover:bg-white/5 disabled:opacity-30"
              >
                Next
              </button>
            </div>
          )}
          <button
            type="button"
            aria-pressed={compactView}
            onClick={() => setCompactView((s) => !s)}
            className="ml-2 inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/3 px-3 py-2 text-sm text-white/90"
          >
            {compactView ? 'Compact' : 'Grid'}
          </button>
        </div>
      </div>
      {filterOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setFilterOpen(false)} />
          <div className="relative mt-24 w-[min(480px,95%)] rounded-2xl border bg-white/5 p-6" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Quick Filters</h3>
              <button onClick={() => setFilterOpen(false)} className="text-white/70">Close</button>
            </div>
            <div className="mt-4 space-y-4">
              <div>
                <label className="text-xs uppercase tracking-[0.15em] text-white/50">Rarity</label>
                <select
                  value={String(rarity)}
                  onChange={(e) => setRarity(e.target.value === 'any' ? 'any' : Number(e.target.value))}
                  className="mt-1 w-full rounded-md border border-white/10 bg-white/3 px-3 py-2 text-sm text-white/90"
                >
                  <option value="any">Any rarity</option>
                  {rarities.map((r) => (
                    <option key={r} value={r}>{`${r}★`}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.15em] text-white/50">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value === 'any' ? 'any' : e.target.value)}
                  className="mt-1 w-full rounded-md border border-white/10 bg-white/3 px-3 py-2 text-sm text-white/90"
                >
                  <option value="any">Any role</option>
                  {roles.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {paged.length > 0 ? (
        <HeroList gameSlug={gameSlug} characters={paged} compact={compactView} />
      ) : (
        <p className="py-8 text-center text-white/50">No characters match your filters.</p>
      )}
    </section>
  );
}
