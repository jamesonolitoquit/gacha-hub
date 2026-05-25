import Link from 'next/link';
import { notFound } from 'next/navigation';
import { moduleRegistry } from '../../../../../../core/module-registry';
import { tierListService } from '../../../../../../server/services/tier-list.service';
import { tierEntryService } from '../../../../../../server/services/tier-entry.service';
import { characterService } from '../../../../../../server/services/character.service';
import { guideService } from '../../../../../../server/services/guide.service';
import { patchService } from '../../../../../../server/services/patch.service';
import { gameService } from '../../../../../../server/services/game.service';
import TierRowView from './tier-row-view';
import TierContextBar from './tier-context-bar';
import TierMetaNotes from './tier-meta-notes';
import TierRelatedContent from './tier-related-content';
import TierSeoFooter from './tier-seo-footer';

type Props = {
  params: { gameSlug: string; slug: string };
};

export async function generateStaticParams() {
  const games = moduleRegistry.list();
  const params: { gameSlug: string; slug: string }[] = [];

  for (const game of games) {
    const gameRecord = await gameService.getGameBySlug(game.slug);
    if (!gameRecord) continue;

    const tierLists = await tierListService.listTierLists(gameRecord.id);
    for (const tl of tierLists) {
      params.push({ gameSlug: game.slug, slug: tl.slug });
    }
  }

  return params;
}

export async function generateMetadata({ params }: Props) {
  const game = moduleRegistry.get(params.gameSlug);
  if (!game) return {};

  const gameRecord = await gameService.getGameBySlug(params.gameSlug);
  if (!gameRecord) return {};

  const tierList = await tierListService.getTierList(gameRecord.id, params.slug);
  if (!tierList) return {};

  const now = new Date();
  const month = now.toLocaleString('en-US', { month: 'long' });
  const year = now.getFullYear();

  return {
    title: `${tierList.title} (${month} ${year}) | ${game.name}`,
    description: `Current ${tierList.title} rankings for ${game.name}. See which heroes lead the meta — updated for the latest patch with full tier breakdown and hero analysis.`,
    keywords: [`${game.name} ${tierList.title}`, `${game.slug} tier list`, `${game.slug} meta rankings`],
  };
}

export const revalidate = 3600;

const MODE_LABELS: Record<string, string> = {
  pve: 'PvE',
  pvp: 'PvP',
  gvg: 'GvG',
  general: 'General',
};

export default async function TierListDetailPage({ params }: Props) {
  const game = moduleRegistry.get(params.gameSlug);
  if (!game) notFound();

  const gameRecord = await gameService.getGameBySlug(params.gameSlug);
  if (!gameRecord) notFound();

  const tierList = await tierListService.getTierList(gameRecord.id, params.slug);
  if (!tierList) notFound();

  const [entries, allTierLists, patches, allGuides] = await Promise.all([
    tierEntryService.getEntriesForTierList(tierList.id, gameRecord.id),
    tierListService.listTierLists(gameRecord.id),
    patchService.listPatchesForGame(gameRecord.id),
    guideService.listGuides(gameRecord.id),
  ]);

  const charIds = [...new Set(entries.filter((e: any) => e.characterId).map((e: any) => e.characterId))] as number[];
  const characters = charIds.length > 0
    ? await characterService.getCharactersByIds(gameRecord.id, charIds)
    : [];
  const charById = new Map(characters.map((c: any) => [c.id, c]));

  const latestPatch = patches?.[patches.length - 1] ?? null;

  const tierConfig = game.taxonomies?.tiers ?? {
    tiers: ['SSS', 'SS', 'S', 'A', 'B', 'C', 'D'],
    colors: {
      SSS: '#ff4444', SS: '#ffd700', S: '#00c851',
      A: '#33b5e5', B: '#aa66cc', C: '#ffbb33', D: '#888888',
    },
  };

  const grouped: Record<string, { character: any; previousTier?: string | null; notes?: string | null }[]> = {};
  const allNotes = new Set<string>();
  for (const entry of entries) {
    const entity = entry.characterId ? charById.get(entry.characterId) : null;
    if (!entity) continue;

    if (!grouped[entry.tier]) grouped[entry.tier] = [];
    grouped[entry.tier].push({ character: entity, previousTier: entry.previousTier, notes: entry.notes });
    if (entry.notes) allNotes.add(entry.notes);
  }

  const upCount = entries.filter((e: any) => e.previousTier && e.previousTier < e.tier).length;
  const downCount = entries.filter((e: any) => e.previousTier && e.previousTier > e.tier).length;
  const newCount = entries.filter((e: any) => !e.previousTier).length;

  const modeFiltered = allTierLists.filter((tl: any) => tl.id !== tierList.id);
  const modeByType: Record<string, typeof allTierLists[0]> = {};
  for (const tl of modeFiltered) {
    const key = tl.tierType ?? 'general';
    if (!modeByType[key]) modeByType[key] = tl;
  }
  const modeOrder = ['pve', 'pvp', 'gvg', 'general'];
  const navModes = modeOrder.filter((m) => modeByType[m]).map((m) => ({ label: MODE_LABELS[m] ?? m, slug: modeByType[m].slug }));

  const charSlugs = new Set(characters.map((c: any) => c.slug));
  const relatedGuides = allGuides
    .filter((g: any) => g.characterId && charIds.includes(g.characterId))
    .slice(0, 4);

  const sectionGap = 'mt-5 lg:mt-6';

  return (
    <section aria-labelledby="tierlist-title">
      {/* Breadcrumb */}
      <Link
        href={`/games/${params.gameSlug}/tier-lists`}
        className="inline-flex text-size-tiny uppercase tracking-[0.2em] text-white/40 transition hover:text-white"
      >
        ← Tier Lists
      </Link>

      {/* Title + Meta */}
      <div className="mt-2 flex items-start justify-between gap-4">
        <div>
          <h1 id="tierlist-title" className="text-xl font-bold tracking-tight lg:text-2xl" style={{ color: 'var(--foreground)' }}>
            {tierList.title}
          </h1>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-size-tiny text-white/40">
            {tierList.tierType && (
              <span className="rounded bg-white/5 px-1.5 py-0.5 font-semibold uppercase tracking-[0.15em] text-white/50">
                {MODE_LABELS[tierList.tierType] ?? tierList.tierType}
              </span>
            )}
            <span>{entries.length} heroes</span>
            {upCount > 0 && <span style={{ color: '#00c851' }}>↑{upCount}</span>}
            {downCount > 0 && <span style={{ color: '#ff4444' }}>↓{downCount}</span>}
            {newCount > 0 && <span style={{ color: '#33b5e5' }}>NEW {newCount}</span>}
          </div>
        </div>
      </div>

      {/* Patch Context Bar */}
      <div className={sectionGap}>
        <TierContextBar patch={latestPatch} updatedAt={tierList.updatedAt} />
      </div>

      {/* Sticky Mode Nav */}
      {navModes.length > 0 && (
        <div className="sticky top-0 z-10 -mx-6 px-6 py-2 backdrop-blur-xl" style={{ background: 'color-mix(in srgb, var(--surface, #120f1f) 85%, transparent)' }}>
          <div className="flex gap-1 overflow-x-auto scrollbar-none">
            {navModes.map((mode) => (
              <Link
                key={mode.slug}
                href={`/games/${params.gameSlug}/tier-lists/${mode.slug}`}
                className="shrink-0 rounded-lg px-3 py-1.5 text-size-tiny font-medium transition whitespace-nowrap"
                style={{
                  color: 'var(--muted)',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--border-color)',
                }}
              >
                {mode.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Tier Rows — only tiers with entries render */}
      <div className={sectionGap}>
        <TierRowView grouped={grouped} tierConfig={tierConfig} gameSlug={params.gameSlug} />
      </div>

      {/* Meta Notes */}
      {allNotes.size > 0 && (
        <div className={sectionGap}>
          <TierMetaNotes notes={[...allNotes]} />
        </div>
      )}

      {/* Related Content */}
      <div className={sectionGap}>
        <TierRelatedContent
          characters={characters.map((c: any) => ({ slug: c.slug, name: c.name }))}
          guides={relatedGuides.map((g: any) => ({ slug: g.slug, title: g.title, summary: g.summary }))}
          gameSlug={params.gameSlug}
        />
      </div>

      {/* SEO Footer */}
      <div className={sectionGap}>
        <TierSeoFooter game={game} title={tierList.title} />
      </div>
    </section>
  );
}
