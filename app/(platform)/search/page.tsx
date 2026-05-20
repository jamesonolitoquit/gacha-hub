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

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const games = await gameService.listGames();
  const query = searchParams?.q?.trim() ?? '';
  const scope = searchParams?.scope === 'game' ? 'game' : 'all';
  const gameSlug = searchParams?.gameSlug;
  const hasQuery = query.length > 0;
  const queryTooShort = hasQuery && query.length < 2;
  const canSearch = hasQuery && !queryTooShort;
  const results = canSearch ? searchService.search(query, scope, gameSlug) : [];
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
            {results.length} result{results.length === 1 ? '' : 's'} found for "{query}".
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
            {results.map((result) => (
              <li key={`${result.type}:${result.slug}`}>
                <Link
                  href={result.type === 'character' && result.game ? `/games/${result.game.slug}/characters/${result.slug}` : `/games/${result.slug}`}
                  className="block rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-sky-300/40 hover:bg-white/10 focus-visible:border-sky-300/55 focus-visible:bg-white/15"
                >
                  <p className="text-xs uppercase tracking-[0.25em] text-sky-300">{result.type}</p>
                  <h2 className="mt-2 text-xl font-medium">{result.title}</h2>
                  <p className="mt-2 text-sm text-white/75 font-medium">{result.description}</p>
                </Link>
              </li>
            ))}
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
