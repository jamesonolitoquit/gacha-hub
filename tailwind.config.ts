import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './core/**/*.{ts,tsx}',
    './games/**/*.{ts,tsx}',
    './platform/**/*.{ts,tsx}',
    './shared/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        surface: 'var(--surface)',
        accent: 'var(--accent)',
      },
    },
  },
  plugins: [],
};

export default config;
