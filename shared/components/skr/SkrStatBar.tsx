import type { GameStat } from '../../types/taxonomies';

export type StatValue = {
  statName: string;
  value: number;
  perLevel?: number;
  maxValue?: number;
};

type Props = {
  stats: StatValue[];
  config: GameStat[];
  className?: string;
};

function formatValue(value: number, stat: GameStat): string {
  switch (stat.format) {
    case 'percentage':
      return `${value}${stat.suffix}`;
    case 'decimal':
      return value.toFixed(1) + stat.suffix;
    case 'integer':
    default:
      return value.toLocaleString() + stat.suffix;
  }
}

export default function SkrStatBar({ stats, config, className = '' }: Props) {
  const resolved = stats
    .map((s) => {
      const cfg = config.find((c) => c.slug === s.statName);
      return cfg ? { ...s, cfg } : null;
    })
    .filter(Boolean) as (StatValue & { cfg: GameStat })[];

  if (resolved.length === 0) return null;

  const maxVal = Math.max(...resolved.map((s) => s.maxValue ?? s.value));

  return (
    <div className={`space-y-3 ${className}`}>
      {resolved.map((s) => {
        const pct = maxVal > 0 ? ((s.maxValue ?? s.value) / maxVal) * 100 : 0;
        return (
          <div key={s.statName}>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-[0.55rem] font-semibold uppercase tracking-widest text-white/40">
                {s.cfg.label}
              </span>
              <span className="font-mono text-xs font-bold text-white">
                {formatValue(s.value, s.cfg)}
              </span>
            </div>
            <div
              className="h-1.5 w-full overflow-hidden rounded-full"
              style={{ background: 'rgba(255,255,255,0.08)' }}
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(pct, 100)}%`,
                  background: 'linear-gradient(90deg, #7c5cff, #f4c542)',
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
