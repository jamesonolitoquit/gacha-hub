import type { GameTheme } from '../../core/types';

export function useThemeVariables(theme: GameTheme) {
  return {
    '--background': theme.colors.background,
    '--foreground': theme.colors.text,
    '--surface': theme.colors.surface,
    '--accent': theme.colors.primary,
    '--accent-secondary': theme.colors.secondary,
    '--muted': theme.colors.muted ?? 'rgba(255,255,255,0.55)',
    '--border-color': theme.colors.border ?? 'rgba(255,255,255,0.1)',
    '--glow-color': theme.colors.glow ?? theme.colors.primary,
    '--font-heading': theme.fonts.heading,
    '--font-body': theme.fonts.body,
    '--body-gradient': theme.backgrounds?.body ?? '',
    '--panel-overlay': theme.backgrounds?.panelOverlay ?? '',
    '--card-highlight': theme.backgrounds?.cardHighlight ?? '',
  } as Record<string, string>;
}
