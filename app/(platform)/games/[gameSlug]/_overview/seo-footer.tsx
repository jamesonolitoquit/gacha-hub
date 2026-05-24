import type { GameModule } from '../../../../../core/types';

export default function SeoFooter({ game }: { game: GameModule }) {
  const content = game.seo?.footerContent;
  if (!content) return null;

  return (
    <section
      className="rounded-xl px-5 py-5"
      style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)' }}
    >
      <h2 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
        About {game.name}
      </h2>
      <p className="mt-2 text-size-small leading-relaxed text-white/45 max-w-3xl">
        {content}
      </p>
      <p className="mt-3 text-size-tiny text-white/25">
        GachaHub — {game.subdomain}
      </p>
    </section>
  );
}
