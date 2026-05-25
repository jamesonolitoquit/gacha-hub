import { notFound } from 'next/navigation';
import { moduleRegistry } from '../../../../../core/module-registry';
import { gameService } from '../../../../../server/services/game.service';
import { teamService as teamServiceImport } from '../../../../../server/services/team.service';
import TeamIndex from '../../../../../features/teams/components/TeamIndex';

type Props = {
  params: { gameSlug: string };
};

export async function generateStaticParams() {
  const games = moduleRegistry.list();
  const params: { gameSlug: string }[] = [];

  for (const game of games) {
    const gameRecord = await gameService.getGameBySlug(game.slug);
    if (!gameRecord) continue;

    const teams = await teamServiceImport.listTeams(gameRecord.id);
    if (teams.length > 0) {
      params.push({ gameSlug: game.slug });
    }
  }

  return params;
}

export async function generateMetadata({ params }: Props) {
  const game = moduleRegistry.get(params.gameSlug);
  if (!game) return {};

  return {
    title: `Teams | ${game.name}`,
    description: `Team compositions and strategies for ${game.name}.`,
    alternates: { canonical: `/games/${params.gameSlug}/teams` },
  };
}

export default async function TeamsIndexPage({ params }: Props) {
  const game = moduleRegistry.get(params.gameSlug);
  if (!game) notFound();

  const gameRecord = await gameService.getGameBySlug(params.gameSlug);
  if (!gameRecord) notFound();

  const rawTeams = await teamServiceImport.listTeams(gameRecord.id);
  const teams = rawTeams.filter((t): t is typeof t & { slug: string } => t.slug != null);

  return (
    <section aria-labelledby="teams-title">
      <div className="flex items-center justify-between border-b pb-3 mb-4" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <h1 id="teams-title" className="text-lg font-semibold">Teams</h1>
        <p className="text-xs text-white/40">{teams.length} total</p>
      </div>

      <TeamIndex teams={teams} gameSlug={params.gameSlug} />
    </section>
  );
}
