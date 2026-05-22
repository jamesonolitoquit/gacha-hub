export type TaxonomyBadge = {
  slug: string
  label: string
  color: string
  textColor?: string
  icon?: string
  sortOrder: number
}

export type GameClass = TaxonomyBadge

export type GameRarity = TaxonomyBadge & {
  stars: number
}

export type GameElement = TaxonomyBadge

export type GameStat = {
  slug: string
  label: string
  suffix: string
  format: 'integer' | 'decimal' | 'percentage'
  group: 'primary' | 'secondary' | 'defensive'
}

export type GameTierConfig = {
  tiers: string[]
  colors: Record<string, string>
  collapsedDefault: string[]
}

export type GameAcquisition = {
  type: string
  label: string
  details?: string
}

export type GameSkillType = {
  slug: string
  label: string
  color?: string
}

export type GameGuideType = {
  slug: string
  label: string
  color: string
}

export type GameTaxonomyConfig = {
  classes: GameClass[]
  rarities: GameRarity[]
  elements: GameElement[]
  tiers: GameTierConfig
  stats: GameStat[]
  acquisitions?: GameAcquisition[]
  skillTypes?: GameSkillType[]
  guideTypes?: GameGuideType[]
}

export type NavItem = {
  slug: string
  label: string
  page?: string
  children?: NavItem[]
}
