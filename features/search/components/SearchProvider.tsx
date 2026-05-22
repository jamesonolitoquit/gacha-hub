'use client';

import { type ReactNode } from 'react';
import dynamic from 'next/dynamic';

const CommandPalette = dynamic(() => import('./CommandPalette'), { ssr: false });

type SearchEntry = {
  label: string;
  description: string;
  href: string;
  type: 'hero' | 'skill' | 'guide' | 'gear' | 'pet';
};

type Props = {
  entries?: SearchEntry[];
  gameSlug?: string;
  children: ReactNode;
};

export default function SearchProvider({ entries = [], gameSlug, children }: Props) {
  return (
    <>
      <CommandPalette entries={entries} gameSlug={gameSlug} />
      {children}
    </>
  );
}
