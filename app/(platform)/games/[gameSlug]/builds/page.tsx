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

  const grouped: Record<string, typeof buildsWithNames> = {};
  for (const build of buildsWithNames) {
    const usage = build.keyUsage ?? [];
    let category = 'other';
    if (usage.includes('pvp')) category = 'pvp';
    else if (usage.includes('raid')) category = 'raid';
    else if (usage.includes('pve')) category = 'pve';
    else category = 'other';
    if (!grouped[category]) grouped[category] = [];
    grouped[category].push(build);
  }

  const categoryLabels: Record<string, string> = {
    pve: 'PvE Builds',
    pvp: 'PvP Builds',
    raid: 'Raid Builds',
    other: 'Other',
  };
  const categoryOrder = ['pve', 'pvp', 'raid', 'other'];

  return (
    <section aria-labelledby="builds-title">
      <div className="flex items-center justify-between border-b pb-3 mb-4" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <h1 id="builds-title" className="text-lg font-semibold">Builds</h1>
        <p className="text-xs text-white/40">{buildsWithNames.length} total</p>
      </div>

      <div className="space-y-6">
        {categoryOrder.filter((c) => grouped[c]).map((category) => (
          <section key={category} aria-labelledby={`builds-${category}`}>
            <div className="flex items-center gap-2 mb-3">
              <span className="h-3 w-0.5 rounded-full" style={{ background: category === 'pve' ? '#33b5e5' : category === 'pvp' ? '#ff4444' : category === 'raid' ? '#aa66cc' : '#888' }} />
              <h2 id={`builds-${category}`} className="text-size-tiny font-semibold uppercase tracking-[0.2em] text-white/50">{categoryLabels[category] ?? category}</h2>
            </div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {grouped[category].map((build) => (
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
