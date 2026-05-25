import Link from 'next/link';
import { notFound } from 'next/navigation';
import { moduleRegistry } from '../../../../../core/module-registry';
import { gameService } from '../../../../../server/services/game.service';
import { tierListService } from '../../../../../server/services/tier-list.service';
import { patchService } from '../../../../../server/services/patch.service';

type TierListsPageProps = {
  params: { gameSlug: string };
};

const MODE_LABELS: Record<string, string> = {
  pve: 'PvE',
  pvp: 'PvP',
  gvg: 'GvG',
  general: 'General',
};

const MODE_DESCRIPTIONS: Record<string, string> = {
  pve: 'Story, tower, and PvE content rankings',
  pvp: 'Arena and competitive meta rankings',
  gvg: 'Guild War and guild content rankings',
  general: 'All-purpose hero rankings',
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
  if (!game) return {};
  return {
    title: game.seo?.title ?? `Tier Lists | ${game.name}`,
    description: game.seo?.description ?? `Role-based and meta tier lists for ${game.name}.`,
    alternates: { canonical: `/games/${params.gameSlug}/tier-lists` },
  };
}

export const revalidate = 3600;

export default async function TierListsPage({ params }: TierListsPageProps) {
  const game = moduleRegistry.get(params.gameSlug);
  if (!game) notFound();

  const gameRecord = await gameService.getGameBySlug(params.gameSlug);
  if (!gameRecord) notFound();

  const [tierLists, patches] = await Promise.all([
    tierListService.listTierLists(gameRecord.id),
    patchService.listPatchesForGame(gameRecord.id),
  ]);

  const latestPatch = patches?.[patches.length - 1] ?? null;

  const grouped: Record<string, typeof tierLists> = {};
  for (const tl of tierLists) {
    const mode = tl.tierType ?? 'general';
    if (!grouped[mode]) grouped[mode] = [];
    grouped[mode].push(tl);
  }

  const modeOrder = ['pve', 'pvp', 'gvg', 'general'];

  return (
    <section aria-labelledby="tier-lists-title">
      <div className="flex items-center justify-between gap-4 border-b pb-3" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <h1 id="tier-lists-title" className="text-lg font-semibold">Tier Lists</h1>
        <div className="flex items-center gap-3 text-size-tiny text-white/40">
          {latestPatch && <span>Patch: {latestPatch.version ?? latestPatch.displayName ?? ''}</span>}
          <span>{tierLists.length} total</span>
        </div>
      </div>

      {tierLists.length > 0 ? (
        <div className="mt-5 space-y-6">
          {modeOrder.filter((m) => grouped[m]).map((mode) => (
            <section key={mode} aria-labelledby={`mode-${mode}`}>
              <div className="mb-2.5">
                <p id={`mode-${mode}`} className="text-size-tiny font-semibold uppercase tracking-[0.2em] text-white/40">
                  {MODE_LABELS[mode] ?? mode}
                </p>
                <p className="mt-0.5 text-size-small text-white/35">{MODE_DESCRIPTIONS[mode] ?? ''}</p>
              </div>

              <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                {grouped[mode].map((tierList) => (
                  <Link
                    key={tierList.id}
                    href={`/games/${params.gameSlug}/tier-lists/${tierList.slug}`}
                    className="group rounded-xl border p-3 transition hover:-translate-y-0.5"
                    style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}
                  >
                    <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                      {tierList.title}
                    </p>
                    <p className="mt-1 text-size-tiny text-white/40">
                      View current rankings →
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <p className="mt-8 text-center text-size-small text-white/50">No tier lists published yet for this game.</p>
      )}
    </section>
  );
}
