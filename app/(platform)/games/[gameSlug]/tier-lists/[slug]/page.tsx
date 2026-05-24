import Link from 'next/link';
import { notFound } from 'next/navigation';
import { moduleRegistry } from '../../../../../../core/module-registry';
import { tierListService } from '../../../../../../server/services/tier-list.service';
import { tierEntryService } from '../../../../../../server/services/tier-entry.service';
import { characterService } from '../../../../../../server/services/character.service';
import { petService } from '../../../../../../server/services/pets.service';
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

  const allPets = await petService.listPets(gameRecord.id);
  const petById = new Map(allPets.map((p: any) => [p.id, p]));

  // Group entries by tier
  const grouped: Record<string, { character: any; previousTier?: string | null; notes?: string | null }[]> = {};
  for (const entry of entries) {
    let entity;
    if (entry.characterId) {
      entity = charById.get(entry.characterId);
    } else if (entry.petId) {
      entity = petById.get(entry.petId);
    }
    if (!entity) continue;

    if (!grouped[entry.tier]) grouped[entry.tier] = [];
    grouped[entry.tier].push({ character: entity, previousTier: entry.previousTier, notes: entry.notes });
  }

  const tierConfig = game.taxonomies?.tiers ?? {
    tiers: ['SSS', 'SS', 'S', 'A', 'B', 'C', 'D'],
    colors: { SSS: '#ff4444', SS: '#ffd700', S: '#00c851', A: '#33b5e5', B: '#aa66cc', C: '#ffbb33', D: '#888888' },
    collapsedDefault: ['C', 'D'],
  };

  // Compute movement counts
  const upCount = entries.filter((e: any) => e.previousTier && e.previousTier < e.tier).length;
  const downCount = entries.filter((e: any) => e.previousTier && e.previousTier > e.tier).length;
  const newCount = entries.filter((e: any) => !e.previousTier).length;

  return (
    <section aria-labelledby="tierlist-title">
      <div className="flex items-center gap-2 border-b pb-3 mb-4" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <Link href={`/games/${params.gameSlug}/tier-lists`} className="text-size-tiny uppercase tracking-[0.2em] text-white/40 transition hover:text-white">← Tier Lists</Link>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 id="tierlist-title" className="text-lg font-semibold">{tierList.title}</h1>
          {tierList.tierType && (
            <span className="mt-0.5 inline-block rounded bg-white/5 px-1.5 py-0.5 text-size-tiny font-semibold uppercase tracking-[0.15em] text-white/50">{tierList.tierType}</span>
          )}
        </div>
        <div className="flex items-center gap-3 text-size-tiny text-white/40">
          <span>{entries.length} entries</span>
          {upCount > 0 && <span style={{ color: '#00c851' }}>↑{upCount}</span>}
          {downCount > 0 && <span style={{ color: '#ff4444' }}>↓{downCount}</span>}
          {newCount > 0 && <span style={{ color: '#33b5e5' }}>NEW {newCount}</span>}
        </div>
      </div>

      <div className="mt-4">
        <TierRowView
          grouped={grouped}
          tierConfig={tierConfig}
          gameSlug={params.gameSlug}
        />
      </div>
    </section>
  );
}
