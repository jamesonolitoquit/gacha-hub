'use client';

import { ReactNode, useCallback, useState } from 'react';
import { GameContext } from '../game-context';
import type { GameModule } from '../../core/types';

export function GameProvider({ game, children }: { game?: GameModule | null; children: ReactNode }) {
  const [selectedGame, setSelectedGame] = useState<GameModule | null>(game ?? null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const closeNav = useCallback(() => {
    setMobileNavOpen(false);
  }, []);

  return (
    <GameContext.Provider
      value={{
        selectedGame,
        setSelectedGame,
        mobileNavOpen,
        setMobileNavOpen,
        closeNav,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
