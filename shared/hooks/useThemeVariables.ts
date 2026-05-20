import type { GameTheme } from '../../core/types';

export function useThemeVariables(theme: GameTheme) {
  return {
    '--background': theme.colors.background,
    '--foreground': theme.colors.text,
    '--surface': theme.colors.surface,
    '--accent': theme.colors.primary,
    '--accent-secondary': theme.colors.secondary,
    '--font-heading': theme.fonts.heading,
    '--font-body': theme.fonts.body,
  } as Record<string, string>;
}
