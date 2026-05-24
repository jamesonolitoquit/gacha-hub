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
      <div className="flex items-center justify-between border-b pb-3 mb-4" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <h1 id="tier-lists-title" className="text-lg font-semibold">Tier Lists</h1>
        <p className="text-xs text-white/40">{tierLists.length} total</p>
      </div>

      {tierLists.length > 0 ? (
        <div className="space-y-6">
          {modeOrder.filter((m) => grouped[m]).map((mode) => (
            <section key={mode} aria-labelledby={`mode-${mode}`}>
              <p id={`mode-${mode}`} className="mb-2 text-size-tiny font-semibold uppercase tracking-[0.2em] text-white/40">{MODE_LABELS[mode] ?? mode}</p>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {grouped[mode].map((tierList) => (
                  <Link
                    key={tierList.id}
                    href={`/games/${params.gameSlug}/tier-lists/${tierList.slug}`}
                    className="rounded-xl border p-3 transition hover:bg-white/[0.03]" style={{ borderColor: 'rgba(255,255,255,0.06)' }}
                  >
                    <p className="text-sm font-semibold text-white">{tierList.title}</p>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <p className="text-xs text-white/50">No tier lists published yet for this game.</p>
      )}
    </section>
  );
}
