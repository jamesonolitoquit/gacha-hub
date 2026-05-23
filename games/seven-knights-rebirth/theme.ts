import type { GameTheme } from '../../core/types';

export const sevenKnightsRebirthTheme: GameTheme = {
  name: 'seven-knights-rebirth',
  label: 'Dark Mystic',
  colors: {
    primary: '#7c5cff',
    secondary: '#f4c542',
    background: '#120f1f',
    surface: '#221b36',
    text: '#f4f1ff',
    muted: 'rgba(244,241,255,0.55)',
    border: 'rgba(124,92,255,0.2)',
    glow: '#7c5cff',
  },
  fonts: {
    heading: 'Georgia, serif',
    body: 'system-ui, sans-serif',
  },
  backgrounds: {
    body: 'radial-gradient(circle at 12% 16%, rgba(124,92,255,0.20), transparent 0 22%), radial-gradient(circle at 84% 10%, rgba(244,197,66,0.12), transparent 0 24%), radial-gradient(circle at 50% 0%, rgba(124,92,255,0.08), transparent 0 18%), linear-gradient(180deg, #0a0716 0%, #120f1f 42%, #1c1530 100%)',
    panelOverlay: 'linear-gradient(135deg, rgba(124,92,255,0.06), rgba(244,197,66,0.04), transparent 60%)',
    cardHighlight: 'linear-gradient(135deg, rgba(124,92,255,0.08), transparent 35%, rgba(244,197,66,0.04))',
  },
  logo: {
    iconUrl: 'https://sgimage.netmarble.com/mobile/game/tskgb/brand/v1/img/1f38443c069c.png',
    monogram: 'SK',
  },
};
