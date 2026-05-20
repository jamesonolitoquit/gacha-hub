import type { GameModule } from '../../core/types';
import { brownDust2Capabilities } from './capabilities';
import { brownDust2Routes } from './routes';
import { brownDust2Theme } from './theme';

export const brownDust2Module: GameModule = {
  id: 'browndust2',
  slug: 'brown-dust-2',
  name: 'Brown Dust 2',
  subdomain: 'browndust2.gachahub.com',
  bannerUrl: 'https://images.pexels.com/photos/13568045/pexels-photo-13568045.jpeg?cs=srgb&dl=pexels-steve-13568045.jpg&fm=jpg',
  routes: brownDust2Routes,
  theme: brownDust2Theme,
  capabilities: brownDust2Capabilities,
};