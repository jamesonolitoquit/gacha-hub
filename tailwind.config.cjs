/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx,js,jsx}',
    './core/**/*.{ts,tsx,js,jsx}',
    './games/**/*.{ts,tsx,js,jsx}',
    './platform/**/*.{ts,tsx,js,jsx}',
    './shared/**/*.{ts,tsx,js,jsx}',
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
