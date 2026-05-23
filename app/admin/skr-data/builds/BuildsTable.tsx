'use client';

import DataTable from '@/shared/components/dev/DataTable';

type GearSet = {
  weapon: string;
  armor: string;
  accessory: string;
  setName: string;
};

type Build = {
  characterSlug: string;
  gameSlug: string;
  gearSet1: GearSet;
  gearSet2?: GearSet;
  transcendencePath?: string[];
  skillPriority?: string[];
  statPriorities: string[];
  keyUsage?: string[];
  exclusiveEquipment?: string;
  notes?: string;
};

function GearSetCard({ label, set }: { label: string; set: GearSet }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
      <span className="text-xs font-medium text-white/40">{label}</span>
      <p className="mt-1 text-sm font-medium text-white/80">{set.setName}</p>
      <ul className="mt-1 space-y-0.5">
        <li className="text-xs text-white/50">Weapon: {set.weapon}</li>
        <li className="text-xs text-white/50">Armor: {set.armor}</li>
        <li className="text-xs text-white/50">Accessory: {set.accessory}</li>
      </ul>
    </div>
  );
}

export default function BuildsTable({ data }: { data: Build[] }) {
  const columns = [
    {
      key: 'characterSlug',
      label: 'Character',
      sortValue: (b: Build) => b.characterSlug,
      render: (b: Build) => <span className="font-medium text-white">{b.characterSlug}</span>,
    },
    {
      key: 'gearSet1',
      label: 'Gear Set 1',
      sortValue: (b: Build) => b.gearSet1.setName,
      render: (b: Build) => (
        <span className="text-white/70">{b.gearSet1.setName}</span>
      ),
    },
    {
      key: 'gearSet2',
      label: 'Gear Set 2',
      sortValue: (b: Build) => b.gearSet2?.setName ?? '',
      render: (b: Build) => (
        <span className="text-white/70">{b.gearSet2?.setName ?? '\u2014'}</span>
      ),
    },
    {
      key: 'keyUsage',
      label: 'Usage',
      sortValue: (b: Build) => b.keyUsage?.join(', ') ?? '',
      render: (b: Build) => (
        <div className="flex flex-wrap gap-1">
          {(b.keyUsage ?? []).map((u) => (
            <span key={u} className="rounded bg-white/10 px-1.5 py-0.5 text-xs text-white/60">{u}</span>
          ))}
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      keyExtractor={(b, i) => `${b.characterSlug}-${i}`}
      searchPlaceholder="Search builds by character, gear set, usage..."
      getSearchText={(b) =>
        `${b.characterSlug} ${b.gearSet1.setName} ${b.gearSet2?.setName ?? ''} ${(b.keyUsage ?? []).join(' ')} ${b.notes ?? ''}`
      }
      renderExpanded={(b) => (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <GearSetCard label="Gear Set 1" set={b.gearSet1} />
          {b.gearSet2 && <GearSetCard label="Gear Set 2" set={b.gearSet2} />}

          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
            <span className="text-xs font-medium text-white/40">Transcendence Path</span>
            <ol className="mt-1 list-inside list-decimal space-y-0.5">
              {(b.transcendencePath ?? []).map((t, i) => (
                <li key={i} className="text-xs text-white/60">{t}</li>
              ))}
            </ol>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
            <span className="text-xs font-medium text-white/40">Skill Priority</span>
            <ol className="mt-1 list-inside list-decimal space-y-0.5">
              {(b.skillPriority ?? []).map((s, i) => (
                <li key={i} className="text-xs text-white/60">{s}</li>
              ))}
            </ol>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
            <span className="text-xs font-medium text-white/40">Stat Priorities</span>
            <div className="mt-1 flex flex-wrap gap-1">
              {(b.statPriorities ?? []).map((s) => (
                <span key={s} className="rounded bg-white/10 px-1.5 py-0.5 text-xs text-white/60">{s}</span>
              ))}
            </div>
          </div>

          {b.exclusiveEquipment && (
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
              <span className="text-xs font-medium text-white/40">Exclusive Equipment</span>
              <p className="mt-1 text-sm text-white/70">{b.exclusiveEquipment}</p>
            </div>
          )}

          {b.notes && (
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3 md:col-span-2">
              <span className="text-xs font-medium text-white/40">Notes</span>
              <p className="mt-1 whitespace-pre-wrap text-sm text-white/70">{b.notes}</p>
            </div>
          )}
        </div>
      )}
    />
  );
}
