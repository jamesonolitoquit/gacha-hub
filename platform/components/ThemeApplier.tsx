'use client';

import { useContext, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { GameContext } from '../game-context';
import { useThemeVariables } from '../../shared/hooks/useThemeVariables';

const GAME_ROUTE_RE = /^\/games\/[^/]+/;

const DEFAULT_VARS: Record<string, string> = {
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

function applyVars(vars: Record<string, string>) {
  const html = document.documentElement;
  Object.entries(vars).forEach(([key, val]) => {
    html.style.setProperty(key, val);
  });
}

export function ThemeApplier({ children }: { children: React.ReactNode }) {
  const ctx = useContext(GameContext);
  const pathname = usePathname();
  const lastThemeRef = useRef<string | null>(null);

  const isGameRoute = GAME_ROUTE_RE.test(pathname);

  useEffect(() => {
    if (!isGameRoute) {
      if (lastThemeRef.current !== null) {
        applyVars(DEFAULT_VARS);
        lastThemeRef.current = null;
        document.title = 'GachaHub';
      }
      return;
    }

    const game = ctx.selectedGame;
    const theme = game?.theme;
    if (!theme) return;

    const themeKey = `${theme.colors.primary}|${theme.colors.secondary}|${theme.colors.background}|${theme.colors.surface}|${theme.colors.text}`;
    if (themeKey === lastThemeRef.current) return;
    lastThemeRef.current = themeKey;

    const vars = useThemeVariables(theme);
    applyVars(vars);

    const el = document.documentElement;
    el.style.setProperty('--skr-primary-rgb', hexToRgb(theme.colors.primary));
    el.style.setProperty('--skr-secondary-rgb', hexToRgb(theme.colors.secondary));
    el.style.setProperty('--skr-background-rgb', hexToRgb(theme.colors.background));
    el.style.setProperty('--skr-surface-rgb', hexToRgb(theme.colors.surface));
    el.style.setProperty('--skr-text-rgb', hexToRgb(theme.colors.text));
    document.title = `${game.name} — GachaHub`;
  }, [isGameRoute, ctx.selectedGame]);

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
