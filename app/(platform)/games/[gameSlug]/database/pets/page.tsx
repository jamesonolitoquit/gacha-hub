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
      <div className="flex items-center justify-between border-b pb-3 mb-4" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <h1 id="pets-title" className="text-lg font-semibold">Pets</h1>
        <p className="text-xs text-white/40">{pets.length} companions</p>
      </div>

      <PetIndex pets={pets} />
    </section>
  );
}
