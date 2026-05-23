'use client';

import { createContext } from 'react';
import type { GameModule } from '../core/types';

export const GameContext = createContext<{
  selectedGame: GameModule | null;
  setSelectedGame: (g: GameModule | null) => void;
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
  closeNav: () => void;
}>({
  selectedGame: null,
  setSelectedGame: () => {},
  mobileNavOpen: false,
  setMobileNavOpen: () => {},
  closeNav: () => {},
});
