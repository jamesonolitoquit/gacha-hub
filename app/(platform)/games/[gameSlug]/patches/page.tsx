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
      <div className="flex items-center justify-between border-b pb-3 mb-4" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <h1 id="patches-title" className="text-lg font-semibold">Patch Notes</h1>
        <p className="text-xs text-white/40">{patches.length} total</p>
      </div>

      {patches.length > 0 ? (
        <div className="space-y-2">
          {patches.map((patch) => (
            <Link
              key={patch.id}
              href={`/games/${game.slug}/patches/${patch.version}`}
              className="flex items-center gap-3 rounded-xl border p-3 transition hover:bg-white/[0.03]" style={{ borderColor: 'rgba(255,255,255,0.06)' }}
            >
              <span className="shrink-0 rounded bg-sky-400/15 px-1.5 py-0.5 text-size-micro font-semibold uppercase tracking-[0.15em] text-sky-400">{patch.version}</span>
              <span className="min-w-0 flex-1 text-sm font-medium text-white/80 truncate">{patch.title || `Version ${patch.version}`}</span>
              <time dateTime={new Date(patch.releaseDate).toISOString()} className="shrink-0 text-size-tiny text-white/40">
                {new Date(patch.releaseDate).toLocaleDateString()}
              </time>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-xs text-white/50">No patches available yet.</p>
      )}
    </section>
  );
}
