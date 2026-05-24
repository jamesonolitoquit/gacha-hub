"use client";

type Props = {
  gear: {
    slug: string;
    name: string;
    source: string | null;
    twoPieceEffect: string | null;
    fourPieceEffect: string | null;
    description: string | null;
    tags: string[] | null;
  };
};

export default function GearCard({ gear }: Props) {
  return (
    <div className="rounded-xl border p-3 transition hover:bg-white/[0.03]" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-white">{gear.name}</h3>
        {gear.source && <span className="shrink-0 text-[0.45rem] uppercase tracking-[0.15em] text-white/35">{gear.source}</span>}
      </div>

      <div className="mt-2 space-y-1">
        {gear.twoPieceEffect && (
          <div className="rounded-lg px-2.5 py-1.5" style={{ background: 'rgba(51,181,229,0.06)' }}>
            <span className="text-[0.45rem] font-semibold uppercase tracking-[0.15em] text-sky-400">2pc</span>
            <p className="text-[0.55rem] text-white/70 leading-relaxed">{gear.twoPieceEffect}</p>
          </div>
        )}
        {gear.fourPieceEffect && (
          <div className="rounded-lg px-2.5 py-1.5" style={{ background: 'rgba(255,191,0,0.06)' }}>
            <span className="text-[0.45rem] font-semibold uppercase tracking-[0.15em] text-amber-400">4pc</span>
            <p className="text-[0.55rem] text-white/70 leading-relaxed">{gear.fourPieceEffect}</p>
          </div>
        )}
      </div>

      {gear.tags && gear.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {gear.tags.map((tag) => (
            <span key={tag} className="rounded border px-1.5 py-0.5 text-[0.45rem] uppercase tracking-[0.1em] text-white/40" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>{tag}</span>
          ))}
        </div>
      )}
    </div>
  );
}
