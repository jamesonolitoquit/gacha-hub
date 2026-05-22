import Link from 'next/link';
import { notFound } from 'next/navigation';
import { moduleRegistry } from '../../../../../../core/module-registry';
import { gameService } from '../../../../../../server/services/game.service';
import { teamService as teamServiceImport } from '../../../../../../server/services/team.service';
import { characterService } from '../../../../../../server/services/character.service';
import TeamComposition from '../../../../../../features/teams/components/TeamComposition';

type Props = {
  params: { gameSlug: string; slug: string };
};

export async function generateStaticParams() {
  const games = moduleRegistry.list();
  const params: { gameSlug: string; slug: string }[] = [];

  for (const game of games) {
    const gameRecord = await gameService.getGameBySlug(game.slug);
    if (!gameRecord) continue;

    const teams = await teamServiceImport.listTeams(gameRecord.id);
    for (const team of teams) {
      if (team.slug) {
        params.push({ gameSlug: game.slug, slug: team.slug });
      }
    }
  }

  return params;
}

export async function generateMetadata({ params }: Props) {
  const game = moduleRegistry.get(params.gameSlug);
  if (!game) return {};

  const gameRecord = await gameService.getGameBySlug(params.gameSlug);
  if (!gameRecord) return {};

  const team = await teamServiceImport.getTeam(gameRecord.id, params.slug);
  if (!team) return {};

  return {
    title: `${team.name} | ${game.name}`,
    description: `Team composition for ${team.name}.`,
  };
}

const PURPOSE_LABELS: Record<string, string> = {
  raid: 'Raid',
  pvp: 'PVP',
  gvg: 'Guild War',
  pve: 'PVE',
};

const PURPOSE_COLORS: Record<string, string> = {
  raid: '#ff4444',
  pvp: '#ffbb33',
  gvg: '#aa66cc',
  pve: '#33b5e5',
};

const DIFFICULTY_LABELS: Record<string, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: '#00c851',
  medium: '#ffbb33',
  hard: '#ff4444',
};

export default async function TeamDetailPage({ params }: Props) {
  const game = moduleRegistry.get(params.gameSlug);
  if (!game) notFound();

  const gameRecord = await gameService.getGameBySlug(params.gameSlug);
  if (!gameRecord) notFound();

  const team = await teamServiceImport.getTeam(gameRecord.id, params.slug);
  if (!team) notFound();

  const purposeColor = PURPOSE_COLORS[team.purpose ?? ''] ?? '#888888';
  const purposeLabel = PURPOSE_LABELS[team.purpose ?? ''] ?? (team.purpose ?? 'General');
  const difficultyLabel = DIFFICULTY_LABELS[team.difficulty ?? ''] ?? '';
  const difficultyColor = DIFFICULTY_COLORS[team.difficulty ?? ''] ?? '#888888';

  const characterIdArray = team.characterIds
    ? team.characterIds.split(',').map(Number).filter(Boolean)
    : [];

  const characters = await Promise.all(
    characterIdArray.map((id) => characterService.getCharacterById(gameRecord.id, id))
  );

  const characterSlugs = characters.filter(Boolean).map((c) => c!.slug);
  const characterNames: Record<string, string> = {};
  for (const c of characters) {
    if (c) characterNames[c.slug] = c.name;
  }

  const primaryColor = game.theme?.colors?.primary ?? '#7c5cff';

  return (
    <section aria-labelledby="team-title">
      <Link
        href={`/games/${params.gameSlug}/teams`}
        className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-white/50 transition hover:text-white"
      >
        &larr; Back to Teams
      </Link>

      <div
        className="relative overflow-hidden rounded-[2rem] border p-6 lg:p-8"
        style={{
          borderColor: 'rgba(255,255,255,0.08)',
          background: `linear-gradient(135deg, ${purposeColor}12 0%, rgba(10,15,24,0.92) 100%)`,
        }}
      >
        <div className="relative z-10">
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">{game.name}</p>

          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h1 id="team-title" className="text-3xl font-semibold text-white">{team.name}</h1>
            <span
              className="inline-block rounded-full px-2.5 py-0.5 text-[0.55rem] font-semibold uppercase tracking-[0.15em]"
              style={{ background: `${purposeColor}20`, color: purposeColor, border: `1px solid ${purposeColor}40` }}
            >
              {purposeLabel}
            </span>
            {team.difficulty && (
              <span
                className="inline-block rounded-full px-2 py-0.5 text-[0.5rem] font-semibold uppercase tracking-[0.15em]"
                style={{ background: `${difficultyColor}20`, color: difficultyColor, border: `1px solid ${difficultyColor}40` }}
              >
                {difficultyLabel}
              </span>
            )}
          </div>

          {/* Stats row */}
          <div className="mt-4 flex flex-wrap gap-6">
            {team.synergyScore != null && (
              <div>
                <p className="text-[0.6rem] uppercase tracking-[0.2em] text-white/40">Synergy</p>
                <p className="mt-1 text-xl font-bold text-white">{team.synergyScore}%</p>
              </div>
            )}
            {team.powerLevel != null && (
              <div>
                <p className="text-[0.6rem] uppercase tracking-[0.2em] text-white/40">Power</p>
                <p className="mt-1 text-xl font-bold text-white">{team.powerLevel.toLocaleString()}</p>
              </div>
            )}
            <div>
              <p className="text-[0.6rem] uppercase tracking-[0.2em] text-white/40">Characters</p>
              <p className="mt-1 text-xl font-bold text-white">{characterIdArray.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Character Composition */}
      <div
        className="mt-6 overflow-hidden rounded-[2rem] border p-6 lg:p-8"
        style={{ borderColor: 'rgba(255,255,255,0.08)' }}
      >
        <TeamComposition
          characterSlugs={characterSlugs}
          characterNames={characterNames}
          gearRecommendations={team.gearRecommendations as Record<string, { setName: string; weapon: string; armor: string; accessory: string }> | null}
          gameSlug={params.gameSlug}
        />
      </div>

      {/* Notes */}
      {team.notes && (
        <div
          className="mt-6 overflow-hidden rounded-[2rem] border p-6 lg:p-8"
          style={{ borderColor: 'rgba(255,255,255,0.08)' }}
        >
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-white/40">Strategy Notes</p>
          <p className="text-sm leading-relaxed text-white/80">{team.notes}</p>
        </div>
      )}
    </section>
  );
}
