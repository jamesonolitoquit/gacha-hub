import Link from 'next/link';
import { notFound } from 'next/navigation';
import { moduleRegistry } from '../../../../../core/module-registry';
import { characterService } from '../../../../../server/services/character.service';
import { gameService } from '../../../../../server/services/game.service';
import CharactersIndex from '../../../../../shared/components/CharactersIndex';

type HeroesPageProps = {
  params: {
    gameSlug: string;
  };
};

export async function generateMetadata({ params }: HeroesPageProps) {
  const game = moduleRegistry.get(params.gameSlug);

  if (!game) {
    return {};
  }

  return {
    title: `Heroes | ${game.name}`,
    description: `Browse all heroes for ${game.name}.`,
    alternates: { canonical: `/games/${params.gameSlug}/heroes` },
  };
}

export default async function HeroesPage({ params }: HeroesPageProps) {
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
    <section aria-labelledby="heroes-title">
      <div className="flex items-center justify-between border-b pb-3 mb-4" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <h1 id="heroes-title" className="text-lg font-semibold">Heroes</h1>
        <p className="text-xs text-white/40">{characters.length} total</p>
      </div>

      {characters.length > 0 ? (
        <CharactersIndex gameSlug={game.slug} characters={characters} />
      ) : (
        <p role="status" aria-live="polite" className="mt-8 text-white/75">No heroes available yet for this game.</p>
      )}
    </section>
  );
}
