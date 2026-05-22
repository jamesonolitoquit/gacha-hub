import { notFound } from 'next/navigation';
import { moduleRegistry } from '../../../../../../core/module-registry';
import { gameService } from '../../../../../../server/services/game.service';
import { petService } from '../../../../../../server/services/pets.service';
import PetIndex from '../../../../../../features/pets/components/PetIndex';

type Props = {
  params: { gameSlug: string };
};

export async function generateStaticParams() {
  const games = moduleRegistry.list();
  const params: { gameSlug: string }[] = [];

  for (const game of games) {
    const gameRecord = await gameService.getGameBySlug(game.slug);
    if (!gameRecord) continue;

    const pets = await petService.listPets(gameRecord.id);
    if (pets.length > 0) {
      params.push({ gameSlug: game.slug });
    }
  }

  return params;
}

export async function generateMetadata({ params }: Props) {
  const game = moduleRegistry.get(params.gameSlug);
  if (!game) return {};

  return {
    title: `Pets | ${game.name}`,
    description: `Companion units and their passive effects for ${game.name}.`,
  };
}

export default async function PetIndexPage({ params }: Props) {
  const game = moduleRegistry.get(params.gameSlug);
  if (!game) notFound();

  const gameRecord = await gameService.getGameBySlug(params.gameSlug);
  if (!gameRecord) notFound();

  const pets = await petService.listPets(gameRecord.id);

  return (
    <section aria-labelledby="pets-title">
      <p className="text-xs uppercase tracking-[0.3em] text-white/40">{game.name}</p>
      <h1 id="pets-title" className="mt-2 text-3xl font-semibold text-white">Pets</h1>
      <p className="mt-2 text-sm text-white/60">Companion units and their passive effects.</p>
      <p id="pets-status" role="status" aria-live="polite" className="mt-2 text-sm text-white/50">
        {pets.length} pet{pets.length === 1 ? '' : 's'} available.
      </p>

      <div className="mt-6">
        <PetIndex pets={pets} />
      </div>
    </section>
  );
}
