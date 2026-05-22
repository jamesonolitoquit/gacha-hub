import type { GameModule } from '../../core/types';
import { dragonTravelerCapabilities } from './capabilities';
import { dragonTravelerRoutes } from './routes';
import { dragonTravelerTheme } from './theme';
import { dtTaxonomies, dtNav } from './config';

export const dragonTravelerModule: GameModule = {
  id: 'dragontraveler',
  slug: 'dragon-traveler',
  name: 'Dragon Traveler',
  subdomain: 'dragontraveler.gachahub.com',
  bannerUrl: 'https://images.pexels.com/photos/27198038/pexels-photo-27198038.jpeg?cs=srgb&dl=pexels-diva-27198038.jpg&fm=jpg',
  routes: dragonTravelerRoutes,
  theme: dragonTravelerTheme,
  capabilities: dragonTravelerCapabilities,
  taxonomies: dtTaxonomies,
  nav: dtNav,
};