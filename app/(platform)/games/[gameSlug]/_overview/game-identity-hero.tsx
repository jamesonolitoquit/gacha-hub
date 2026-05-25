import Link from 'next/link';
import type { GameModule } from '../../../../../core/types';

export default function GameIdentityHero({ game }: { game: GameModule }) {
  const primary = game.theme.colors.primary;
  const secondary = game.theme.colors.secondary;

  return (
    <section
      className="relative overflow-hidden rounded-2xl px-6 py-8 lg:px-10 lg:py-10"
      style={{
        background: `radial-gradient(circle at 8% 20%, ${primary}30, transparent 50%), radial-gradient(circle at 92% 80%, ${secondary}15, transparent 50%), linear-gradient(135deg, rgba(10,7,22,0.85), rgba(28,21,48,0.85))`,
        border: '1px solid var(--border-color)',
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url(${game.bannerUrl ?? ''})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(24px)',
        }}
      />

      <div className="relative">
        <p className="text-size-tiny font-semibold uppercase tracking-[0.25em] text-white/30">
          {game.subdomain}
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight lg:text-3xl" style={{ color: 'var(--foreground)' }}>
          {game.name}
        </h1>
        <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-white/55">
          {game.seo?.intro ?? 'Tier Lists, Builds, Teams, Gear, Pets, Guides, and Meta Rankings'}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Link
            href={`/games/${game.slug}/heroes`}
            className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
            style={{ background: `${primary}22`, color: primary }}
          >
            Search Heroes
          </Link>
          <Link
            href={`/games/${game.slug}/tier-lists`}
            className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition"
            style={{
              background: 'rgba(255,255,255,0.04)',
              color: 'var(--foreground)',
              border: '1px solid var(--border-color)',
            }}
          >
            View Tier Lists
          </Link>
        </div>
      </div>
    </section>
  );
}
