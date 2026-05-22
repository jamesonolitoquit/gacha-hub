import Link from 'next/link';
import { notFound } from 'next/navigation';
import { moduleRegistry } from '../../../../../../core/module-registry';
import { tierListService } from '../../../../../../server/services/tier-list.service';
import { tierEntryService } from '../../../../../../server/services/tier-entry.service';
import { characterService } from '../../../../../../server/services/character.service';
import { gameService } from '../../../../../../server/services/game.service';
import TierRowView from './tier-row-view';

type Props = {
  params: {
    gameSlug: string;
    slug: string;
  };
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

  return {
    title: `${tierList.title} | ${game.name}`,
    description: `Tier list for ${game.name}: ${tierList.title}.`,
  };
}

export default async function TierListDetailPage({ params }: Props) {
  const game = moduleRegistry.get(params.gameSlug);
  if (!game) notFound();

  const gameRecord = await gameService.getGameBySlug(params.gameSlug);
  if (!gameRecord) notFound();

  const tierList = await tierListService.getTierList(gameRecord.id, params.slug);
  if (!tierList) notFound();

  const entries = await tierEntryService.getEntriesForTierList(tierList.id, gameRecord.id);

  const allCharacters = await characterService.listCharacters(gameRecord.id);
  const charById = new Map(allCharacters.map((c: any) => [c.id, c]));

  // Group entries by tier
  const grouped: Record<string, { character: any; previousTier?: string | null }[]> = {};
  for (const entry of entries) {
    const character = charById.get(entry.characterId);
    if (!character) continue;

    if (!grouped[entry.tier]) grouped[entry.tier] = [];
    grouped[entry.tier].push({ character, previousTier: entry.previousTier });
  }

  const tierConfig = game.taxonomies?.tiers ?? {
    tiers: ['SSS', 'SS', 'S', 'A', 'B', 'C', 'D'],
    colors: { SSS: '#ff4444', SS: '#ffd700', S: '#00c851', A: '#33b5e5', B: '#aa66cc', C: '#ffbb33', D: '#888888' },
    collapsedDefault: ['C', 'D'],
  };

  return (
    <section aria-labelledby="tierlist-title">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href={`/games/${params.gameSlug}/tier-lists`}
          className="text-xs uppercase tracking-[0.2em] text-white/40 transition hover:text-white"
        >
          ← Tier Lists
        </Link>
        <span className="text-white/20">/</span>
        <p className="text-xs uppercase tracking-[0.3em] text-white/40">{game.name}</p>
      </div>

      <h1 id="tierlist-title" className="text-3xl font-semibold text-white">{tierList.title}</h1>
      {tierList.tierType && (
        <p className="mt-1 text-sm text-white/50">Mode: {tierList.tierType}</p>
      )}

      <TierRowView
        grouped={grouped}
        tierConfig={tierConfig}
        gameSlug={params.gameSlug}
      />
    </section>
  );
}
