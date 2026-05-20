import { type CSSProperties, type ReactNode } from 'react';
import type { GameModule } from './types';
import { useThemeVariables } from '../shared/hooks/useThemeVariables';

export function RuntimeShell({ game, children }: { game?: GameModule; children: ReactNode }) {
  const themeVars = game ? useThemeVariables(game.theme) : {};
  const shellStyles: CSSProperties = {
    ...themeVars,
    backgroundColor: 'var(--background)',
    color: 'var(--foreground)',
    fontFamily: 'var(--font-body, Inter, system-ui, sans-serif)',
  };

  return (
    <div style={shellStyles}>
      {children}
    </div>
  );
}
