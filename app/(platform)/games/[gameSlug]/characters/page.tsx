import Link from 'next/link';
import { notFound } from 'next/navigation';
import { moduleRegistry } from '../../../../../core/module-registry';
import { characterService } from '../../../../../server/services/character.service';
import { gameService } from '../../../../../server/services/game.service';

type CharactersPageProps = {
  params: {
    gameSlug: string;
  };
};

export async function generateMetadata({ params }: CharactersPageProps) {
  const game = moduleRegistry.get(params.gameSlug);

  if (!game) {
    return {};
  }

  return {
    title: `Characters | ${game.name}`,
    description: `Browse all characters for ${game.name}.`,
  };
}

export default async function CharactersPage({ params }: CharactersPageProps) {
  const game = moduleRegistry.get(params.gameSlug);

  if (!game) {
    notFound();
  }

  const gameRecord = await gameService.getGameBySlug(params.gameSlug);

  if (!gameRecord) {
    notFound();
  }

  const characters = await characterService.listCharacters(gameRecord.id);

  return (
    <section aria-labelledby="characters-title" className="mx-auto max-w-6xl px-6 py-10">
      <p className="text-sm uppercase tracking-[0.3em] text-sky-300">{game.name}</p>
      <h1 id="characters-title" className="mt-3 text-4xl font-semibold">Characters</h1>
      <p className="mt-3 max-w-2xl text-white/80">Browse all available character records for this game module.</p>
      <p id="characters-status" role="status" aria-live="polite" className="mt-2 text-sm text-white/75">
        {characters.length} character record{characters.length === 1 ? '' : 's'} available.
      </p>

      {characters.length > 0 ? (
        <ul className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {characters.map((character) => (
            <li key={character.id}>
              <Link
                href={`/games/${game.slug}/characters/${character.slug}`}
                className="block rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-sky-300/40 hover:bg-white/10 focus-visible:border-sky-300/55 focus-visible:bg-white/15"
              >
                <p className="text-xs uppercase tracking-[0.25em] text-sky-300">{character.element ?? 'Unknown'}</p>
                <h2 className="mt-2 text-xl font-medium">{character.name}</h2>
                <p className="mt-2 text-sm text-white/75 font-medium">{character.description ?? 'No description available yet.'}</p>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p role="status" aria-live="polite" className="mt-8 text-white/75">No characters available yet for this game.</p>
      )}
    </section>
  );
}
