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
      <p className="text-sm uppercase tracking-[0.3em] text-sky-300">{game.name}</p>
      <h1 id="guides-title" className="mt-3 text-4xl font-semibold">Guides</h1>
      <p className="mt-3 max-w-2xl text-white/80">Starter paths, builds, and progression tips curated per module.</p>
      <p id="guides-status" role="status" aria-live="polite" className="mt-2 text-sm text-white/75">
        {guides.length} guide{guides.length === 1 ? '' : 's'} available.
      </p>
      <div className="mt-6">
        {guides.length > 0 ? (
          <div className="space-y-8">
            {typeOrder.filter((t) => grouped[t]).map((type) => (
              <section key={type} aria-labelledby={`guide-type-${type}`}>
                <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {grouped[type].map((guide) => (
                    <li key={guide.slug}>
                      <Link
                        href={`/games/${params.gameSlug}/guides/${guide.slug}`}
                        className="block"
                      >
                        <GuideCard
                          guide={guide}
                          guideTypeMeta={guideTypeMap[guide.guideType ?? '']}
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        ) : (
          <p role="status" aria-live="polite" className="text-white/75">No guides available yet for this game.</p>
        )}
      </div>
    </section>
  );
}
