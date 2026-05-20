'use client';

import { createContext } from 'react';
import type { GameModule } from '../core/types';

export const GameContext = createContext<GameModule | null>(null);
