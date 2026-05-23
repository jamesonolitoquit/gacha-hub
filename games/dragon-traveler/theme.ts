import type { GameTheme } from '../../core/types';

export const dragonTravelerTheme: GameTheme = {
  name: 'dragon-traveler',
  label: 'Oceanic Adventure',
  colors: {
    primary: '#2bd9ff',
    secondary: '#ffd166',
    background: '#061620',
    surface: '#102939',
    text: '#eefbff',
    muted: 'rgba(238,251,255,0.55)',
    border: 'rgba(43,217,255,0.2)',
    glow: '#2bd9ff',
  },
  fonts: {
    heading: 'Georgia, serif',
    body: 'system-ui, sans-serif',
  },
  backgrounds: {
    body: 'radial-gradient(circle at 18% 12%, rgba(43,217,255,0.18), transparent 0 22%), radial-gradient(circle at 82% 14%, rgba(255,209,102,0.12), transparent 0 24%), radial-gradient(circle at 50% 0%, rgba(43,217,255,0.08), transparent 0 18%), linear-gradient(180deg, #041018 0%, #061620 42%, #0a2438 100%)',
    panelOverlay: 'linear-gradient(135deg, rgba(43,217,255,0.06), rgba(255,209,102,0.04), transparent 60%)',
    cardHighlight: 'linear-gradient(135deg, rgba(43,217,255,0.08), transparent 35%, rgba(255,209,102,0.04))',
  },
  logo: {
    iconUrl: 'https://images.pexels.com/photos/27198038/pexels-photo-27198038.jpeg',
    monogram: 'DT',
  },
};
