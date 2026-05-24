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
      <div className="flex items-center justify-between border-b pb-3 mb-4" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <h1 id="skills-title" className="text-lg font-semibold">Skills</h1>
        <p className="text-xs text-white/40">{groups.length} groups</p>
      </div>

      <SkillList gameSlug={params.gameSlug} groups={groups} />
    </section>
  );
}
