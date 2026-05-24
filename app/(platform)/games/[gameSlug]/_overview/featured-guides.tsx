import Link from 'next/link';

type GuideSummary = {
  slug: string;
  title: string;
  summary?: string | null;
  type?: string | null;
  updatedAt?: Date | string | null;
};

export default function FeaturedGuides({
  guides,
  gameSlug,
}: {
  guides: GuideSummary[];
  gameSlug: string;
}) {
  if (guides.length === 0) return null;

  return (
    <section>
      <SectionHeading title="Featured Guides" />

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {guides.map((g) => (
          <Link
            key={g.slug}
            href={`/games/${gameSlug}/guides/${g.slug}`}
            className="group rounded-xl p-3 transition hover:-translate-y-0.5"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)' }}
          >
            <div className="flex items-center gap-1.5">
              {g.type && (
                <span
                  className="rounded px-1.5 py-0.5 text-size-micro font-semibold uppercase tracking-wider"
                  style={{ background: 'rgba(124,92,255,0.15)', color: '#7c5cff' }}
                >
                  {g.type}
                </span>
              )}
              {g.updatedAt && (
                <span className="ml-auto text-size-micro text-white/30">
                  {timeAgo(g.updatedAt)}
                </span>
              )}
            </div>
            <p className="mt-1.5 text-sm font-medium leading-snug" style={{ color: 'var(--foreground)' }}>
              {g.title}
            </p>
            {g.summary && (
              <p className="mt-1 text-size-tiny leading-relaxed text-white/45 line-clamp-2">
                {g.summary}
              </p>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <h2 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{title}</h2>
      <span className="h-px flex-1" style={{ background: 'var(--border-color)' }} />
    </div>
  );
}

function timeAgo(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const diff = Date.now() - d.getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 1) return 'Today';
  if (days === 1) return '1d ago';
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}
