import Link from 'next/link';
import type { OverviewStats } from '../../../../../server/repositories/overview.repository';
import type { GameModule } from '../../../../../core/types';

type ActionCard = {
  slug: string;
  label: string;
  href: string;
  subtitle: string;
  count: number;
  icon: string;
};

const ICON_MAP: Record<string, string> = {
  'tier-lists': 'BarChart3', builds: 'Wrench', teams: 'Users2',
  characters: 'User', 'database/gear': 'Shield', guides: 'BookOpen',
};

const SUBTITLES: Record<string, string> = {
  'tier-lists': 'PvP, PvE & Guild War rankings',
  builds: 'Optimal gear & skill priority',
  teams: 'Synergy-driven compositions',
  characters: 'Full hero roster & stats',
  'database/gear': 'Gear sets & set bonuses',
  guides: 'Progression & farming guides',
};

export default function ActionGrid({ stats, game }: { stats: OverviewStats; game: GameModule }) {
  const cards: ActionCard[] = [
    { slug: 'tier-lists', label: 'Tier Lists', href: `/games/${game.slug}/tier-lists`, subtitle: SUBTITLES['tier-lists'], count: stats.tierLists, icon: ICON_MAP['tier-lists'] },
    { slug: 'builds', label: 'Builds', href: `/games/${game.slug}/builds`, subtitle: SUBTITLES.builds, count: stats.heroes, icon: ICON_MAP.builds },
    { slug: 'teams', label: 'Teams', href: `/games/${game.slug}/teams`, subtitle: SUBTITLES.teams, count: stats.teams, icon: ICON_MAP.teams },
    { slug: 'characters', label: 'Heroes', href: `/games/${game.slug}/characters`, subtitle: SUBTITLES.characters, count: stats.heroes, icon: ICON_MAP.characters },
    { slug: 'database/gear', label: 'Gear', href: `/games/${game.slug}/database/gear`, subtitle: SUBTITLES['database/gear'], count: stats.gearSets, icon: ICON_MAP['database/gear'] },
    { slug: 'guides', label: 'Guides', href: `/games/${game.slug}/guides`, subtitle: SUBTITLES.guides, count: stats.guides, icon: ICON_MAP.guides },
  ];

  const primary = game.theme.colors.primary;

  return (
    <section>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {cards.map((card) => (
          <Link
            key={card.slug}
            href={card.href}
            className="group rounded-xl p-3 transition hover:-translate-y-0.5"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)' }}
          >
            <div
              className="mb-1.5 inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm transition group-hover:scale-110"
              style={{ background: `${primary}18`, color: primary }}
            >
              <Icon name={card.icon} />
            </div>
            <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{card.label}</p>
            <p className="mt-0.5 text-size-tiny leading-tight text-white/40">{card.subtitle}</p>
            <p className="mt-1 text-size-tiny font-medium text-white/30">{card.count} entries</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Icon({ name }: { name: string }) {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {name === 'BarChart3' && <><line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" /></>}
      {name === 'Wrench' && <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />}
      {name === 'Users2' && <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>}
      {name === 'User' && <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>}
      {name === 'Shield' && <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />}
      {name === 'BookOpen' && <><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></>}
    </svg>
  );
}
