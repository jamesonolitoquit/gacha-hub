import Link from 'next/link';
import { notFound } from 'next/navigation';
import { moduleRegistry } from '../../../../../../core/module-registry';
import { gameService } from '../../../../../../server/services/game.service';
import { teamService as teamServiceImport } from '../../../../../../server/services/team.service';
import { characterService } from '../../../../../../server/services/character.service';
import TeamComposition from '../../../../../../features/teams/components/TeamComposition';

export const revalidate = 3600;

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
    alternates: { canonical: `/games/${params.gameSlug}/teams/${params.slug}` },
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

  const characters = await characterService.getCharactersByIds(gameRecord.id, characterIdArray);
  const characterNames: Record<string, string> = {};
  characters.forEach((c) => {
    characterNames[c.slug] = c.name;
  });

  const primaryColor = game.theme?.colors?.primary ?? '#7c5cff';

  return (
    <section aria-labelledby="team-title">
      <div className="flex items-center gap-2 border-b pb-3 mb-4" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <Link href={`/games/${params.gameSlug}/teams`} className="text-size-tiny uppercase tracking-[0.2em] text-white/40 transition hover:text-white">← Teams</Link>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 id="team-title" className="text-lg font-semibold">{team.name}</h1>
          <span className="rounded px-1.5 py-0.5 text-size-tiny font-semibold uppercase tracking-[0.15em]" style={{ background: `${purposeColor}20`, color: purposeColor }}>{purposeLabel}</span>
          {team.difficulty && (
            <span className="rounded px-1.5 py-0.5 text-size-micro font-semibold uppercase tracking-[0.15em]" style={{ background: `${difficultyColor}20`, color: difficultyColor }}>{difficultyLabel}</span>
          )}
        </div>
        <div className="flex items-center gap-3 text-size-tiny text-white/40">
          {team.synergyScore != null && <span>Synergy {team.synergyScore}%</span>}
          {team.powerLevel != null && <span>Power {team.powerLevel.toLocaleString()}</span>}
          <span>{characterIdArray.length} chars</span>
        </div>
      </div>

      {/* Character Composition */}
      <div
        className="mt-5 overflow-hidden rounded-xl border"
        style={{ borderColor: 'rgba(255,255,255,0.08)' }}
      >
        <TeamComposition
          characters={characters.filter(Boolean) as any[]}
          gearRecommendations={team.gearRecommendations as Record<string, { setName: string; weapon: string; armor: string; accessory: string }> | null}
          gameSlug={params.gameSlug}
        />
      </div>

      {/* Rotation */}
      {(team as any).rotation && (
        <div className="mt-4 rounded-xl border p-4" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <p className="mb-2 text-size-tiny font-semibold uppercase tracking-[0.2em] text-white/40">Rotation</p>
          <p className="text-xs leading-relaxed text-white/70">{(team as any).rotation}</p>
        </div>
      )}

      {/* Required Stats */}
      {(team as any).requiredStats && (team as any).requiredStats.length > 0 && (
        <div className="mt-4 rounded-xl border p-4" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <p className="mb-2 text-size-tiny font-semibold uppercase tracking-[0.2em] text-white/40">Required Stats</p>
          <div className="flex flex-wrap gap-2">
            {(team as any).requiredStats.map((stat: string) => (
              <span key={stat} className="rounded bg-white/5 px-2 py-1 text-size-tiny font-medium text-white/70">{stat}</span>
            ))}
          </div>
        </div>
      )}

      {/* Gear Recommendations detail */}
      {team.gearRecommendations && Object.keys(team.gearRecommendations).length > 0 && (
        <div className="mt-4 rounded-xl border p-4" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <p className="mb-2 text-size-tiny font-semibold uppercase tracking-[0.2em] text-white/40">Gear Overview</p>
          <div className="space-y-2">
            {Object.entries(team.gearRecommendations).map(([slug, gear]: [string, any]) => (
              <div key={slug} className="rounded-lg border p-2.5" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <p className="text-xs font-medium text-white/80">{characterNames[slug] ?? slug}</p>
                <p className="text-size-tiny text-white/50">{gear.setName} · {gear.weapon} · {gear.armor} · {gear.accessory}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Alternatives */}
      {(team as any).alternatives && (team as any).alternatives.length > 0 && (
        <div className="mt-4 rounded-xl border p-4" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <p className="mb-2 text-size-tiny font-semibold uppercase tracking-[0.2em] text-white/40">Alternatives</p>
          <div className="flex flex-wrap gap-2">
            {(team as any).alternatives.map((alt: string) => (
              <Link key={alt} href={`/games/${params.gameSlug}/heroes/${alt}`} className="rounded bg-white/5 px-2 py-1 text-size-tiny font-medium text-white/70 hover:bg-white/10 transition">
                {characterNames[alt] ?? alt}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Weaknesses */}
      {(team as any).weaknesses && (team as any).weaknesses.length > 0 && (
        <div className="mt-4 rounded-xl border p-4" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <p className="mb-2 text-size-tiny font-semibold uppercase tracking-[0.2em] text-white/40">Weaknesses</p>
          <div className="flex flex-wrap gap-2">
            {(team as any).weaknesses.map((w: string) => (
              <span key={w} className="rounded px-2 py-1 text-size-tiny font-medium" style={{ background: '#ff444418', color: '#ff4444' }}>{w}</span>
            ))}
          </div>
        </div>
      )}

      {/* Strategy Notes */}
      {team.notes && (
        <div className="mt-4 rounded-xl border p-4" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <p className="mb-2 text-size-tiny font-semibold uppercase tracking-[0.2em] text-white/40">Strategy Notes</p>
          <p className="text-xs leading-relaxed text-white/70">{team.notes}</p>
        </div>
      )}
    </section>
  );
}
