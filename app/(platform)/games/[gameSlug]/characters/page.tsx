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
      <div className="flex items-center justify-between border-b pb-3 mb-4" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <h1 id="characters-title" className="text-lg font-semibold">Characters</h1>
        <p className="text-xs text-white/40">{characters.length} total</p>
      </div>

      {characters.length > 0 ? (
        <CharactersIndex gameSlug={game.slug} characters={characters} />
      ) : (
        <p role="status" aria-live="polite" className="mt-8 text-white/75">No characters available yet for this game.</p>
      )}
    </section>
  );
}
