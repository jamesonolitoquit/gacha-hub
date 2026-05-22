import Link from 'next/link';
import { notFound } from 'next/navigation';
import { moduleRegistry } from '../../../../../core/module-registry';
import { characterService } from '../../../../../server/services/character.service';
import { gameService } from '../../../../../server/services/game.service';
import CharactersIndex from '../../../../../shared/components/CharactersIndex';

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
    <section aria-labelledby="characters-title">
      <p className="text-sm uppercase tracking-[0.3em] text-sky-300">{game.name}</p>
      <h1 id="characters-title" className="mt-3 text-4xl font-semibold">Characters</h1>
      <p className="mt-3 max-w-2xl text-white/80">Browse all available character records for this game module.</p>
      <p id="characters-status" role="status" aria-live="polite" className="mt-2 text-sm text-white/75">
        {characters.length} character record{characters.length === 1 ? '' : 's'} available.
      </p>

      {characters.length > 0 ? (
        <div className="mt-8">
          <CharactersIndex gameSlug={game.slug} characters={characters} />
        </div>
      ) : (
        <p role="status" aria-live="polite" className="mt-8 text-white/75">No characters available yet for this game.</p>
      )}
    </section>
  );
}
