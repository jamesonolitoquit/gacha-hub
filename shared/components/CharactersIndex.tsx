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

  return (
    <section>
      {/* Persistent filter strip */}
      <div className="flex items-center gap-2 rounded-xl border p-2" style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
        <input
          aria-label="Search characters"
          placeholder="Search..."
          value={query}
          onChange={(e) => { setQuery(e.target.value); setPage(1); }}
          className="min-w-0 flex-1 rounded-md border border-white/10 bg-white/3 px-2.5 py-1.5 text-xs text-white/90 focus:outline-none focus-visible:ring-1 focus-visible:ring-sky-300"
        />

        <select
          value={String(rarity)}
          onChange={(e) => { setRarity(e.target.value === 'any' ? 'any' : Number(e.target.value)); setPage(1); }}
          className="rounded-md border border-white/10 bg-white/3 px-2 py-1.5 text-xs text-white/90"
          aria-label="Filter by rarity"
        >
          <option value="any">Rarity</option>
          {rarities.map((r) => (
            <option key={r} value={r}>{`${r}★`}</option>
          ))}
        </select>

        <select
          value={role}
          onChange={(e) => { setRole(e.target.value === 'any' ? 'any' : e.target.value); setPage(1); }}
          className="rounded-md border border-white/10 bg-white/3 px-2 py-1.5 text-xs text-white/90"
          aria-label="Filter by role"
        >
          <option value="any">Role</option>
          {roles.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>

        <button
          type="button"
          aria-pressed={compactView}
          onClick={() => setCompactView((s) => !s)}
          className="rounded-md border border-white/10 bg-white/3 px-2 py-1.5 text-xs text-white/70 hover:text-white"
        >
          {compactView ? 'Grid' : 'Compact'}
        </button>

        <span className="text-xs text-white/40 whitespace-nowrap">{filtered.length}</span>

        {totalPages > 1 && (
          <div className="flex items-center gap-1 text-xs text-white/50">
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded border border-white/10 px-1.5 py-1 hover:bg-white/5 disabled:opacity-30"
            >
              ‹
            </button>
            <span className="px-0.5">{safePage}/{totalPages}</span>
            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="rounded border border-white/10 px-1.5 py-1 hover:bg-white/5 disabled:opacity-30"
            >
              ›
            </button>
          </div>
        )}
      </div>

      {paged.length > 0 ? (
        <HeroList gameSlug={gameSlug} characters={paged} compact={compactView} />
      ) : (
        <p className="py-8 text-center text-white/50">No characters match your filters.</p>
      )}
    </section>
  );
}
