import Link from 'next/link';
import { searchService } from '../../../server/services/search.service';
import { gameService } from '../../../server/services/game.service';
import { SearchForm } from './search-form';

export const metadata = {
  title: 'Search',
  description: 'Search across games and characters in GachaHub.',
};

type SearchPageProps = {
  searchParams?: {
    q?: string;
    scope?: 'all' | 'game';
    gameSlug?: string;
  };
};

const typeColors: Record<string, string> = {
  game: '#7c5cff',
  character: '#7c5cff',
  skill: '#f4c542',
  guide: '#00c851',
  gear: '#33b5e5',
  pet: '#aa66cc',
};

const typeLabels: Record<string, string> = {
  game: 'Game',
  character: 'Hero',
  skill: 'Skill',
  guide: 'Guide',
  gear: 'Gear',
  pet: 'Pet',
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const games = await gameService.listGames();
  const query = searchParams?.q?.trim() ?? '';
  const scope = searchParams?.scope === 'game' ? 'game' : 'all';
  const gameSlug = searchParams?.gameSlug;
  const hasQuery = query.length > 0;
  const queryTooShort = hasQuery && query.length < 2;
  const canSearch = hasQuery && !queryTooShort;
  const results = canSearch ? await searchService.search(query, scope, gameSlug) : [];
  const descriptionId = queryTooShort ? 'search-help search-error' : 'search-help';
  const selectedGame = games.find((game) => game.slug === gameSlug);

  return (
    <section aria-labelledby="search-title" className="mx-auto max-w-6xl px-6 py-10">
      <h1 id="search-title" className="text-3xl font-semibold">
        Search
      </h1>
      <p className="mt-3 text-white/80">
        Search the worlds, characters, and guides inside GachaHub.
      </p>

      <SearchForm
        games={games}
        query={query}
        scope={scope}
        gameSlug={gameSlug}
        queryTooShort={queryTooShort}
        describedBy={descriptionId}
      />

      <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5">
        {queryTooShort ? (
          <p id="search-error" role="alert" className="text-sm font-medium text-rose-300">
            Query is too short. Please enter at least 2 characters.
          </p>
        ) : canSearch ? (
          <p id="search-status" aria-live="polite" className="text-sm text-white/75">
            {results.length} result{results.length === 1 ? '' : 's'} found for &ldquo;{query}&rdquo;.
            {selectedGame ? <span className="ml-2 text-sky-300">Scoped to {selectedGame.name}.</span> : null}
          </p>
        ) : (
          <div className="grid gap-3 md:grid-cols-[minmax(0,1.4fr)_minmax(0,0.9fr)]">
            <div>
              <p className="text-sm font-medium text-white">Search the realm</p>
              <p id="search-help" className="mt-2 text-sm text-white/70">
                Try a character, game, guide, or keyword to begin.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/70">
              You can keep the scope broad or narrow it to a specific world.
            </div>
          </div>
        )}
      </div>

      <div className="mt-6">
        {results.length > 0 ? (
          <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-label="Search results">
            {results.map((result) => {
              const color = typeColors[result.type] ?? '#888888';
              const href = result.href ?? `/games/${result.slug}`;

              return (
                <li key={`${result.type}:${result.slug}`}>
                  <Link
                    href={href}
                    className="group block rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-sky-300/40 hover:bg-white/10 focus-visible:border-sky-300/55 focus-visible:bg-white/15"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block rounded px-1.5 py-0.5 text-[0.5rem] font-bold uppercase tracking-[0.15em]"
                        style={{ background: `${color}20`, color }}
                      >
                        {typeLabels[result.type] ?? result.type}
                      </span>
                      {result.game && (
                        <span className="text-[0.5rem] uppercase tracking-[0.15em] text-white/30">
                          {result.game.name}
                        </span>
                      )}
                    </div>
                    <h2 className="mt-2 text-xl font-medium group-hover:text-sky-100 transition">{result.title}</h2>
                    <p className="mt-2 text-sm text-white/75">{result.description}</p>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          canSearch ? (
            <p className="text-white/75">No results found. Try a broader query or switch scope.</p>
          ) : null
        )}
      </div>
    </section>
  );
}
