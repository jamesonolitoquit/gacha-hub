import Link from 'next/link';

type GuideSummary = {
  slug: string;
  title: string;
  summary?: string | null;
};

type CharacterSummary = {
  slug: string;
  name: string;
};

export default function TierRelatedContent({
  characters,
  guides,
  gameSlug,
}: {
  characters: CharacterSummary[];
  guides: GuideSummary[];
  gameSlug: string;
}) {
  const hasBuilds = characters.length > 0;
  const hasGuides = guides.length > 0;

  if (!hasBuilds && !hasGuides) return null;

  return (
    <section>
      <SectionHeading title="Related Content" />

      <div className="grid gap-3 sm:grid-cols-2">
        {hasBuilds && (
          <div
            className="rounded-xl px-4 py-3"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)' }}
          >
            <p className="text-size-tiny font-semibold uppercase tracking-[0.2em] text-white/40">Character Builds</p>
            <div className="mt-2 space-y-1">
              {characters.slice(0, 5).map((c) => (
                <Link
                  key={c.slug}
                  href={`/games/${gameSlug}/heroes/${c.slug}`}
                  className="block rounded-lg px-2 py-1 text-size-small text-white/60 transition hover:bg-white/[0.03] hover:text-white/80"
                >
                  {c.name} Build
                </Link>
              ))}
              {characters.length > 5 && (
                <p className="px-2 text-size-tiny text-white/30">+{characters.length - 5} more</p>
              )}
            </div>
          </div>
        )}

        {hasGuides && (
          <div
            className="rounded-xl px-4 py-3"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)' }}
          >
            <p className="text-size-tiny font-semibold uppercase tracking-[0.2em] text-white/40">Related Guides</p>
            <div className="mt-2 space-y-1">
              {guides.map((g) => (
                <Link
                  key={g.slug}
                  href={`/games/${gameSlug}/guides/${g.slug}`}
                  className="block rounded-lg px-2 py-1 text-size-small text-white/60 transition hover:bg-white/[0.03] hover:text-white/80"
                >
                  <p className="font-medium text-white/80">{g.title}</p>
                  {g.summary && <p className="mt-0.5 text-size-tiny text-white/40 line-clamp-1">{g.summary}</p>}
                </Link>
              ))}
            </div>
          </div>
        )}
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
