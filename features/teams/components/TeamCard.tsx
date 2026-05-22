type Props = {
  team: {
    slug: string;
    name: string;
    purpose: string | null;
    difficulty: string | null;
    synergyScore: number | null;
    powerLevel: number | null;
    characterIds: string;
  };
};

const PURPOSE_LABELS: Record<string, string> = {
  raid: 'Raid',
  pvp: 'PVP',
  gvg: 'Guild War',
  pve: 'PVE',
  adventure: 'Adventure',
  dungeon: 'Dungeon',
};

const PURPOSE_COLORS: Record<string, string> = {
  raid: '#ff4444',
  pvp: '#ffbb33',
  gvg: '#aa66cc',
  pve: '#33b5e5',
  adventure: '#00c851',
  dungeon: '#ff6b6b',
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

function getCharacterCount(characterIds: string): number {
  if (!characterIds) return 0;
  return characterIds.split(',').filter(Boolean).length;
}

export default function TeamCard({ team }: Props) {
  const purposeColor = PURPOSE_COLORS[team.purpose ?? ''] ?? '#888888';
  const purposeLabel = PURPOSE_LABELS[team.purpose ?? ''] ?? (team.purpose ?? 'General');
  const difficultyColor = DIFFICULTY_COLORS[team.difficulty ?? ''] ?? '#888888';
  const difficultyLabel = DIFFICULTY_LABELS[team.difficulty ?? ''] ?? (team.difficulty ?? '');
  const charCount = getCharacterCount(team.characterIds);

  return (
    <div className="group rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-sky-300/40 hover:bg-white/10">
      <div className="flex flex-wrap items-center gap-2">
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

      <h3 className="mt-2 text-lg font-medium text-white group-hover:text-sky-100 transition">{team.name}</h3>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/50">
        <span>{charCount} characters</span>
        {team.synergyScore != null && (
          <span>Synergy: <span className="font-semibold text-white/80">{team.synergyScore}%</span></span>
        )}
        {team.powerLevel != null && (
          <span>Power: <span className="font-semibold text-white/80">{team.powerLevel.toLocaleString()}</span></span>
        )}
      </div>
    </div>
  );
}
