'use client';

import DataTable from '@/shared/components/dev/DataTable';

type Skill = {
  name: string;
  character_slug: string;
  slug: string;
  type: string;
  description: string;
  order: number;
  enhancements: string[];
  transcendence: string[];
};

const typeColors: Record<string, string> = {
  Passive: 'text-purple-400',
  Basic: 'text-blue-400',
  S1: 'text-emerald-400',
  S2: 'text-amber-400',
  Ult: 'text-rose-400',
};

export default function SkillsTable({ data }: { data: Skill[] }) {
  const columns = [
    {
      key: 'name',
      label: 'Name',
      sortValue: (s: Skill) => s.name,
      render: (s: Skill) => <span className="font-medium text-white">{s.name}</span>,
    },
    {
      key: 'character_slug',
      label: 'Character',
      sortValue: (s: Skill) => s.character_slug,
    },
    {
      key: 'type',
      label: 'Type',
      sortValue: (s: Skill) => s.type,
      render: (s: Skill) => (
        <span className={typeColors[s.type] || 'text-white/80'}>{s.type}</span>
      ),
    },
    {
      key: 'order',
      label: 'Order',
      sortable: true,
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      keyExtractor={(s) => s.slug}
      searchPlaceholder="Search skills by name, character, type..."
      getSearchText={(s) => `${s.name} ${s.character_slug} ${s.type} ${s.description}`}
      renderExpanded={(s) => (
        <div className="space-y-4 pr-6">
          <div>
            <span className="text-xs font-medium text-white/40">Description</span>
            <p className="mt-1 whitespace-pre-wrap text-sm text-white/70">{s.description}</p>
          </div>
          {s.enhancements && s.enhancements.length > 0 && (
            <div>
              <span className="text-xs font-medium text-white/40">Enhancements</span>
              <ul className="mt-1 space-y-1">
                {s.enhancements.map((e, i) => (
                  <li key={i} className="text-sm text-white/70">{e}</li>
                ))}
              </ul>
            </div>
          )}
          {s.transcendence && s.transcendence.length > 0 && (
            <div>
              <span className="text-xs font-medium text-white/40">Transcendence</span>
              <ul className="mt-1 space-y-1">
                {s.transcendence.map((t, i) => (
                  <li key={i} className="text-sm text-white/70">{t}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    />
  );
}
