import { useContext } from 'react';
import { GameContext } from '../game-context';

export function useCurrentGame() {
  const game = useContext(GameContext);

  if (!game) {
    throw new Error('useCurrentGame must be used within a GameContext provider');
  }

  return game;
}
