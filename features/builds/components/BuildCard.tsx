type BuildGearSet = {
  weapon: string;
  armor: string;
  accessory: string;
  setName: string;
};

type Props = {
  build: {
    characterSlug: string;
    characterName: string;
    gearSet1: BuildGearSet;
    keyUsage?: string[];
    statPriorities: string[];
    notes?: string;
  };
  gameSlug: string;
};

const MODE_LABELS: Record<string, string> = {
  pve: 'PVE',
  pvp: 'PVP',
};

const MODE_COLORS: Record<string, string> = {
  pve: '#33b5e5',
  pvp: '#ff4444',
};

export default function BuildCard({ build, gameSlug }: Props) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 transition hover:border-white/20 hover:bg-white/[0.04]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">{build.characterName}</p>
          <p className="mt-0.5 text-xs text-white/50">{build.gearSet1.setName}</p>
        </div>
        <div className="flex shrink-0 gap-1">
          {(build.keyUsage ?? []).map((mode) => {
            const color = MODE_COLORS[mode] ?? '#888';
            return (
              <span
                key={mode}
                className="inline-block rounded-full px-2 py-0.5 text-[0.55rem] font-semibold uppercase tracking-[0.15em]"
                style={{ background: `${color}20`, color, border: `1px solid ${color}40` }}
              >
                {MODE_LABELS[mode] ?? mode}
              </span>
            );
          })}
        </div>
      </div>

      <div className="mt-3">
        <p className="text-[0.55rem] uppercase tracking-[0.2em] text-white/40">Stat Priorities</p>
        <div className="mt-1 flex flex-wrap gap-1">
          {build.statPriorities.slice(0, 3).map((stat) => (
            <span
              key={stat}
              className="rounded bg-white/5 px-1.5 py-0.5 text-[0.6rem] text-white/70"
            >
              {stat}
            </span>
          ))}
          {build.statPriorities.length > 3 && (
            <span className="text-[0.55rem] text-white/40">+{build.statPriorities.length - 3}</span>
          )}
        </div>
      </div>

      {build.notes && (
        <p className="mt-2 line-clamp-2 text-[0.65rem] text-white/50">{build.notes}</p>
      )}
    </div>
  );
}
