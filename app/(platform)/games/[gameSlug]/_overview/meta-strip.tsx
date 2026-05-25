import Link from 'next/link';
import type { OverviewStats } from '../../../../../server/repositories/overview.repository';

type StatPill = { label: string; value: number; href: string };

export default function MetaStrip({ stats, gameSlug }: { stats: OverviewStats; gameSlug: string }) {
  const pills: StatPill[] = [
    { label: 'Heroes', value: stats.heroes, href: `/games/${gameSlug}/heroes` },
    { label: 'Skills', value: stats.skills, href: `/games/${gameSlug}/heroes` },
    { label: 'Tier Lists', value: stats.tierLists, href: `/games/${gameSlug}/tier-lists` },
    { label: 'Gear Sets', value: stats.gearSets, href: `/games/${gameSlug}/database/gear` },
    { label: 'Pets', value: stats.pets, href: `/games/${gameSlug}/database/pets` },
    { label: 'Guides', value: stats.guides, href: `/games/${gameSlug}/guides` },
  ];

  return (
    <div
      className="flex items-center gap-1 overflow-x-auto rounded-xl px-4 py-2.5 scrollbar-none"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)' }}
    >
      {pills.map((pill, i) => (
        <div key={pill.label} className="flex items-center gap-1 shrink-0">
          {i > 0 && <span className="mx-2 h-3 w-px shrink-0 bg-white/8" />}
          <Link
            href={pill.href}
            className="whitespace-nowrap text-size-tiny font-medium text-white/50 transition hover:text-white/80"
          >
            <span className="text-white/80">{pill.value}</span>
            <span className="ml-1">{pill.label}</span>
          </Link>
        </div>
      ))}
    </div>
  );
}
