import Link from 'next/link';

type PatchSummary = {
  id?: number;
  version?: string | null;
  name?: string | null;
  notes?: string | null;
  changes?: string | null;
  createdAt?: Date | string | null;
};

export default function RecentUpdates({
  patches,
  gameSlug,
}: {
  patches: PatchSummary[];
  gameSlug: string;
}) {
  if (patches.length === 0) return null;

  return (
    <section>
      <SectionHeading title="Recent Updates" />

      <div className="space-y-1" style={{ borderLeft: '1px solid var(--border-color)' }}>
        {patches.map((p) => {
          const label = p.version ?? p.name ?? 'Update';
          const desc = p.notes ?? p.changes ?? null;
          return (
            <div key={p.id ?? label} className="relative pl-4 pb-3">
              <div
                className="absolute left-0 top-1.5 h-2 w-2 -translate-x-[5px] rounded-full"
                style={{ background: 'var(--border-color)' }}
              />
              <Link
                href={`/games/${gameSlug}/patches`}
                className="text-size-tiny font-semibold transition hover:opacity-70"
                style={{ color: 'var(--foreground)' }}
              >
                {label}
              </Link>
              {desc && (
                <p className="mt-0.5 text-size-tiny leading-relaxed text-white/40 line-clamp-2">{desc}</p>
              )}
            </div>
          );
        })}
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
