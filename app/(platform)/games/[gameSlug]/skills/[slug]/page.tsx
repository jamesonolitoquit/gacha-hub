import Link from 'next/link';
import { notFound } from 'next/navigation';
import { moduleRegistry } from '../../../../../../core/module-registry';
import { characterService } from '../../../../../../server/services/character.service';
import { gameService } from '../../../../../../server/services/game.service';
import { skillService } from '../../../../../../server/services/skill.service';

type SkillPageProps = {
  params: {
    gameSlug: string;
    slug: string;
  };
};

export async function generateMetadata({ params }: SkillPageProps) {
  const game = moduleRegistry.get(params.gameSlug);

  if (!game) {
    return {};
  }

  return {
    title: `${params.slug} | ${game.name}`,
    description: `Skill details for ${params.slug} in ${game.name}.`,
  };
}

export default async function SkillPage({ params }: SkillPageProps) {
  const game = moduleRegistry.get(params.gameSlug);

  if (!game) {
    notFound();
  }

  const gameRecord = await gameService.getGameBySlug(params.gameSlug);

  if (!gameRecord) {
    notFound();
  }

  const skill = await skillService.getSkill(gameRecord.id, params.slug);

  if (!skill) {
    notFound();
  }

  const character = await characterService.getCharacterById(gameRecord.id, skill.characterId);

  return (
    <section aria-labelledby="skill-title" className="mx-auto max-w-4xl px-6 py-10">
      <p className="text-sm uppercase tracking-[0.3em] text-sky-300">{game.name}</p>
      <h1 id="skill-title" className="mt-3 text-4xl font-semibold">{skill.name}</h1>
      <p className="mt-3 max-w-2xl text-white/80">{skill.description}</p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="font-medium">Details</h2>
          <dl className="mt-3 space-y-2 text-sm text-white/80">
            <div className="flex justify-between gap-4"><dt>Type</dt><dd>{skill.type ?? 'Unknown'}</dd></div>
            <div className="flex justify-between gap-4"><dt>Cooldown</dt><dd>{skill.cooldownTurns ?? 'N/A'}</dd></div>
            <div className="flex justify-between gap-4"><dt>Cost</dt><dd>{skill.cost ?? 'N/A'}</dd></div>
            <div className="flex justify-between gap-4"><dt>Power</dt><dd>{skill.powerType ?? 'N/A'}</dd></div>
            <div className="flex justify-between gap-4"><dt>Scaling</dt><dd>{skill.scalingStat ?? 'N/A'}</dd></div>
            <div className="flex justify-between gap-4"><dt>Targets</dt><dd>{skill.targets ?? 'N/A'}</dd></div>
            <div className="flex justify-between gap-4"><dt>Range</dt><dd>{skill.rangeType ?? 'N/A'}</dd></div>
          </dl>
        </article>

        <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="font-medium">Character</h2>
          <p className="mt-2 text-sm text-white/75 font-medium">{character?.name ?? 'Unknown character'}</p>
          {character ? (
            <Link
              href={`/games/${game.slug}/characters/${character.slug}`}
              className="mt-4 inline-flex min-h-11 items-center rounded-full border border-white/10 px-4 py-2 text-sm text-white/80 transition hover:border-sky-300/40 hover:bg-white/10 focus-visible:border-sky-300/55 focus-visible:bg-white/15"
            >
              View character
            </Link>
          ) : null}
        </article>
      </div>
    </section>
  );
}
