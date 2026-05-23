import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import { moduleRegistry } from '@/core/module-registry';
import { GameActivator } from '@/platform/components/GameActivator';

export default function SkrLayout({ children }: { children: ReactNode }) {
  const game = moduleRegistry.get('seven-knights-rebirth');

  if (!game) {
    notFound();
  }

  return (
    <GameActivator game={game}>
      <section id="game-main" className="mx-auto w-full max-w-[1600px] px-6 py-8 xl:px-10">
        {children}
      </section>
    </GameActivator>
  );
}
