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
    alternates: { canonical: `/games/${params.gameSlug}/database/gear` },
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
      <div className="flex items-center justify-between border-b pb-3 mb-4" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <h1 id="gear-title" className="text-lg font-semibold">Gear Sets</h1>
        <p className="text-xs text-white/40">{gearSets.length} sets</p>
      </div>

      <GearIndex gearSets={gearSets} />
    </section>
  );
}
