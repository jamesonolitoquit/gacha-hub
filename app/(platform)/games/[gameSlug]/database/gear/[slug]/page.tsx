import Link from 'next/link';
import { notFound } from 'next/navigation';
import { moduleRegistry } from '../../../../../../../core/module-registry';
import { gameService } from '../../../../../../../server/services/game.service';
import { gearService } from '../../../../../../../server/services/gear.service';
import { buildService } from '../../../../../../../server/services/build.service';

type Props = {
  params: { gameSlug: string; slug: string };
};

export async function generateStaticParams() {
  const games = moduleRegistry.list();
  const params: { gameSlug: string; slug: string }[] = [];

  for (const game of games) {
    const gameRecord = await gameService.getGameBySlug(game.slug);
    if (!gameRecord) continue;

    const gearSets = await gearService.listGearSets(gameRecord.id);
    for (const g of gearSets) {
      params.push({ gameSlug: game.slug, slug: g.slug });
    }
  }

  return params;
}

export async function generateMetadata({ params }: Props) {
  const game = moduleRegistry.get(params.gameSlug);
  if (!game) return {};

  const gameRecord = await gameService.getGameBySlug(params.gameSlug);
  if (!gameRecord) return {};

  const gearSet = await gearService.getGearSetBySlug(gameRecord.id, params.slug);
  if (!gearSet) return {};

  return {
    title: `${gearSet.name} | ${game.name}`,
    description: gearSet.twoPieceEffect ?? `Gear set details for ${gearSet.name}.`,
  };
}

export default async function GearDetailPage({ params }: Props) {
  const game = moduleRegistry.get(params.gameSlug);
  if (!game) notFound();

  const gameRecord = await gameService.getGameBySlug(params.gameSlug);
  if (!gameRecord) notFound();

  const gearSet = await gearService.getGearSetBySlug(gameRecord.id, params.slug);
  if (!gearSet) notFound();

  const builds = await buildService.listBuilds(gameRecord.id);
  const relatedBuilds = builds.filter(
    (b) => b.gearSet1.setName === gearSet.name || b.gearSet2?.setName === gearSet.name
  );
  const primaryColor = game.theme?.colors?.primary ?? '#33b5e5';

  return (
    <section aria-labelledby="gear-detail-title">
      <Link
        href={`/games/${params.gameSlug}/database/gear`}
        className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-white/50 transition hover:text-white"
      >
        &larr; Back to Gear
      </Link>

      <div
        className="relative overflow-hidden rounded-[2rem] border p-6 lg:p-8"
        style={{
          borderColor: 'rgba(255,255,255,0.08)',
          background: `linear-gradient(135deg, ${primaryColor}12 0%, rgba(10,15,24,0.92) 100%)`,
        }}
      >
        <div className="relative z-10">
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">{game.name}</p>
          <h1 id="gear-detail-title" className="mt-2 text-3xl font-semibold text-white">
            {gearSet.name}
          </h1>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {/* Effects */}
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <p className="mb-3 text-[0.6rem] uppercase tracking-[0.2em] text-white/40">Effects</p>
              {gearSet.twoPieceEffect && (
                <div className="mb-3">
                  <p className="text-xs font-semibold text-white/60">2-Piece</p>
                  <p className="mt-1 text-sm text-white/90">{gearSet.twoPieceEffect}</p>
                </div>
              )}
              {gearSet.fourPieceEffect && (
                <div>
                  <p className="text-xs font-semibold text-white/60">4-Piece</p>
                  <p className="mt-1 text-sm text-white/90">{gearSet.fourPieceEffect}</p>
                </div>
              )}
            </div>

            {/* Source & Tags */}
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <p className="mb-3 text-[0.6rem] uppercase tracking-[0.2em] text-white/40">Details</p>
              {gearSet.source && (
                <div className="mb-2 flex justify-between text-xs">
                  <span className="text-white/50">Source</span>
                  <span className="font-medium text-white">{gearSet.source}</span>
                </div>
              )}
              {gearSet.tags && gearSet.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {gearSet.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block rounded-full border px-2 py-0.5 text-size-tiny font-semibold uppercase tracking-[0.15em] text-white/60"
                      style={{ borderColor: 'rgba(255,255,255,0.1)' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {gearSet.description && (
            <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <p className="mb-1 text-[0.6rem] uppercase tracking-[0.2em] text-white/40">Description</p>
              <p className="text-sm text-white/80">{gearSet.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Related builds */}
      {relatedBuilds.length > 0 && (
        <div
          className="mt-6 overflow-hidden rounded-[2rem] border p-6"
          style={{ borderColor: 'rgba(255,255,255,0.08)' }}
        >
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-white/40">Recommended For</p>
          <div className="flex flex-wrap gap-2">
            {relatedBuilds.map((b) => (
              <Link
                key={b.characterSlug}
                href={`/games/${params.gameSlug}/characters/${b.characterSlug}`}
                className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2 text-sm font-medium text-white transition hover:bg-white/[0.06]"
              >
                {b.characterSlug.replace(/-/g, ' ')}
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
