'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Fuse from 'fuse.js';

type SearchEntry = {
  label: string;
  description: string;
  href: string;
  type: 'hero' | 'skill' | 'guide' | 'gear' | 'pet';
};

type Props = {
  entries: SearchEntry[];
  gameSlug?: string;
};

function detectGameSlug(pathname: string): string | undefined {
  const match = pathname.match(/\/games\/([^/]+)/);
  return match?.[1] ?? undefined;
}

export default function CommandPalette({ entries: initialEntries, gameSlug: propGameSlug }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [results, setResults] = useState<SearchEntry[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [entries, setEntries] = useState<SearchEntry[]>(initialEntries);
  const [loaded, setLoaded] = useState(initialEntries.length > 0);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>();

  const gameSlug = propGameSlug ?? detectGameSlug(pathname);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => setDebouncedQuery(query), 300);
    return () => { if (debounceTimer.current) clearTimeout(debounceTimer.current); };
  }, [query]);

  useEffect(() => {
    if (!open || loaded || !gameSlug) return;
    fetch(`/api/games/${gameSlug}/search-index`)
      .then((r) => r.json())
      .then((data) => {
        setEntries(data.entries ?? []);
        setLoaded(true);
      })
      .catch(() => {});
  }, [open, gameSlug, loaded]);

  const fuse = useRef(new Fuse(entries, {
    keys: [
      { name: 'label', weight: 3 },
      { name: 'description', weight: 1 },
    ],
    threshold: 0.4,
    minMatchCharLength: 1,
  }));

  useEffect(() => {
    fuse.current.setCollection(entries);
  }, [entries]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery('');
      setDebouncedQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults(entries.slice(0, 8));
      return;
    }
    const res = fuse.current.search(debouncedQuery);
    setResults(res.map((r) => r.item).slice(0, 12));
    setSelectedIndex(0);
  }, [debouncedQuery, entries]);

  const navigate = useCallback(
    (href: string) => {
      setOpen(false);
      router.push(href);
    },
    [router]
  );

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      navigate(results[selectedIndex].href);
    }
  }

  if (!open) return null;

  const typeColors: Record<string, string> = {
    hero: '#7c5cff',
    skill: '#f4c542',
    guide: '#00c851',
    gear: '#33b5e5',
    pet: '#aa66cc',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
      onClick={() => setOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Command search"
    >
      <div
        className="w-full max-w-[600px] overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
        style={{
          borderColor: 'rgba(255,255,255,0.1)',
          background: 'rgba(10,15,24,0.96)',
        }}
      >
        <div className="border-b p-4" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={gameSlug ? 'Search heroes, skills, guides...' : 'Navigate to a game to search'}
            disabled={!gameSlug}
            className="w-full bg-transparent text-lg text-white outline-none placeholder:text-white/30 disabled:opacity-40"
          />
        </div>

        <div className="max-h-[320px] overflow-y-auto p-2">
          {!gameSlug && (
            <p className="p-4 text-center text-sm text-white/40">
              Open ⌘K from inside a game to search its content.
            </p>
          )}
          {gameSlug && results.length === 0 && (
            <p className="p-4 text-center text-sm text-white/30">No results found.</p>
          )}
          {gameSlug && results.map((entry, i) => (
            <button
              key={`${entry.type}-${entry.href}`}
              onClick={() => navigate(entry.href)}
              onMouseEnter={() => setSelectedIndex(i)}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition ${
                i === selectedIndex ? 'text-white' : 'text-white/60'
              }`}
              style={i === selectedIndex ? { background: `${typeColors[entry.type]}15` } : {}}
            >
              <span
                className="flex h-7 w-7 items-center justify-center rounded-lg text-[0.55rem] font-bold uppercase"
                style={{ background: `${typeColors[entry.type]}20`, color: typeColors[entry.type] }}
              >
                {entry.type === 'hero' ? 'H' : entry.type === 'skill' ? 'S' : entry.type === 'guide' ? 'G' : entry.type === 'gear' ? 'W' : 'P'}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{entry.label}</p>
                <p className="truncate text-xs text-white/40">{entry.description}</p>
              </div>
              <span
                className="text-[0.5rem] uppercase tracking-wider text-white/30"
                style={{ color: `${typeColors[entry.type]}60` }}
              >
                {entry.type}
              </span>
            </button>
          ))}
        </div>

        <div
          className="flex items-center gap-4 border-t px-4 py-2"
          style={{ borderColor: 'rgba(255,255,255,0.06)' }}
        >
          <span className="text-[0.6rem] text-white/30">
            <kbd className="rounded border px-1 py-0.5 font-mono text-white/40" style={{ borderColor: 'rgba(255,255,255,0.15)' }}>↑↓</kbd> Navigate
          </span>
          <span className="text-[0.6rem] text-white/30">
            <kbd className="rounded border px-1 py-0.5 font-mono text-white/40" style={{ borderColor: 'rgba(255,255,255,0.15)' }}>Enter</kbd> Open
          </span>
          <span className="text-[0.6rem] text-white/30">
            <kbd className="rounded border px-1 py-0.5 font-mono text-white/40" style={{ borderColor: 'rgba(255,255,255,0.15)' }}>Esc</kbd> Close
          </span>
        </div>
      </div>
    </div>
  );
}
