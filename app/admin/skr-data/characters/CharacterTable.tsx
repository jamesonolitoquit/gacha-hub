'use client';

import DataTable from '@/shared/components/dev/DataTable';

type Character = {
  name: string;
  slug: string;
  characterClass: string;
  rarity: string;
  element: string | null;
  description: string | null;
};

const classColors: Record<string, string> = {
  Attack: 'text-red-400',
  Defense: 'text-blue-400',
  Magic: 'text-purple-400',
  Support: 'text-emerald-400',
  Universal: 'text-amber-400',
};

const rarityColors: Record<string, string> = {
  Common: 'text-white/50',
  Rare: 'text-sky-400',
  Legendary: 'text-orange-400',
  'Legendary+': 'text-yellow-400',
  'Legendary++': 'text-rose-400',
};

export default function CharacterTable({ data }: { data: Character[] }) {
  const columns = [
    {
      key: 'name',
      label: 'Name',
      sortValue: (c: Character) => c.name,
      render: (c: Character) => (
        <span className="font-medium text-white">{c.name}</span>
      ),
    },
    {
      key: 'characterClass',
      label: 'Class',
      sortValue: (c: Character) => c.characterClass,
      render: (c: Character) => (
        <span className={classColors[c.characterClass] || 'text-white/80'}>{c.characterClass}</span>
      ),
    },
    {
      key: 'rarity',
      label: 'Rarity',
      sortValue: (c: Character) => {
        const order: Record<string, number> = { Common: 0, Rare: 1, Legendary: 2, 'Legendary+': 3, 'Legendary++': 4 };
        return order[c.rarity] ?? 0;
      },
      render: (c: Character) => (
        <span className={rarityColors[c.rarity] || 'text-white/80'}>{c.rarity}</span>
      ),
    },
    {
      key: 'element',
      label: 'Element',
      sortValue: (c: Character) => c.element ?? '',
      render: (c: Character) => (
        <span className={c.element ? 'text-white/80' : 'text-white/30'}>{c.element || '\u2014'}</span>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      keyExtractor={(c) => c.slug}
      searchPlaceholder="Search by name, class, element..."
      getSearchText={(c) => `${c.name} ${c.characterClass} ${c.rarity} ${c.element ?? ''} ${c.description ?? ''}`}
      renderExpanded={(c) => (
        <div className="space-y-3">
          <div>
            <span className="text-xs font-medium text-white/40">Slug</span>
            <p className="mt-0.5 text-sm text-white/70">{c.slug}</p>
          </div>
          {c.description && (
            <div>
              <span className="text-xs font-medium text-white/40">Description</span>
              <p className="mt-0.5 whitespace-pre-wrap text-sm text-white/70">{c.description}</p>
            </div>
          )}
        </div>
      )}
    />
  );
}
