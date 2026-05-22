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

export default function StatBlock({ stats, config, columns = 2, className = '' }: Props) {
  const gridCols = columns === 3 ? 'grid-cols-3' : 'grid-cols-2'

  return (
    <div className={`grid ${gridCols} gap-2 ${className}`}>
      {stats.map((stat) => {
        const statConfig = config.find((s) => s.slug === stat.statName)
        if (!statConfig) return null

        return (
          <div
            key={stat.statName}
            className="rounded-xl border p-3"
            style={{
              borderColor: 'rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.03)',
            }}
          >
            <p className="text-[0.6rem] uppercase tracking-widest text-white/40">{statConfig.label}</p>
            <p className="mt-1 font-mono text-lg font-semibold tracking-tight text-white">
              {formatStatValue(stat.value, statConfig)}
            </p>
            {stat.perLevel != null && (
              <p className="mt-0.5 font-mono text-[0.6rem] text-white/30">
                +{stat.perLevel}/lvl
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}
