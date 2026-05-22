import type { GameTierConfig } from '../types/taxonomies'

type Props = {
  tier: string
  config: GameTierConfig
  size?: 'sm' | 'md' | 'lg'
  previousTier?: string
  className?: string
}

const sizes = {
  sm: 'text-[0.65rem] px-1.5 py-0.5',
  md: 'text-xs px-2 py-0.5',
  lg: 'text-sm px-3 py-1',
}

export default function TierBadge({ tier, config, size = 'md', previousTier, className = '' }: Props) {
  const color = config.colors[tier] ?? '#888888'

  return (
    <span
      className={`inline-flex items-center gap-1 rounded font-bold tracking-tight ${sizes[size]} ${className}`}
      style={{
        background: `${color}20`,
        border: `1px solid ${color}50`,
        color: color,
      }}
    >
      <span>{tier}</span>
      {previousTier && previousTier !== tier && (
        <span className="text-[0.6em] opacity-80">
          ↑from {previousTier}
        </span>
      )}
    </span>
  )
}
