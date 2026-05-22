import Link from 'next/link';

type TeamSummary = {
  slug: string;
  name: string;
  purpose: string | null;
  difficulty: string | null;
  synergyScore: number | null;
  powerLevel: number | null;
  characterIds: string;
};

type Props = {
  teams: TeamSummary[];
  gameSlug: string;
};

const PURPOSE_ORDER = ['raid', 'pvp', 'gvg', 'pve', 'adventure', 'dungeon'];

const PURPOSE_LABELS: Record<string, string> = {
  raid: 'Raid Teams',
  pvp: 'PVP Arena',
  gvg: 'Guild War',
  pve: 'PVE Content',
  adventure: 'Adventure',
  dungeon: 'Dungeon',
};

function getCharacterCount(characterIds: string): number {
  if (!characterIds) return 0;
  return characterIds.split(',').filter(Boolean).length;
}

export default function TeamIndex({ teams, gameSlug }: Props) {
  const grouped = new Map<string, TeamSummary[]>();

  for (const team of teams) {
    const key = team.purpose ?? 'general';
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(team);
  }

  const sortedKeys = [...grouped.keys()].sort(
    (a, b) => PURPOSE_ORDER.indexOf(a) - PURPOSE_ORDER.indexOf(b)
  );

  return (
    <div className="space-y-8">
      {sortedKeys.map((purpose) => {
        const purposeTeams = grouped.get(purpose)!;
        const label = PURPOSE_LABELS[purpose] ?? purpose;

        return (
          <section key={purpose}>
            <h2 className="mb-4 text-xl font-semibold text-white">{label}</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {purposeTeams.map((team) => (
                <Link
                  key={team.slug}
                  href={`/games/${gameSlug}/teams/${team.slug}`}
                  className="group rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-sky-300/40 hover:bg-white/10"
                >
                  <h3 className="text-lg font-medium text-white group-hover:text-sky-100 transition">{team.name}</h3>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/50">
                    <span>{getCharacterCount(team.characterIds)} characters</span>
                    {team.synergyScore != null && (
                      <span>Synergy: <span className="font-semibold text-white/80">{team.synergyScore}%</span></span>
                    )}
                    {team.powerLevel != null && (
                      <span>Power: <span className="font-semibold text-white/80">{team.powerLevel.toLocaleString()}</span></span>
                    )}
                    {team.difficulty && (
                      <span className="capitalize">{team.difficulty}</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
