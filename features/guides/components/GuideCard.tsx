import type { GameGuideType } from '../../../shared/types/taxonomies';

type Props = {
  guide: {
    slug: string;
    title: string;
    summary: string | null;
    guideType: string | null;
    mode: string | null;
    author?: string | null;
    isVerified?: boolean;
    recommendedPower?: number | null;
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

export default function GuideCard({ guide, guideTypeMeta }: Props) {
  const color = guideTypeMeta?.color ?? '#888';
  return (
    <div className="rounded-xl border p-3 transition hover:bg-white/[0.03]" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
      <div className="flex flex-wrap items-center gap-1.5">
        {guideTypeMeta && (
          <span className="inline-block rounded px-1.5 py-0.5 text-[0.45rem] font-semibold uppercase tracking-[0.15em]" style={{ background: `${color}18`, color }}>
            {guideTypeMeta.label}
          </span>
        )}
        {guide.mode && (
          <span className="rounded border px-1.5 py-0.5 text-[0.4rem] uppercase tracking-[0.15em] text-white/40" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            {MODE_LABELS[guide.mode] ?? guide.mode}
          </span>
        )}
        {guide.isVerified && (
          <span className="rounded px-1.5 py-0.5 text-[0.4rem] font-semibold text-green-400" style={{ background: '#00c85118' }}>✓ Verified</span>
        )}
      </div>

      <h3 className="mt-1.5 text-sm font-semibold text-white">{guide.title}</h3>

      {guide.summary && (
        <p className="mt-0.5 text-[0.55rem] text-white/50 line-clamp-2">{guide.summary}</p>
      )}

      <div className="mt-1.5 flex items-center gap-2 text-[0.45rem] text-white/35">
        {guide.recommendedPower != null && guide.recommendedPower > 0 && (
          <span>Power {guide.recommendedPower.toLocaleString()}+</span>
        )}
        {guide.author && <span>By {guide.author}</span>}
        {guide.updatedAt && <span>Updated {timeAgo(guide.updatedAt)}</span>}
      </div>
    </div>
  );
}
