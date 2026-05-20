import { useCurrentGame } from './useCurrentGame';

export function useGameTheme() {
  const game = useCurrentGame();
  return game.theme;
}
