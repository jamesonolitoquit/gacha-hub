type BuildGearSet = {
  weapon: string;
  armor: string;
  accessory: string;
  setName: string;
};

type Props = {
  build: {
    gearSet1: BuildGearSet;
    gearSet2?: BuildGearSet;
    transcendencePath: string[];
    skillPriority: string[];
    statPriorities: string[];
    keyUsage: string[];
    exclusiveEquipment?: string;
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

function GearSetDisplay({ label, set, gameSlug }: { label: string; set: BuildGearSet; gameSlug: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
      <p className="mb-2 text-[0.6rem] uppercase tracking-[0.2em] text-white/40">{label}</p>
      <span
        className="inline-block rounded-full border px-2 py-0.5 text-[0.55rem] font-semibold uppercase tracking-[0.15em]"
        style={{ borderColor: 'rgba(255,255,255,0.1)', color: '#33b5e5' }}
      >
        {set.setName}
      </span>
      <ul className="mt-2 space-y-1">
        <li className="flex justify-between text-xs">
          <span className="text-white/50">Weapon</span>
          <span className="font-medium text-white">{set.weapon}</span>
        </li>
        <li className="flex justify-between text-xs">
          <span className="text-white/50">Armor</span>
          <span className="font-medium text-white">{set.armor}</span>
        </li>
        <li className="flex justify-between text-xs">
          <span className="text-white/50">Accessory</span>
          <span className="font-medium text-white">{set.accessory}</span>
        </li>
      </ul>
    </div>
  );
}

export default function BuildRecommendation({ build, gameSlug }: Props) {
  return (
    <div className="overflow-hidden rounded-[2rem] border" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
      <div className="p-6 lg:p-8">
        <p className="mb-6 text-xs uppercase tracking-[0.3em] text-white/40">Recommended Build</p>

        {/* Gear Sets */}
        <div className="mb-6">
          <p className="mb-3 text-sm font-semibold text-white">Gear Sets</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <GearSetDisplay label="Primary Set" set={build.gearSet1} gameSlug={gameSlug} />
            {build.gearSet2 && (
              <GearSetDisplay label="Alternative Set" set={build.gearSet2} gameSlug={gameSlug} />
            )}
          </div>
        </div>

        <div className="mb-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Stat Priorities */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <p className="mb-3 text-[0.6rem] uppercase tracking-[0.2em] text-white/40">Stat Priorities</p>
            <ol className="space-y-1">
              {build.statPriorities.map((stat, i) => (
                <li key={stat} className="flex items-center gap-2 text-xs">
                  <span
                    className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[0.5rem] font-bold"
                    style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-white font-medium">{stat}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Skill Enhancement Priority */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <p className="mb-3 text-[0.6rem] uppercase tracking-[0.2em] text-white/40">Skill Priority</p>
            <ol className="space-y-1">
              {build.skillPriority.map((skill, i) => (
                <li key={skill} className="flex items-center gap-2 text-xs">
                  <span
                    className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[0.5rem] font-bold"
                    style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-white font-medium capitalize">{skill.replace(/-/g, ' ')}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Transcendence Path */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <p className="mb-3 text-[0.6rem] uppercase tracking-[0.2em] text-white/40">Transcendence</p>
            <ul className="space-y-1">
              {build.transcendencePath.map((step) => (
                <li key={step} className="flex items-center gap-2 text-xs">
                  <span className="text-[#f4c542] font-medium">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Key Usage */}
        <div className="mb-6">
          <p className="mb-2 text-[0.6rem] uppercase tracking-[0.2em] text-white/40">Key Usage</p>
          <div className="flex flex-wrap gap-2">
            {build.keyUsage.map((mode) => {
              const color = MODE_COLORS[mode] ?? '#888888';
              return (
                <span
                  key={mode}
                  className="inline-block rounded-full px-2.5 py-0.5 text-[0.55rem] font-semibold uppercase tracking-[0.15em]"
                  style={{ background: `${color}20`, color, border: `1px solid ${color}40` }}
                >
                  {MODE_LABELS[mode] ?? mode}
                </span>
              );
            })}
          </div>
        </div>

        {/* Exclusive Equipment */}
        {build.exclusiveEquipment && (
          <div
            className="mb-4 rounded-xl border p-4"
            style={{ borderColor: `#aa66cc20`, background: `#aa66cc08` }}
          >
            <p className="mb-1 text-[0.6rem] uppercase tracking-[0.2em] font-semibold" style={{ color: '#aa66cc' }}>
              Exclusive Equipment
            </p>
            <p className="text-sm text-white/80">{build.exclusiveEquipment}</p>
          </div>
        )}

        {/* Notes */}
        {build.notes && (
          <div
            className="rounded-xl border p-4"
            style={{ borderColor: '#f4c54220', background: '#f4c54208' }}
          >
            <p className="mb-1 text-[0.6rem] uppercase tracking-[0.2em] font-semibold" style={{ color: '#f4c542' }}>
              Notes
            </p>
            <p className="text-sm text-white/80">{build.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
