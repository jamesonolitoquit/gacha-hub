export const rarityColors: Record<string, string> = {
  'legendary-pp': '#ff4444',
  'legendary-p': '#ff6b6b',
  'legendary': '#ffd700',
  'rare': '#9b59b6',
  'common': '#95a5a6',
}

export const classColors: Record<string, string> = {
  'attack': '#e74c3c',
  'defense': '#3498db',
  'magic': '#9b59b6',
  'support': '#2ecc71',
  'universal': '#f39c12',
}

export const tierColors: Record<string, string> = {
  'SSS': '#ff4444',
  'SS': '#ffd700',
  'S': '#00c851',
  'A': '#33b5e5',
  'B': '#aa66cc',
  'C': '#ffbb33',
  'D': '#888888',
}

export const elementColors: Record<string, string> = {
  'fire': '#e74c3c',
  'ice': '#3498db',
  'light': '#f1c40f',
  'dark': '#8e44ad',
}

export const surfaceVariants = {
  card: 'rgba(255,255,255,0.03)',
  cardHover: 'rgba(255,255,255,0.06)',
  cardActive: 'rgba(255,255,255,0.08)',
  border: 'rgba(255,255,255,0.08)',
  borderHover: 'rgba(255,255,255,0.15)',
  overlay: 'rgba(10,15,24,0.72)',
} as const

export const spacing = {
  section: 'mt-8',
  panel: 'p-6 lg:p-8',
  gridGap: 'gap-6',
} as const

export const layout = {
  maxWidth: 'max-w-[1600px]',
  padding: 'px-6 xl:px-10',
  grid3Col: 'grid-cols-[320px_minmax(0,1fr)_300px]',
} as const
