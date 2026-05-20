'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type SearchFormGame = {
  id: string | number;
  slug: string;
  name: string;
};

type SearchFormProps = {
  games: SearchFormGame[];
  query: string;
  scope: 'all' | 'game';
  gameSlug?: string;
  queryTooShort: boolean;
  describedBy: string;
};

export function SearchForm({ games, query, scope, gameSlug, queryTooShort, describedBy }: SearchFormProps) {
  const router = useRouter();
  const [localQuery, setLocalQuery] = useState(query);
  const [localScope, setLocalScope] = useState<'all' | 'game'>(scope);
  const [localGameSlug, setLocalGameSlug] = useState(gameSlug ?? '');

  const submit = () => {
    const trimmedQuery = localQuery.trim();

    if (trimmedQuery.length < 2) {
      return;
    }

    const params = new URLSearchParams();
    params.set('q', trimmedQuery);

    if (localScope === 'game') {
      params.set('scope', 'game');
    }

    if (localGameSlug) {
      params.set('gameSlug', localGameSlug);
    }

    router.push(`/search?${params.toString()}`);
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
      className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5"
    >
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_160px_220px_auto] md:items-end">
        <div>
          <label htmlFor="search-q" className="text-sm font-medium text-white/85">
            Query <span className="text-white/70">(required)</span>
          </label>
          <input
            id="search-q"
            name="q"
            value={localQuery}
            onChange={(event) => setLocalQuery(event.target.value)}
            placeholder="Search games, characters, or guides"
            required
            minLength={2}
            aria-invalid={queryTooShort ? true : undefined}
            aria-errormessage={queryTooShort ? 'search-error' : undefined}
            aria-describedby={describedBy}
            className="mt-2 min-h-11 w-full rounded-xl border border-white/20 bg-black/25 px-3 text-white placeholder:text-white/45 focus-visible:border-sky-300/60"
          />
        </div>

        <div>
          <label htmlFor="search-scope" className="text-sm font-medium text-white/85">
            Scope
          </label>
          <select
            id="search-scope"
            name="scope"
            value={localScope}
            onChange={(event) => setLocalScope(event.target.value as 'all' | 'game')}
            className="mt-2 min-h-11 w-full rounded-xl border border-white/20 bg-black/25 px-3 text-white focus-visible:border-sky-300/60"
          >
            <option value="all">All worlds</option>
            <option value="game">Specific world</option>
          </select>
        </div>

        <div>
          <label htmlFor="search-game" className="text-sm font-medium text-white/85">
            World (optional)
          </label>
          <select
            id="search-game"
            name="gameSlug"
            value={localGameSlug}
            onChange={(event) => setLocalGameSlug(event.target.value)}
            className="mt-2 min-h-11 w-full rounded-xl border border-white/20 bg-black/25 px-3 text-white focus-visible:border-sky-300/60"
          >
            <option value="">Any world</option>
            {games.map((game) => (
              <option key={game.id} value={game.slug}>
                {game.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="min-h-11 rounded-xl bg-sky-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-200 focus-visible:ring-2 focus-visible:ring-sky-200 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        >
          Search
        </button>
      </div>
      <p id="search-help" className="mt-3 text-sm text-white/70">
        Enter at least 2 characters, then press Enter or activate Search.
      </p>
    </form>
  );
}