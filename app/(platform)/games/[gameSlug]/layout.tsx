import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import { moduleRegistry } from '../../../../core/module-registry';
import { GameActivator } from '../../../../platform/components/GameActivator';

type Props = {
  children: ReactNode;
  params: { gameSlug: string };
};

export default function GameLayout({ children, params }: Props) {
  const game = moduleRegistry.get(params.gameSlug);

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
