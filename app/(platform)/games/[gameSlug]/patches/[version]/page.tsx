import { notFound } from 'next/navigation';
import { moduleRegistry } from '../../../../../../core/module-registry';
import { gameService } from '../../../../../../server/services/game.service';
import { patchService } from '../../../../../../server/services/patch.service';

type PatchDetailPageProps = {
  params: {
    gameSlug: string;
    version: string;
  };
};

export async function generateMetadata({ params }: PatchDetailPageProps) {
  const game = moduleRegistry.get(params.gameSlug);

  if (!game) {
    return {};
  }

  return {
    title: `Patch ${params.version} | ${game.name}`,
    description: `Patch notes for version ${params.version} of ${game.name}.`,
  };
}

export default async function PatchDetailPage({ params }: PatchDetailPageProps) {
  const game = moduleRegistry.get(params.gameSlug);

  if (!game) {
    notFound();
  }

  const gameRecord = await gameService.getGameBySlug(params.gameSlug);

  if (!gameRecord) {
    notFound();
  }

  const patch = await patchService.getPatch(gameRecord.id, params.version);

  if (!patch) {
    notFound();
  }

  return (
    <section aria-labelledby="patch-detail-title" className="mx-auto max-w-4xl px-6 py-10">
      <p className="text-sm uppercase tracking-[0.3em] text-sky-300">{game.name}</p>
      <h1 id="patch-detail-title" className="mt-3 text-4xl font-semibold">Version {patch.version}</h1>
      {patch.title && <p className="mt-1 text-2xl font-light text-white/80">{patch.title}</p>}
      <p className="mt-4 text-sm text-white/70">
        Released {new Date(patch.releaseDate).toLocaleDateString()}
      </p>

      {patch.notes && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold">Summary</h2>
          <p className="mt-3 text-white/80">{patch.notes}</p>
        </div>
      )}

      {patch.changes && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold">Changes</h2>
          <div className="mt-3 whitespace-pre-wrap rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-white/80">
            {patch.changes}
          </div>
        </div>
      )}
    </section>
  );
}
