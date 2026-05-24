import Link from 'next/link';
import { notFound } from 'next/navigation';
import { moduleRegistry } from '../../../../../core/module-registry';
import { gameService } from '../../../../../server/services/game.service';
import { guideService } from '../../../../../server/services/guide.service';
import GuideCard from '../../../../../features/guides/components/GuideCard';

type GuidesPageProps = {
  params: {
    gameSlug: string;
  };
};

export async function generateStaticParams() {
  const games = moduleRegistry.list();
  const params: { gameSlug: string }[] = [];

  for (const game of games) {
    const gameRecord = await gameService.getGameBySlug(game.slug);
    if (!gameRecord) continue;

    const guides = await guideService.listGuides(gameRecord.id);
    if (guides.length > 0) {
      params.push({ gameSlug: game.slug });
    }
  }

  return params;
}

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

  const guideTypeMap = game.taxonomies?.guideTypes
    ? Object.fromEntries(game.taxonomies.guideTypes.map((gt) => [gt.slug, gt]))
    : {};

  const grouped: Record<string, typeof guides> = {};
  for (const guide of guides) {
    const type = guide.guideType ?? 'other';
    if (!grouped[type]) grouped[type] = [];
    grouped[type].push(guide);
  }

  const typeOrder = ['progression', 'farming', 'boss', 'team-comp', 'build', 'other'];

  return (
    <section aria-labelledby="guides-title">
      <div className="flex items-center justify-between border-b pb-3 mb-4" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <h1 id="guides-title" className="text-lg font-semibold">Guides</h1>
        <p className="text-xs text-white/40">{guides.length} total</p>
      </div>

      {guides.length > 0 ? (
        <div className="space-y-6">
          {typeOrder.filter((t) => grouped[t]).map((type) => (
            <section key={type} aria-labelledby={`guide-type-${type}`}>
               {typeOrder.filter((t) => grouped[t]).length > 1 && (
                 <p id={`guide-type-${type}`} className="mb-2 text-size-tiny font-semibold uppercase tracking-[0.2em] text-white/40">{type}</p>
               )}
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {grouped[type].map((guide) => (
                  <Link key={guide.slug} href={`/games/${params.gameSlug}/guides/${guide.slug}`} className="block">
                    <GuideCard guide={guide} guideTypeMeta={guideTypeMap[guide.guideType ?? '']} />
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <p role="status" aria-live="polite" className="text-white/50 text-xs">No guides available yet for this game.</p>
      )}
    </section>
  );
}
