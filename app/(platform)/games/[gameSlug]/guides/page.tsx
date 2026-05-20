import { notFound } from 'next/navigation';
import { moduleRegistry } from '../../../../../core/module-registry';
import { gameService } from '../../../../../server/services/game.service';
import { guideService } from '../../../../../server/services/guide.service';

type GuidesPageProps = {
  params: {
    gameSlug: string;
  };
};

export async function generateMetadata({ params }: GuidesPageProps) {
  const game = moduleRegistry.get(params.gameSlug);

  if (!game) {
    return {};
  }

  return {
    title: `Guides | ${game.name}`,
    description: `Guides and strategy content for ${game.name}.`,
  };
}

export default async function GuidesPage({ params }: GuidesPageProps) {
  const game = moduleRegistry.get(params.gameSlug);

  if (!game) {
    notFound();
  }

  const gameRecord = await gameService.getGameBySlug(params.gameSlug);

  if (!gameRecord) {
    notFound();
  }

  const guides = await guideService.listGuides(gameRecord.id);

  return (
    <section aria-labelledby="guides-title" className="mx-auto max-w-6xl px-6 py-10">
      <p className="text-sm uppercase tracking-[0.3em] text-sky-300">{game.name}</p>
      <h1 id="guides-title" className="mt-3 text-4xl font-semibold">Guides</h1>
      <p className="mt-3 max-w-2xl text-white/80">Starter paths, builds, and progression tips curated per module.</p>
      <p id="guides-status" role="status" aria-live="polite" className="mt-2 text-sm text-white/75">
        {guides.length} guide{guides.length === 1 ? '' : 's'} available.
      </p>
      <div className="mt-6">
        {guides.length > 0 ? (
          <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {guides.map((guide) => (
              <li key={guide.id}>
                <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <h2 className="text-xl font-medium">{guide.title}</h2>
                  <p className="mt-2 text-sm text-white/75 font-medium">{guide.summary}</p>
                </article>
              </li>
            ))}
          </ul>
        ) : (
          <p role="status" aria-live="polite" className="text-white/75">No guides available yet for this game.</p>
        )}
      </div>
    </section>
  );
}
