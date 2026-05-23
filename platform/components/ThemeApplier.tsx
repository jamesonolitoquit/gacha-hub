'use client';

import { useContext, useEffect } from 'react';
import { GameContext } from '../game-context';
import { useThemeVariables } from '../../shared/hooks/useThemeVariables';

export function ThemeApplier({ children }: { children: React.ReactNode }) {
  const ctx = useContext(GameContext);

  useEffect(() => {
    const html = document.documentElement;
    const game = ctx.selectedGame;

    if (game) {
      const vars = useThemeVariables(game.theme);
      Object.entries(vars).forEach(([key, val]) => {
        html.style.setProperty(key, val);
      });
      // Also set individual color hex values for inline use
      html.style.setProperty('--skr-primary-rgb', hexToRgb(game.theme.colors.primary));
      html.style.setProperty('--skr-secondary-rgb', hexToRgb(game.theme.colors.secondary));
      html.style.setProperty('--skr-background-rgb', hexToRgb(game.theme.colors.background));
      html.style.setProperty('--skr-surface-rgb', hexToRgb(game.theme.colors.surface));
      html.style.setProperty('--skr-text-rgb', hexToRgb(game.theme.colors.text));
      document.title = `${game.name} — GachaHub`;
    } else {
      // Reset to defaults
      const root = getComputedStyle(html);
      const defaults = {
        '--background': '#0b1020',
        '--foreground': '#f5f7fb',
        '--surface': '#141b31',
        '--accent': '#8ec5ff',
        '--accent-secondary': '#f6d37a',
        '--muted': 'rgba(255,255,255,0.55)',
        '--border-color': 'rgba(255,255,255,0.1)',
        '--glow-color': '#8ec5ff',
        '--font-heading': 'Georgia, \'Times New Roman\', serif',
        '--font-body': '\'Avenir Next\', \'Segoe UI\', \'Helvetica Neue\', Arial, sans-serif',
        '--body-gradient': '',
        '--panel-overlay': '',
        '--card-highlight': '',
        '--skr-primary-rgb': '',
        '--skr-secondary-rgb': '',
        '--skr-background-rgb': '',
        '--skr-surface-rgb': '',
        '--skr-text-rgb': '',
      };
      Object.entries(defaults).forEach(([key, val]) => {
        html.style.setProperty(key, val);
      });
      document.title = 'GachaHub';
    }
  }, [ctx.selectedGame]);

  return <>{children}</>;
}

function hexToRgb(hex: string) {
  const normalized = hex.replace('#', '').trim();
  if (normalized.length !== 6) return '255 255 255';
  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);
  if ([r, g, b].some(Number.isNaN)) return '255 255 255';
  return `${r} ${g} ${b}`;
}
