import type { GameTaxonomyConfig, NavItem } from '../../shared/types/taxonomies'

export const skrTaxonomies: GameTaxonomyConfig = {
  classes: [
    { slug: 'attack',    label: 'Attack',    color: '#e74c3c', icon: 'sword',  sortOrder: 0 },
    { slug: 'defense',   label: 'Defense',   color: '#3498db', icon: 'shield', sortOrder: 1 },
    { slug: 'magic',     label: 'Magic',     color: '#9b59b6', icon: 'staff',  sortOrder: 2 },
    { slug: 'support',   label: 'Support',   color: '#2ecc71', icon: 'heart',  sortOrder: 3 },
    { slug: 'universal', label: 'Universal', color: '#f39c12', icon: 'star',   sortOrder: 4 },
  ],

  rarities: [
    { slug: 'legendary-pp', label: 'Legendary++', stars: 5, color: '#ff4444',   sortOrder: 4 },
    { slug: 'legendary-p',  label: 'Legendary+',  stars: 4, color: '#ff6b6b',   sortOrder: 3 },
    { slug: 'legendary',    label: 'Legendary',   stars: 3, color: '#ffd700',   sortOrder: 2 },
    { slug: 'rare',         label: 'Rare',        stars: 2, color: '#9b59b6',   sortOrder: 1 },
    { slug: 'common',       label: 'Common',      stars: 1, color: '#95a5a6',   sortOrder: 0 },
  ],

  elements: [
    { slug: 'fire',  label: 'Fire',  color: '#e74c3c', sortOrder: 0 },
    { slug: 'ice',   label: 'Ice',   color: '#3498db', sortOrder: 1 },
    { slug: 'light', label: 'Light', color: '#f1c40f', sortOrder: 2 },
    { slug: 'dark',  label: 'Dark',  color: '#8e44ad', sortOrder: 3 },
  ],

  tiers: {
    tiers: ['SSS', 'SS', 'S', 'A', 'B', 'C', 'D'],
    colors: {
      SSS: '#ff4444',
      SS:  '#ffd700',
      S:   '#00c851',
      A:   '#33b5e5',
      B:   '#aa66cc',
      C:   '#ffbb33',
      D:   '#888888',
    },
    collapsedDefault: ['C', 'D'],
  },

  stats: [
    { slug: 'atk',  label: 'ATK',  suffix: '',      format: 'integer',    group: 'primary' },
    { slug: 'def',  label: 'DEF',  suffix: '',      format: 'integer',    group: 'defensive' },
    { slug: 'hp',   label: 'HP',   suffix: '',      format: 'integer',    group: 'defensive' },
    { slug: 'spd',  label: 'SPD',  suffix: '',      format: 'integer',    group: 'secondary' },
    { slug: 'crit', label: 'Crit', suffix: '%',     format: 'percentage', group: 'secondary' },
    { slug: 'crit-dmg', label: 'Crit DMG', suffix: '%', format: 'percentage', group: 'secondary' },
  ],

  acquisitions: [
    { type: 'gacha',   label: 'Gacha Summon' },
    { type: 'story',   label: 'Story Clear' },
    { type: 'event',   label: 'Limited Event' },
    { type: 'shop',    label: 'Shop Purchase' },
    { type: 'crafting', label: 'Crafting' },
  ],

  skillTypes: [
    { slug: 'passive',      label: 'Passive' },
    { slug: 'basic-attack', label: 'Basic' },
    { slug: 'skill-1',      label: 'S1' },
    { slug: 'skill-2',      label: 'S2' },
    { slug: 'awakened',     label: 'Ult' },
  ],

  guideTypes: [
    { slug: 'progression', label: 'Progression', color: '#33b5e5' },
    { slug: 'farming',     label: 'Farming',     color: '#00c851' },
    { slug: 'boss',        label: 'Boss',        color: '#ff4444' },
    { slug: 'team-comp',   label: 'Team Comp',   color: '#aa66cc' },
    { slug: 'build',       label: 'Build',       color: '#ffbb33' },
  ],
}

export const skrNav: NavItem[] = [
  { slug: 'overview', label: 'Overview', page: 'index' },
  { slug: 'roster', label: 'Roster', page: 'characters' },
  { slug: 'tier-lists', label: 'Tier Lists', page: 'tier-lists' },
  { slug: 'builds', label: 'Builds', page: 'builds' },
  { slug: 'teams', label: 'Teams', page: 'teams' },
  {
    slug: 'database', label: 'Database', children: [
      { slug: 'heroes', label: 'Heroes', page: 'characters' },
      { slug: 'skills', label: 'Skills', page: 'skills' },
      { slug: 'gear', label: 'Gear', page: 'database/gear' },
      { slug: 'pets', label: 'Pets', page: 'database/pets' },
    ],
  },
  { slug: 'guides', label: 'Guides', page: 'guides' },
  { slug: 'tools', label: 'Tools', page: 'index' },
  { slug: 'updates', label: 'Updates', page: 'patches' },
]
