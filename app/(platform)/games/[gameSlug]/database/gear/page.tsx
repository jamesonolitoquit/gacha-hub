import { notFound } from 'next/navigation';
import { moduleRegistry } from '../../../../../../core/module-registry';
import { gameService } from '../../../../../../server/services/game.service';
import { gearService } from '../../../../../../server/services/gear.service';
import GearIndex from '../../../../../../features/gear/components/GearIndex';

type Props = {
  params: { gameSlug: string };
};

export async function generateStaticParams() {
  const games = moduleRegistry.list();
  const params: { gameSlug: string }[] = [];

  for (const game of games) {
    const gameRecord = await gameService.getGameBySlug(game.slug);
    if (!gameRecord) continue;

    const gearSets = await gearService.listGearSets(gameRecord.id);
    if (gearSets.length > 0) {
      params.push({ gameSlug: game.slug });
    }
  }

  return params;
}

export async function generateMetadata({ params }: Props) {
  const game = moduleRegistry.get(params.gameSlug);
  if (!game) return {};

  return {
    title: `Gear Sets | ${game.name}`,
    description: `Equipment sets and their effects for ${game.name}.`,
  };
}

export default async function GearIndexPage({ params }: Props) {
  const game = moduleRegistry.get(params.gameSlug);
  if (!game) notFound();

  const gameRecord = await gameService.getGameBySlug(params.gameSlug);
  if (!gameRecord) notFound();

  const gearSets = await gearService.listGearSets(gameRecord.id);

  return (
    <section aria-labelledby="gear-title">
      <p className="text-xs uppercase tracking-[0.3em] text-white/40">{game.name}</p>
      <h1 id="gear-title" className="mt-2 text-3xl font-semibold text-white">Gear Sets</h1>
      <p className="mt-2 text-sm text-white/60">Equipment sets and their effects.</p>
      <p id="gear-status" role="status" aria-live="polite" className="mt-2 text-sm text-white/50">
        {gearSets.length} gear set{gearSets.length === 1 ? '' : 's'} available.
      </p>

      <div className="mt-6">
        <GearIndex gearSets={gearSets} />
      </div>
    </section>
  );
}
