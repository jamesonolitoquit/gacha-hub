import type { GameModule } from '../../core/types';
import { sevenKnightsRebirthCapabilities } from './capabilities';
import { sevenKnightsRebirthRoutes } from './routes';
import { sevenKnightsRebirthTheme } from './theme';

export const sevenKnightsRebirthModule: GameModule = {
  id: 'sevenknightsrebirth',
  slug: 'seven-knights-rebirth',
  name: 'Seven Knights: Rebirth',
  subdomain: 'sevenknightsrebirth.gachahub.com',
  bannerUrl: 'https://sgimage.netmarble.com/mobile/game/tskgb/brand/v1/img/1f38443c069c.png',
  routes: sevenKnightsRebirthRoutes,
  theme: sevenKnightsRebirthTheme,
  capabilities: sevenKnightsRebirthCapabilities,
};
