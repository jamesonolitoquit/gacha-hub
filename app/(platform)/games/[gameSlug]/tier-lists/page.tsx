import { notFound } from 'next/navigation';
import { moduleRegistry } from '../../../../../core/module-registry';
import { gameService } from '../../../../../server/services/game.service';
import { tierListService } from '../../../../../server/services/tier-list.service';

type TierListsPageProps = {
  params: {
    gameSlug: string;
  };
};

export async function generateMetadata({ params }: TierListsPageProps) {
  const game = moduleRegistry.get(params.gameSlug);

  if (!game) {
    return {};
  }

  return {
    title: `Tier Lists | ${game.name}`,
    description: `Role-based and meta tier lists for ${game.name}.`,
  };
}

export default async function TierListsPage({ params }: TierListsPageProps) {
  const game = moduleRegistry.get(params.gameSlug);

  if (!game) {
    notFound();
  }

  const gameRecord = await gameService.getGameBySlug(params.gameSlug);

  if (!gameRecord) {
    notFound();
  }

  const tierLists = await tierListService.listTierLists(gameRecord.id);

  return (
    <section aria-labelledby="tier-lists-title" className="mx-auto max-w-6xl px-6 py-10">
      <p className="text-sm uppercase tracking-[0.3em] text-sky-300">{game.name}</p>
      <h1 id="tier-lists-title" className="mt-3 text-4xl font-semibold">Tier Lists</h1>
      <p className="mt-3 max-w-2xl text-white/80">Compare unit performance by role, mode, and meta context.</p>
      <p id="tier-lists-status" role="status" aria-live="polite" className="mt-2 text-sm text-white/75">
        {tierLists.length} tier list{tierLists.length === 1 ? '' : 's'} available.
      </p>
      <div className="mt-6">
        {tierLists.length > 0 ? (
          <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {tierLists.map((tierList) => (
              <li key={tierList.id}>
                <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <h2 className="text-xl font-medium">{tierList.title}</h2>
                  <p className="mt-2 text-sm text-white/75 font-medium">{tierList.tierType}</p>
                </article>
              </li>
            ))}
          </ul>
        ) : (
          <p role="status" aria-live="polite" className="text-white/75">No tier lists published yet for this game.</p>
        )}
      </div>
    </section>
  );
}
