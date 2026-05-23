'use client';

import { useContext } from 'react';
import { GameContext } from '../game-context';

export function useCurrentGame() {
  const ctx = useContext(GameContext);
  const game = ctx.selectedGame;

  if (!game) {
    throw new Error('useCurrentGame must be used within a game route');
  }

  return game;
}
