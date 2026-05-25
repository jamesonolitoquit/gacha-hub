import Link from 'next/link';
import { tierColors } from '../../../../../shared/styles/tokens';

type HeroEntry = {
  characterId: number;
  characterSlug: string;
  characterName: string;
  tier: string;
  class?: string | null;
  portraitUrl?: string | null;
};

export default function LiveMetaSection({
  pveEntries,
  pvpEntries,
  gameSlug,
}: {
  pveEntries: HeroEntry[];
  pvpEntries: HeroEntry[];
  gameSlug: string;
}) {
  const hasAny = pveEntries.length > 0 || pvpEntries.length > 0;
  if (!hasAny) return null;

  return (
    <section>
      <SectionHeading title="Current Meta Picks" />

      {pveEntries.length > 0 && (
        <div className="mb-3">
          <ModeLabel label="PVE" />
          <HeroRow entries={pveEntries} gameSlug={gameSlug} />
        </div>
      )}

      {pvpEntries.length > 0 && (
        <div>
          <ModeLabel label="PVP" />
          <HeroRow entries={pvpEntries} gameSlug={gameSlug} />
        </div>
      )}
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

function ModeLabel({ label }: { label: string }) {
  return (
    <p className="mb-1.5 text-size-tiny font-semibold uppercase tracking-[0.2em] text-white/40">{label}</p>
  );
}

function HeroRow({ entries, gameSlug }: { entries: HeroEntry[]; gameSlug: string }) {
  return (
    <div
      className="flex gap-2 overflow-x-auto pb-1 scrollbar-none"
      style={{ scrollSnapType: 'x mandatory' }}
    >
      {entries.map((e) => {
        const color = tierColors[e.tier] ?? '#888';
        return (
          <Link
            key={e.characterId}
            href={`/games/${gameSlug}/heroes/${e.characterSlug}`}
            className="group flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 transition hover:-translate-y-0.5"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--border-color)',
              scrollSnapAlign: 'start',
              minWidth: '160px',
            }}
          >
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-size-tiny font-bold"
              style={{ background: `${color}22`, color }}
            >
              {e.characterName?.[0] ?? '?'}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium leading-tight" style={{ color: 'var(--foreground)' }}>
                {e.characterName}
              </p>
              <span
                className="inline-block mt-0.5 rounded px-1 py-0.5 text-size-micro font-bold leading-none"
                style={{ background: `${color}22`, color }}
              >
                {e.tier}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
