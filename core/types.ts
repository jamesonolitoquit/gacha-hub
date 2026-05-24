import type { GameTaxonomyConfig, NavItem } from '../shared/types/taxonomies'

export type GameCapabilities = {
  tools: Record<string, boolean>;
  content: Record<string, boolean>;
  community: Record<string, boolean>;
};

export type GameThemeColors = {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  muted?: string;
  border?: string;
  glow?: string;
};

export type GameThemeFonts = {
  heading: string;
  body: string;
};

export type GameThemeBackgrounds = {
  body?: string;
  panelOverlay?: string;
  cardHighlight?: string;
};

export type GameThemeLogo = {
  iconUrl?: string;
  monogram?: string;
};

export type GameTheme = {
  name: string;
  label?: string;
  colors: GameThemeColors;
  fonts: GameThemeFonts;
  backgrounds?: GameThemeBackgrounds;
  logo?: GameThemeLogo;
};

export type GameSeoConfig = {
  title: string;
  description: string;
  keywords: string[];
  intro: string;
  footerContent: string;
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
  seo?: GameSeoConfig;
  renderers?: Record<string, unknown>;
};
