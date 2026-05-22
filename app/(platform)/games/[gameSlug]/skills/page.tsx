import { notFound } from 'next/navigation';
import { moduleRegistry } from '../../../../../core/module-registry';
import { gameService } from '../../../../../server/services/game.service';
import { skillService } from '../../../../../server/services/skill.service';
import SkillList from '../../../../../shared/components/SkillList';

type PageProps = {
  params: {
    gameSlug: string;
  };
};

export async function generateMetadata({ params }: PageProps) {
  const game = moduleRegistry.get(params.gameSlug);

  if (!game) return {};

  return {
    title: `${game.name} — Skills`,
    description: `Browse skills for ${game.name}`,
  };
}

export default async function SkillsIndexPage({ params }: PageProps) {
  const game = moduleRegistry.get(params.gameSlug);

  if (!game) notFound();

  const gameRecord = await gameService.getGameBySlug(params.gameSlug);

  if (!gameRecord) notFound();

  const groups = await skillService.listSkillsForGame(gameRecord.id);

  return (
    <section aria-labelledby="skills-title">
      <p className="text-sm uppercase tracking-[0.3em] text-sky-300">{game.name}</p>
      <h1 id="skills-title" className="mt-3 text-4xl font-semibold">Skills</h1>
      <p className="mt-3 max-w-2xl text-white/80">Browse skills and their details grouped by character.</p>

      <div className="mt-6">
        <SkillList gameSlug={params.gameSlug} groups={groups} />
      </div>
    </section>
  );
}
