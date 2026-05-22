import type { GameGuideType } from '../../../shared/types/taxonomies';

type Props = {
  guide: {
    guideType: string | null;
    mode: string | null;
    author: string | null;
    boss: string | null;
    recommendedPower: number | null;
  };
  guideTypeMeta?: GameGuideType;
};

const MODE_LABELS: Record<string, string> = {
  pve: 'PVE',
  pvp: 'PVP',
};

export default function GuideMetaBar({ guide, guideTypeMeta }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {guideTypeMeta && (
        <span
          className="inline-block rounded-full px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.15em]"
          style={{ background: `${guideTypeMeta.color}20`, color: guideTypeMeta.color, border: `1px solid ${guideTypeMeta.color}40` }}
        >
          {guideTypeMeta.label}
        </span>
      )}
      {guide.mode && (
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.55rem] uppercase tracking-[0.15em] text-white/60">
          {MODE_LABELS[guide.mode] ?? guide.mode}
        </span>
      )}
      {guide.boss && (
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.55rem] uppercase tracking-[0.15em] text-white/60">
          {guide.boss}
        </span>
      )}
      {guide.recommendedPower != null && guide.recommendedPower > 0 && (
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.55rem] text-white/60">
          Power: {guide.recommendedPower.toLocaleString()}+
        </span>
      )}
      {guide.author && (
        <span className="text-[0.55rem] text-white/40">
          By {guide.author}
        </span>
      )}
    </div>
  );
}
