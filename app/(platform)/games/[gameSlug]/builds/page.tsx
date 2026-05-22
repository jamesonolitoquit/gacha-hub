import Link from 'next/link';
import { notFound } from 'next/navigation';
import { moduleRegistry } from '../../../../../core/module-registry';
import { gameService } from '../../../../../server/services/game.service';
import { characterService } from '../../../../../server/services/character.service';
import { buildService } from '../../../../../server/services/build.service';
import BuildCard from '../../../../../features/builds/components/BuildCard';

type Props = {
  params: { gameSlug: string };
};

export async function generateStaticParams() {
  const games = moduleRegistry.list();
  const params: { gameSlug: string }[] = [];

  for (const game of games) {
    const gameRecord = await gameService.getGameBySlug(game.slug);
    if (!gameRecord) continue;

    const builds = await buildService.listBuilds(gameRecord.id);
    if (builds.length > 0) {
      params.push({ gameSlug: game.slug });
    }
  }

  return params;
}

export async function generateMetadata({ params }: Props) {
  const game = moduleRegistry.get(params.gameSlug);
  if (!game) return {};

  return {
    title: `Builds | ${game.name}`,
    description: `Character builds, gear recommendations, and stat priorities for ${game.name}.`,
  };
}

export default async function BuildsIndexPage({ params }: Props) {
  const game = moduleRegistry.get(params.gameSlug);
  if (!game) notFound();

  const gameRecord = await gameService.getGameBySlug(params.gameSlug);
  if (!gameRecord) notFound();

  const builds = await buildService.listBuilds(gameRecord.id);

  const allCharacters = await characterService.listCharacters(gameRecord.id);
  const charBySlug = new Map(allCharacters.map((c: any) => [c.slug, c]));

  const buildsWithNames = builds.map((b) => ({
    ...b,
    characterName: charBySlug.get(b.characterSlug)?.name ?? b.characterSlug,
  }));

  const usageOrder = ['pve', 'pvp', 'other'];
  const grouped: Record<string, typeof buildsWithNames> = {};
  for (const build of buildsWithNames) {
    const key = build.keyUsage?.[0] ?? 'other';
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(build);
  }

  return (
    <section aria-labelledby="builds-title">
      <p className="text-xs uppercase tracking-[0.3em] text-white/40">{game.name}</p>
      <h1 id="builds-title" className="mt-2 text-3xl font-semibold text-white">Builds</h1>
      <p className="mt-2 text-sm text-white/60">Character builds with gear recommendations and stat priorities.</p>
      <p id="builds-status" role="status" aria-live="polite" className="mt-2 text-sm text-white/50">
        {buildsWithNames.length} build{buildsWithNames.length === 1 ? '' : 's'} available.
      </p>

      <div className="mt-6 space-y-8">
        {usageOrder.filter((u) => grouped[u]).map((usage) => (
          <section key={usage} aria-labelledby={`builds-${usage}`}>
            <h2 id={`builds-${usage}`} className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
              {usage === 'pve' ? 'PVE' : usage === 'pvp' ? 'PVP' : 'Other'}
            </h2>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {grouped[usage].map((build) => (
                <Link
                  key={build.characterSlug}
                  href={`/games/${params.gameSlug}/characters/${build.characterSlug}`}
                  className="block"
                >
                  <BuildCard build={build} gameSlug={params.gameSlug} />
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
