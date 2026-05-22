import Link from 'next/link';
import { notFound } from 'next/navigation';
import { moduleRegistry } from '../../../../../core/module-registry';
import { gameService } from '../../../../../server/services/game.service';
import { tierListService } from '../../../../../server/services/tier-list.service';

type TierListsPageProps = {
  params: {
    gameSlug: string;
  };
};

const MODE_LABELS: Record<string, string> = {
  pve: 'PVE',
  pvp: 'PVP',
  gvg: 'GvG',
  general: 'General',
};

export async function generateStaticParams() {
  const games = moduleRegistry.list();
  const params: { gameSlug: string }[] = [];

  for (const game of games) {
    const gameRecord = await gameService.getGameBySlug(game.slug);
    if (!gameRecord) continue;

    const tierLists = await tierListService.listTierLists(gameRecord.id);
    if (tierLists.length > 0) {
      params.push({ gameSlug: game.slug });
    }
  }

  return params;
}

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

  // Group by mode
  const grouped: Record<string, typeof tierLists> = {};
  for (const tl of tierLists) {
    const mode = tl.tierType ?? 'general';
    if (!grouped[mode]) grouped[mode] = [];
    grouped[mode].push(tl);
  }

  const modeOrder = ['pve', 'pvp', 'gvg', 'general'];

  return (
    <section aria-labelledby="tier-lists-title">
      <p className="text-sm uppercase tracking-[0.3em] text-sky-300">{game.name}</p>
      <h1 id="tier-lists-title" className="mt-3 text-4xl font-semibold">Tier Lists</h1>
      <p className="mt-3 max-w-2xl text-white/80">Compare unit performance by role, mode, and meta context.</p>
      <p id="tier-lists-status" role="status" aria-live="polite" className="mt-2 text-sm text-white/75">
        {tierLists.length} tier list{tierLists.length === 1 ? '' : 's'} available.
      </p>
      <div className="mt-6">
        {tierLists.length > 0 ? (
          <div className="space-y-8">
            {modeOrder.filter((m) => grouped[m]).map((mode) => (
              <section key={mode} aria-labelledby={`mode-${mode}`}>
                <h2 id={`mode-${mode}`} className="mb-3 text-xs uppercase tracking-[0.3em] text-white/40">
                  {MODE_LABELS[mode] ?? mode}
                </h2>
                <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {grouped[mode].map((tierList) => (
                    <li key={tierList.id}>
                      <Link
                        href={`/games/${params.gameSlug}/tier-lists/${tierList.slug}`}
                        className="group rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-sky-300/40 hover:bg-white/10 focus-visible:border-sky-300/55 block"
                      >
                        <h3 className="text-xl font-medium group-hover:text-sky-100">{tierList.title}</h3>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        ) : (
          <p role="status" aria-live="polite" className="text-white/75">No tier lists published yet for this game.</p>
        )}
      </div>
    </section>
  );
}
