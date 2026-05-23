'use client';

import DataTable from '@/shared/components/dev/DataTable';

type Gear = {
  slug: string;
  name: string;
  source: string;
  twoPieceEffect: string;
  fourPieceEffect: string;
  tags: string[];
};

export default function GearTable({ data }: { data: Gear[] }) {
  const columns = [
    {
      key: 'name',
      label: 'Name',
      sortValue: (g: Gear) => g.name,
      render: (g: Gear) => <span className="font-medium text-white">{g.name}</span>,
    },
    {
      key: 'source',
      label: 'Source',
      sortValue: (g: Gear) => g.source,
      render: (g: Gear) => <span className="text-white/70">{g.source}</span>,
    },
    {
      key: 'twoPieceEffect',
      label: '2-Piece Effect',
      sortValue: (g: Gear) => g.twoPieceEffect,
    },
    {
      key: 'fourPieceEffect',
      label: '4-Piece Effect',
      sortValue: (g: Gear) => g.fourPieceEffect,
    },
    {
      key: 'tags',
      label: 'Tags',
      sortValue: (g: Gear) => g.tags?.join(', ') ?? '',
      render: (g: Gear) => (
        <div className="flex flex-wrap gap-1">
          {(g.tags ?? []).map((t) => (
            <span key={t} className="rounded bg-white/10 px-1.5 py-0.5 text-xs text-white/60">{t}</span>
          ))}
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      keyExtractor={(g) => g.slug}
      searchPlaceholder="Search gear by name, source, effect, tags..."
      getSearchText={(g) => `${g.name} ${g.source} ${g.twoPieceEffect} ${g.fourPieceEffect} ${(g.tags ?? []).join(' ')}`}
    />
  );
}
