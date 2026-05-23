'use client';

import DataTable from '@/shared/components/dev/DataTable';

type Pet = {
  slug: string;
  name: string;
  rarity: string;
  faction: string | null;
  passive1Name: string;
  passive1Description: string;
  passive1Enhanced: string;
  passive2Name: string;
  passive2Description: string;
  passive2Enhanced: string;
};

const rarityColors: Record<string, string> = {
  Common: 'text-white/50',
  Rare: 'text-sky-400',
  Legendary: 'text-orange-400',
};

export default function PetsTable({ data }: { data: Pet[] }) {
  const columns = [
    {
      key: 'name',
      label: 'Name',
      sortValue: (p: Pet) => p.name,
      render: (p: Pet) => <span className="font-medium text-white">{p.name}</span>,
    },
    {
      key: 'rarity',
      label: 'Rarity',
      sortValue: (p: Pet) => {
        const order: Record<string, number> = { Common: 0, Rare: 1, Legendary: 2 };
        return order[p.rarity] ?? 0;
      },
      render: (p: Pet) => (
        <span className={rarityColors[p.rarity] || 'text-white/80'}>{p.rarity}</span>
      ),
    },
    {
      key: 'faction',
      label: 'Faction',
      sortValue: (p: Pet) => p.faction ?? '',
      render: (p: Pet) => (
        <span className={p.faction ? 'text-white/70' : 'text-white/30'}>{p.faction || '\u2014'}</span>
      ),
    },
    {
      key: 'passive1Name',
      label: 'Passive 1',
      sortValue: (p: Pet) => p.passive1Name,
    },
    {
      key: 'passive2Name',
      label: 'Passive 2',
      sortValue: (p: Pet) => p.passive2Name,
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      keyExtractor={(p) => p.slug}
      searchPlaceholder="Search pets by name, rarity, faction, passives..."
      getSearchText={(p) =>
        `${p.name} ${p.rarity} ${p.faction ?? ''} ${p.passive1Name} ${p.passive1Description} ${p.passive2Name} ${p.passive2Description}`
      }
      renderExpanded={(p) => (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
            <span className="text-xs font-medium text-white/40">Passive 1: {p.passive1Name}</span>
            <p className="mt-1 text-sm text-white/70">{p.passive1Description}</p>
            {p.passive1Enhanced && (
              <div className="mt-2">
                <span className="text-xs text-white/40">Enhanced</span>
                <p className="mt-0.5 whitespace-pre-wrap text-xs text-white/50">{p.passive1Enhanced}</p>
              </div>
            )}
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
            <span className="text-xs font-medium text-white/40">Passive 2: {p.passive2Name}</span>
            <p className="mt-1 text-sm text-white/70">{p.passive2Description}</p>
            {p.passive2Enhanced && (
              <div className="mt-2">
                <span className="text-xs text-white/40">Enhanced</span>
                <p className="mt-0.5 whitespace-pre-wrap text-xs text-white/50">{p.passive2Enhanced}</p>
              </div>
            )}
          </div>
        </div>
      )}
    />
  );
}
