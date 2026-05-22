import type { GameTaxonomyConfig, NavItem } from '../shared/types/taxonomies'

export type GameCapabilities = {
  tools: Record<string, boolean>;
  content: Record<string, boolean>;
  community: Record<string, boolean>;
};

export type GameTheme = {
  name: string;
  colors: Record<string, string>;
  fonts: Record<string, string>;
};

export type GameRoute = {
  pattern?: string;
  component?: unknown;
};

export type GameModule = {
  id: string;
  slug: string;
  name: string;
  subdomain: string;
  bannerUrl?: string;
  taxonomies?: GameTaxonomyConfig;
  nav?: NavItem[];
  routes: Record<string, GameRoute>;
  theme: GameTheme;
  capabilities: GameCapabilities;
  renderers?: Record<string, unknown>;
};
