import Link from 'next/link';

export default function SkrToolsPage() {
  const tools = [
    {
      label: 'Tier Lists',
      href: '/games/seven-knights-rebirth/tier-lists',
      description: 'Community-ranked tier lists for PvP and PvE',
      icon: 'T',
    },
    {
      label: 'Team Builder',
      href: '/games/seven-knights-rebirth/teams',
      description: 'Browse and build team compositions',
      icon: 'B',
    },
    {
      label: 'Builds',
      href: '/games/seven-knights-rebirth/builds',
      description: 'Recommended gear, skill priorities, and stat spreads',
      icon: 'S',
    },
  ];

  return (
    <section aria-labelledby="tools-title">
      <h1 id="tools-title" className="text-2xl font-semibold text-white">Tools</h1>
      <p className="mt-1 text-sm text-white/50">Community tools for Seven Knights: Rebirth.</p>

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
