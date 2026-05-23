import type { GameTheme } from '../../core/types';

export const brownDust2Theme: GameTheme = {
  name: 'brown-dust-2',
  label: 'Warm Rustic',
  colors: {
    primary: '#d88b5c',
    secondary: '#f5d27a',
    background: '#20140f',
    surface: '#372419',
    text: '#fff4ea',
    muted: 'rgba(255,244,234,0.55)',
    border: 'rgba(216,139,92,0.2)',
    glow: '#d88b5c',
  },
  fonts: {
    heading: 'Georgia, serif',
    body: 'system-ui, sans-serif',
  },
  backgrounds: {
    body: 'radial-gradient(circle at 14% 18%, rgba(216,139,92,0.16), transparent 0 22%), radial-gradient(circle at 80% 12%, rgba(245,210,122,0.12), transparent 0 24%), radial-gradient(circle at 50% 0%, rgba(216,139,92,0.06), transparent 0 18%), linear-gradient(180deg, #140c08 0%, #20140f 42%, #2e1c14 100%)',
    panelOverlay: 'linear-gradient(135deg, rgba(216,139,92,0.06), rgba(245,210,122,0.04), transparent 60%)',
    cardHighlight: 'linear-gradient(135deg, rgba(216,139,92,0.08), transparent 35%, rgba(245,210,122,0.04))',
  },
  logo: {
    iconUrl: 'https://images.pexels.com/photos/13568045/pexels-photo-13568045.jpeg',
    monogram: 'BD',
  },
};
