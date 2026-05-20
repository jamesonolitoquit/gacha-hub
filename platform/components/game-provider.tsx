'use client';

import { ReactNode } from 'react';
import { GameContext } from '../game-context';
import type { GameModule } from '../../core/types';

export function GameProvider({ game, children }: { game: GameModule; children: ReactNode }) {
  return <GameContext.Provider value={game}>{children}</GameContext.Provider>;
}
