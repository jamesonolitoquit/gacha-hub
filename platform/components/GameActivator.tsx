'use client';

import { ReactNode, useContext, useEffect } from 'react';
import { GameContext } from '../game-context';
import type { GameModule } from '../../core/types';
import { RuntimeShell } from '../../core/runtime-shell';

export function GameActivator({ game, children }: { game: GameModule; children: ReactNode }) {
  const ctx = useContext(GameContext);

  useEffect(() => {
    ctx.setSelectedGame(game);
    return () => ctx.setSelectedGame(null);
  }, [game.slug]);

  return (
    <RuntimeShell game={game}>
      {children}
    </RuntimeShell>
  );
}
