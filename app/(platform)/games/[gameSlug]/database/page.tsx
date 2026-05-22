import Link from 'next/link';
import { notFound } from 'next/navigation';
import { moduleRegistry } from '../../../../../core/module-registry';

type Props = {
  params: { gameSlug: string };
};

export default function DatabaseLandingPage({ params }: Props) {
  const game = moduleRegistry.get(params.gameSlug);

  if (!game) {
    notFound();
  }

  const sections = [
    { slug: 'heroes', label: 'Heroes', desc: 'Browse all playable characters', icon: '◆' },
    { slug: 'skills', label: 'Skills', desc: 'View all abilities and passives', icon: '⚡' },
    { slug: 'gear', label: 'Gear', desc: 'Equipment sets and effects', icon: '🛡' },
    { slug: 'pets', label: 'Pets', desc: 'Companion units and passives', icon: '◇' },
  ];

  return (
    <section>
      <p className="text-xs uppercase tracking-[0.3em] text-white/40">{game.name}</p>
      <h1 className="mt-2 text-3xl font-semibold text-white">Database</h1>
      <p className="mt-2 text-sm text-white/60">Browse all game entities in one place.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {sections.map((section) => (
          <Link
            key={section.slug}
            href={`/games/${params.gameSlug}/database/${section.slug}`}
            className="group rounded-2xl border p-6 transition hover:border-white/20"
            style={{
              borderColor: 'rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.02)',
            }}
          >
            <span className="text-2xl">{section.icon}</span>
            <h2 className="mt-3 text-lg font-semibold text-white group-hover:text-white">{section.label}</h2>
            <p className="mt-1 text-sm text-white/50">{section.desc}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
