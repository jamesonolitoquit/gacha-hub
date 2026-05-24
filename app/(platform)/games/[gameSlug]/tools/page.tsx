import Link from 'next/link';
import { notFound } from 'next/navigation';
import { moduleRegistry } from '../../../../../core/module-registry';

type ToolsPageProps = {
  params: {
    gameSlug: string;
  };
};

export async function generateMetadata({ params }: ToolsPageProps) {
  const game = moduleRegistry.get(params.gameSlug);

  if (!game) {
    return {};
  }

  return {
    title: `Tools | ${game.name}`,
    description: `Tools for ${game.name}.`,
  };
}

export default async function ToolsPage({ params }: ToolsPageProps) {
  const game = moduleRegistry.get(params.gameSlug);

  if (!game) {
    notFound();
  }

  // Tools are only available for specific games
  // For now, only SKR has a tools page with these tools
  if (game.slug !== 'seven-knights-rebirth') {
    notFound();
  }

  const tools = [
    {
      label: 'Tier Lists',
      href: `/games/${params.gameSlug}/tier-lists`,
      description: 'Community-ranked tier lists for PvP and PvE',
      icon: 'T',
    },
    {
      label: 'Team Builder',
      href: `/games/${params.gameSlug}/teams`,
      description: 'Browse and build team compositions',
      icon: 'B',
    },
    {
      label: 'Builds',
      href: `/games/${params.gameSlug}/builds`,
      description: 'Recommended gear, skill priorities, and stat spreads',
      icon: 'S',
    },
  ];

  return (
    <section aria-labelledby="tools-title">
      <h1 id="tools-title" className="text-2xl font-semibold text-white">Tools</h1>
      <p className="mt-1 text-sm text-white/50">Community tools for {game.name}.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group rounded-2xl border p-5 transition hover:border-white/20"
            style={{ borderColor: 'rgba(255,255,255,0.08)' }}
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold"
              style={{
                background: 'rgba(124,92,255,0.2)',
                color: '#7c5cff',
                border: '1px solid rgba(124,92,255,0.3)',
              }}
            >
              {tool.icon}
            </div>
            <h2 className="mt-4 text-sm font-semibold text-white group-hover:text-[#7c5cff] transition-colors">
              {tool.label}
            </h2>
            <p className="mt-1 text-xs text-white/50">{tool.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
