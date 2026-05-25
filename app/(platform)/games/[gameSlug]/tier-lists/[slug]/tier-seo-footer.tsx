import type { GameModule } from '../../../../../../core/types';

export default function TierSeoFooter({ game, title }: { game: GameModule; title: string }) {
  const content = game.seo?.footerContent;
  if (!content) return null;

  return (
    <section
      className="rounded-xl px-5 py-5"
      style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)' }}
    >
      <h2 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
        About the {title}
      </h2>
      <p className="mt-2 text-size-small leading-relaxed text-white/45 max-w-3xl">
        {content}
      </p>
    </section>
  );
}
