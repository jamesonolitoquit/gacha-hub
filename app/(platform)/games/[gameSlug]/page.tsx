import { notFound } from 'next/navigation';
import { moduleRegistry } from '../../../../core/module-registry';
import { characterService } from '../../../../server/services/character.service';
import { guideService } from '../../../../server/services/guide.service';
import { gameService } from '../../../../server/services/game.service';
import { tierEntryService } from '../../../../server/services/tier-entry.service';
import { patchService } from '../../../../server/services/patch.service';
import { overviewService } from '../../../../server/services/overview.service';
import GameIdentityHero from './_overview/game-identity-hero';
import MetaStrip from './_overview/meta-strip';
import ActionGrid from './_overview/action-grid';
import LiveMetaSection from './_overview/live-meta-section';
import FeaturedGuides from './_overview/featured-guides';
import RecentUpdates from './_overview/recent-updates';
import FeaturedHeroes from './_overview/featured-heroes';
import DatabaseShortcuts from './_overview/database-shortcuts';
import SeoFooter from './_overview/seo-footer';

type GamePageProps = { params: { gameSlug: string } };

export async function generateMetadata({ params }: GamePageProps) {
  const game = moduleRegistry.get(params.gameSlug);
  if (!game) return {};
  return {
    title: game.seo?.title ?? `${game.name} — Tier Lists, Builds & Guides`,
    description: game.seo?.description ?? `Tactical database for ${game.name} — tier lists, builds, characters, and guides.`,
    keywords: game.seo?.keywords?.join(', ') ?? '',
    alternates: { canonical: `/games/${params.gameSlug}` },
  };
}

export const revalidate = 3600;

export async function generateStaticParams() {
  return moduleRegistry.list().map((game) => ({ gameSlug: game.slug }));
}

export default async function GameLandingPage({ params }: GamePageProps) {
  const game = moduleRegistry.get(params.gameSlug);
  if (!game) notFound();

  const gameRecord = await gameService.getGameBySlug(params.gameSlug);
  if (!gameRecord) notFound();

  const [stats, characters, guides, patches, allEntries] = await Promise.all([
    overviewService.getStats(gameRecord.id),
    characterService.listCharacters(gameRecord.id),
    guideService.listGuides(gameRecord.id),
    patchService.listPatchesForGame(gameRecord.id),
    tierEntryService.getEntriesForGame(gameRecord.id),
  ]);

  const latestPatch = patches?.[patches.length - 1] ?? null;
  const recentGuides = guides?.slice(0, 4) ?? [];
  const recentPatches = patches?.slice(-4).reverse() ?? [];

  const charMap: Record<number, any> = {};
  const tierMap: Record<number, string> = {};
  for (const c of characters) {
    charMap[c.id] = c;
  }
  for (const e of allEntries) {
    const cid = e.characterId as number | undefined;
    if (cid == null) continue;
    if (!tierMap[cid] || e.tier.localeCompare(tierMap[cid]) < 0) {
      tierMap[cid] = e.tier;
    }
  }

  const topPveEntries = allEntries
    .filter((e: any) => e.mode === 'pve' && e.characterId != null)
    .sort((a: any, b: any) => b.tier.localeCompare(a.tier))
    .slice(0, 6)
    .map((e: any) => {
      const c = charMap[e.characterId];
      return {
        characterId: e.characterId,
        characterSlug: c?.slug ?? '',
        characterName: c?.name ?? `#${e.characterId}`,
        tier: e.tier,
        class: c?.class ?? null,
        portraitUrl: c?.portraitUrl ?? null,
      };
    });

  const topPvpEntries = allEntries
    .filter((e: any) => e.mode === 'pvp' && e.characterId != null)
    .sort((a: any, b: any) => b.tier.localeCompare(a.tier))
    .slice(0, 6)
    .map((e: any) => {
      const c = charMap[e.characterId];
      return {
        characterId: e.characterId,
        characterSlug: c?.slug ?? '',
        characterName: c?.name ?? `#${e.characterId}`,
        tier: e.tier,
        class: c?.class ?? null,
        portraitUrl: c?.portraitUrl ?? null,
      };
    });

  const featuredHeroes = allEntries
    .filter((e: any) => ['SSS', 'SS'].includes(e.tier) && e.characterId != null)
    .sort((a: any, b: any) => a.tier.localeCompare(b.tier))
    .reduce((acc: any[], e: any) => {
      if (acc.some((h: any) => h.id === e.characterId)) return acc;
      const c = charMap[e.characterId];
      if (!c) return acc;
      acc.push({
        id: c.id,
        slug: c.slug,
        name: c.name,
        class: c.class ?? null,
        tier: e.tier,
        rarity: c.rarity ?? null,
        portraitUrl: c.portraitUrl ?? null,
      });
      return acc;
    }, [])
    .slice(0, 12);

  const sectionGap = 'mt-6 lg:mt-7';

  return (
    <div>
      {/* 1. Game Identity Hero */}
      <GameIdentityHero game={game} />

      {/* 2. Meta Snapshot Strip */}
      <div className={sectionGap}>
        <MetaStrip stats={stats} gameSlug={game.slug} />
      </div>

      {/* 3. Primary Action Grid */}
      <div className={sectionGap}>
        <ActionGrid stats={stats} game={game} />
      </div>

      {/* 4. Live Meta Section */}
      <div className={sectionGap}>
        <LiveMetaSection pveEntries={topPveEntries} pvpEntries={topPvpEntries} gameSlug={game.slug} />
      </div>

      {/* 5. Featured Guides */}
      <div className={sectionGap}>
        <FeaturedGuides guides={recentGuides} gameSlug={game.slug} />
      </div>

      {/* 6. Recent Updates */}
      <div className={sectionGap}>
        <RecentUpdates patches={recentPatches} gameSlug={game.slug} />
      </div>

      {/* 7. Featured Heroes */}
      <div className={sectionGap}>
        <FeaturedHeroes heroes={featuredHeroes} gameSlug={game.slug} />
      </div>

      {/* 8. Database Shortcuts */}
      <div className={sectionGap}>
        <DatabaseShortcuts gameSlug={game.slug} />
      </div>

      {/* 9. SEO Footer */}
      <div className={sectionGap}>
        <SeoFooter game={game} />
      </div>
    </div>
  );
}
