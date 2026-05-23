import type { GameTaxonomyConfig, NavItem } from '../../shared/types/taxonomies'

export const dtTaxonomies: GameTaxonomyConfig = {
  classes: [
    { slug: 'warrior',  label: 'Warrior',  color: '#e74c3c', icon: 'sword',   sortOrder: 0 },
    { slug: 'mage',     label: 'Mage',     color: '#9b59b6', icon: 'staff',   sortOrder: 1 },
    { slug: 'rogue',    label: 'Rogue',    color: '#2ecc71', icon: 'dagger',  sortOrder: 2 },
    { slug: 'archer',   label: 'Archer',   color: '#f39c12', icon: 'bow',     sortOrder: 3 },
    { slug: 'healer',   label: 'Healer',   color: '#3498db', icon: 'heart',   sortOrder: 4 },
  ],

  rarities: [
    { slug: 'five-star',  label: '5★', stars: 5, color: '#ffd700',  sortOrder: 4 },
    { slug: 'four-star',  label: '4★', stars: 4, color: '#9b59b6',  sortOrder: 3 },
    { slug: 'three-star', label: '3★', stars: 3, color: '#3498db',  sortOrder: 2 },
    { slug: 'two-star',   label: '2★', stars: 2, color: '#2ecc71',  sortOrder: 1 },
    { slug: 'one-star',   label: '1★', stars: 1, color: '#95a5a6',  sortOrder: 0 },
  ],

  elements: [
    { slug: 'fire',  label: 'Fire',  color: '#e74c3c', sortOrder: 0 },
    { slug: 'water', label: 'Water', color: '#3498db', sortOrder: 1 },
    { slug: 'wind',  label: 'Wind',  color: '#2ecc71', sortOrder: 2 },
    { slug: 'light', label: 'Light', color: '#f1c40f', sortOrder: 3 },
    { slug: 'dark',  label: 'Dark',  color: '#8e44ad', sortOrder: 4 },
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
    { slug: 'atk',       label: 'ATK',      suffix: '',      format: 'integer',    group: 'primary' },
    { slug: 'def',       label: 'DEF',      suffix: '',      format: 'integer',    group: 'defensive' },
    { slug: 'hp',        label: 'HP',       suffix: '',      format: 'integer',    group: 'defensive' },
    { slug: 'spd',       label: 'SPD',      suffix: '',      format: 'integer',    group: 'secondary' },
    { slug: 'crit',      label: 'Crit',     suffix: '%',     format: 'percentage', group: 'secondary' },
    { slug: 'crit-dmg',  label: 'Crit DMG', suffix: '%',     format: 'percentage', group: 'secondary' },
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
    { slug: 'active',       label: 'Active' },
    { slug: 'ultimate',     label: 'Ult' },
  ],

  guideTypes: [
    { slug: 'progression', label: 'Progression', color: '#33b5e5' },
    { slug: 'farming',     label: 'Farming',     color: '#00c851' },
    { slug: 'boss',        label: 'Boss',        color: '#ff4444' },
    { slug: 'team-comp',   label: 'Team Comp',   color: '#aa66cc' },
    { slug: 'build',       label: 'Build',       color: '#ffbb33' },
  ],
}

export const dtNav: NavItem[] = [
  { slug: 'overview', label: 'Overview', page: 'index', icon: 'LayoutDashboard' },
  { slug: 'roster', label: 'Roster', page: 'characters', icon: 'Users' },
  { slug: 'tier-lists', label: 'Tier Lists', page: 'tier-lists', icon: 'BarChart3' },
  { slug: 'builds', label: 'Builds', page: 'builds', icon: 'Wrench' },
  { slug: 'teams', label: 'Teams', page: 'teams', icon: 'Users2' },
  {
    slug: 'database', label: 'Database', icon: 'Database', children: [
      { slug: 'heroes', label: 'Heroes', page: 'characters', icon: 'User' },
      { slug: 'skills', label: 'Skills', page: 'skills', icon: 'Sparkles' },
    ],
  },
  { slug: 'guides', label: 'Guides', page: 'guides', icon: 'BookOpen' },
  { slug: 'updates', label: 'Updates', page: 'patches', icon: 'Megaphone' },
]
