import Link from 'next/link';
import { notFound } from 'next/navigation';
import { moduleRegistry } from '../../../../../core/module-registry';
import { gameService } from '../../../../../server/services/game.service';
import { patchService } from '../../../../../server/services/patch.service';

type PatchesPageProps = {
  params: {
    gameSlug: string;
  };
};

export async function generateMetadata({ params }: PatchesPageProps) {
  const game = moduleRegistry.get(params.gameSlug);

  if (!game) {
    return {};
  }

  return {
    title: `Patches | ${game.name}`,
    description: `Patch notes and updates for ${game.name}.`,
  };
}

export default async function PatchesPage({ params }: PatchesPageProps) {
  const game = moduleRegistry.get(params.gameSlug);

  if (!game) {
    notFound();
  }

  const gameRecord = await gameService.getGameBySlug(params.gameSlug);

  if (!gameRecord) {
    notFound();
  }

  const patches = await patchService.listPatchesForGame(gameRecord.id);

  return (
    <section aria-labelledby="patches-title">
      <p className="text-sm uppercase tracking-[0.3em] text-sky-300">{game.name}</p>
      <h1 id="patches-title" className="mt-3 text-4xl font-semibold">Patch Notes</h1>
      <p className="mt-3 max-w-2xl text-white/80">
        Stay updated with the latest changes, improvements, and balance updates.
      </p>
      <p id="patches-status" role="status" aria-live="polite" className="mt-2 text-sm text-white/75">
        {patches.length} patch{patches.length === 1 ? '' : 'es'} available.
      </p>

      <div className="mt-10">
        {patches.length > 0 ? (
          <ul className="space-y-4">
            {patches.map((patch) => (
              <li key={patch.id}>
                <Link
                  href={`/games/${game.slug}/patches/${patch.version}`}
                  className="block rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-sky-300/40 hover:bg-white/10 focus-visible:border-sky-300/55 focus-visible:bg-white/15"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.25em] text-sky-300">Version {patch.version}</p>
                      <h3 className="mt-2 text-xl font-medium">{patch.title || `Version ${patch.version}`}</h3>
                      {patch.notes && <p className="mt-1 text-sm text-white/75 font-medium">{patch.notes}</p>}
                    </div>
                    <time dateTime={new Date(patch.releaseDate).toISOString()} className="text-xs text-white/65 whitespace-nowrap">
                      {new Date(patch.releaseDate).toLocaleDateString()}
                    </time>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p role="status" aria-live="polite" className="text-white/75">No patches available yet.</p>
        )}
      </div>
    </section>
  );
}
