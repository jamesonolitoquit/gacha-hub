import type { GameGuideType } from '../../../shared/types/taxonomies';

type Props = {
  guide: {
    guideType: string | null;
    mode: string | null;
    author: string | null;
    boss: string | null;
    recommendedPower: number | null;
    isVerified?: boolean;
    updatedAt?: string | Date | null;
  };
  guideTypeMeta?: GameGuideType;
};

const MODE_LABELS: Record<string, string> = { pve: 'PVE', pvp: 'PVP' };

function timeAgo(d: string | Date): string {
  const sec = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (sec < 60) return 'just now';
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day}d ago`;
  return `${Math.floor(day / 30)}mo ago`;
}

export default function GuideMetaBar({ guide, guideTypeMeta }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {guideTypeMeta && (
        <span className="inline-block rounded px-2 py-0.5 text-[0.5rem] font-semibold uppercase tracking-[0.15em]" style={{ background: `${guideTypeMeta.color}18`, color: guideTypeMeta.color }}>
          {guideTypeMeta.label}
        </span>
      )}
      {guide.mode && (
        <span className="rounded border px-2 py-0.5 text-[0.45rem] uppercase tracking-[0.15em] text-white/50" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          {MODE_LABELS[guide.mode] ?? guide.mode}
        </span>
      )}
      {guide.isVerified && (
        <span className="rounded px-2 py-0.5 text-[0.45rem] font-semibold text-green-400" style={{ background: '#00c85118' }}>✓ Verified</span>
      )}
      {guide.boss && (
        <span className="rounded border px-2 py-0.5 text-[0.45rem] uppercase tracking-[0.15em] text-white/50" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          {guide.boss}
        </span>
      )}
      {guide.recommendedPower != null && guide.recommendedPower > 0 && (
        <span className="rounded border px-2 py-0.5 text-[0.45rem] text-white/50" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          Power {guide.recommendedPower.toLocaleString()}+
        </span>
      )}
      <div className="flex items-center gap-2 text-[0.45rem] text-white/35">
        {guide.author && <span>By {guide.author}</span>}
        {guide.updatedAt && <span>Updated {timeAgo(guide.updatedAt)}</span>}
      </div>
    </div>
  );
}
