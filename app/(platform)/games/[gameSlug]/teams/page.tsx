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
      <p className="text-xs uppercase tracking-[0.3em] text-white/40">{game.name}</p>
      <h1 id="teams-title" className="mt-2 text-3xl font-semibold text-white">Teams</h1>
      <p className="mt-2 text-sm text-white/60">Team compositions and strategies.</p>
      <p id="teams-status" role="status" aria-live="polite" className="mt-2 text-sm text-white/50">
        {teams.length} team{teams.length === 1 ? '' : 's'} available.
      </p>

      <div className="mt-6">
        <TeamIndex teams={teams} gameSlug={params.gameSlug} />
      </div>
    </section>
  );
}
