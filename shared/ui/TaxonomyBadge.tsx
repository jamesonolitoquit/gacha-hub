import type { TaxonomyBadge as TaxonomyBadgeType } from '../types/taxonomies'

type Props = {
  taxonomy: TaxonomyBadgeType
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
  showLabel?: boolean
  className?: string
}

const sizes = {
  sm: 'text-[0.6rem] px-1.5 py-0.5 gap-1',
  md: 'text-[0.65rem] px-2 py-0.5 gap-1.5',
  lg: 'text-xs px-2.5 py-1 gap-1.5',
}

export default function TaxonomyBadge({ taxonomy, size = 'md', showIcon = false, showLabel = true, className = '' }: Props) {
  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold uppercase tracking-wider ${sizes[size]} ${className}`}
      style={{
        background: `${taxonomy.color}20`,
        border: `1px solid ${taxonomy.color}40`,
        color: taxonomy.textColor ?? taxonomy.color,
      }}
    >
      {showIcon && taxonomy.icon && (
        <span className="opacity-80">{taxonomy.icon}</span>
      )}
      {showLabel && taxonomy.label}
    </span>
  )
}
