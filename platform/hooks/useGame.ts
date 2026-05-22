'use client';

import { useContext } from 'react';
import { GameContext } from '../game-context';
import type { GameModule } from '../../core/types';

export function useGame(): GameModule | null {
  return useContext(GameContext);
}
