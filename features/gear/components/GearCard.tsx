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
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-sky-300/40 hover:bg-white/10">
      <h3 className="text-lg font-medium text-white">{gear.name}</h3>

      {gear.source && (
        <p className="mt-1 text-xs uppercase tracking-[0.15em] text-white/40">{gear.source}</p>
      )}

      {gear.description && (
        <p className="mt-2 text-sm text-white/70">{gear.description}</p>
      )}

      <div className="mt-3 space-y-2">
        {gear.twoPieceEffect && (
          <div className="rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2">
            <span className="text-[0.6rem] uppercase tracking-[0.2em] text-sky-400">2-Piece</span>
            <p className="mt-0.5 text-sm text-white/80">{gear.twoPieceEffect}</p>
          </div>
        )}
        {gear.fourPieceEffect && (
          <div className="rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2">
            <span className="text-[0.6rem] uppercase tracking-[0.2em] text-amber-400">4-Piece</span>
            <p className="mt-0.5 text-sm text-white/80">{gear.fourPieceEffect}</p>
          </div>
        )}
      </div>

      {gear.tags && gear.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {gear.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.1em] text-white/50"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
