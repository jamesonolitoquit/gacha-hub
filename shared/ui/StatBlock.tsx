import type { GameStat } from '../types/taxonomies'

export type StatValue = {
  statName: string
  value: number
  perLevel?: number
  maxValue?: number
}

type Props = {
  stats: StatValue[]
  config: GameStat[]
  columns?: 2 | 3
  className?: string
}

function formatStatValue(value: number, stat: GameStat): string {
  switch (stat.format) {
    case 'percentage':
      return `${value}${stat.suffix}`
    case 'decimal':
      return value.toFixed(1) + stat.suffix
    case 'integer':
    default:
      return value.toLocaleString() + stat.suffix
  }
}

const GROUP_ACCENTS: Record<string, { bar: string; border: string }> = {
  primary: { bar: '#f4c542', border: 'rgba(244,197,66,0.15)' },
  defensive: { bar: '#33b5e5', border: 'rgba(51,181,229,0.15)' },
  secondary: { bar: '#aa66cc', border: 'rgba(170,102,204,0.15)' },
};

export default function StatBlock({ stats, config, columns = 2, className = '' }: Props) {
  const gridCols = columns === 3 ? 'grid-cols-3' : 'grid-cols-2'

  return (
    <div className={`grid ${gridCols} gap-2 ${className}`}>
      {stats.map((stat) => {
        const statConfig = config.find((s) => s.slug === stat.statName)
        if (!statConfig) return null

        const accent = GROUP_ACCENTS[statConfig.group] ?? { bar: '#888', border: 'rgba(255,255,255,0.06)' };
        const pct = stat.maxValue && stat.maxValue > 0 ? Math.min(100, Math.round((stat.value / stat.maxValue) * 100)) : null;

        return (
          <div
            key={stat.statName}
            className="rounded-lg border p-2.5"
            style={{ borderColor: accent.border, background: 'rgba(255,255,255,0.02)' }}
          >
            <p className="text-[0.45rem] font-semibold uppercase tracking-widest text-white/35">{statConfig.label}</p>
            <div className="mt-0.5 flex items-baseline gap-1.5">
              <p className="font-mono text-base font-bold text-white tracking-tight">
                {formatStatValue(stat.value, statConfig)}
              </p>
              {stat.perLevel != null && (
                <span className="font-mono text-[0.5rem] text-white/25">+{stat.perLevel}/lvl</span>
              )}
            </div>
            {pct != null && (
              <div className="mt-1.5 h-1 w-full rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: accent.bar }} />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
