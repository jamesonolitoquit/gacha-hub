import type { GameGuideType } from '../../../shared/types/taxonomies';

type Props = {
  guide: {
    slug: string;
    title: string;
    summary: string | null;
    guideType: string | null;
    mode: string | null;
  };
  guideTypeMeta?: GameGuideType;
};

const MODE_LABELS: Record<string, string> = {
  pve: 'PVE',
  pvp: 'PVP',
};

export default function GuideCard({ guide, guideTypeMeta }: Props) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-sky-300/40 hover:bg-white/10">
      <div className="flex flex-wrap items-center gap-2">
        {guideTypeMeta && (
          <span
            className="inline-block rounded-full px-2.5 py-0.5 text-[0.55rem] font-semibold uppercase tracking-[0.15em]"
            style={{ background: `${guideTypeMeta.color}20`, color: guideTypeMeta.color, border: `1px solid ${guideTypeMeta.color}40` }}
          >
            {guideTypeMeta.label}
          </span>
        )}
        {guide.mode && (
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[0.5rem] uppercase tracking-[0.15em] text-white/50">
            {MODE_LABELS[guide.mode] ?? guide.mode}
          </span>
        )}
      </div>

      <h3 className="mt-2 text-lg font-medium text-white group-hover:text-sky-100 transition">{guide.title}</h3>

      {guide.summary && (
        <p className="mt-1.5 text-sm text-white/70 leading-relaxed">{guide.summary}</p>
      )}
    </div>
  );
}
