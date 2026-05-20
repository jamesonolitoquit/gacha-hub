import Link from 'next/link';
import { notFound } from 'next/navigation';
import { moduleRegistry } from '../../../../../../core/module-registry';
import { characterService } from '../../../../../../server/services/character.service';
import { gameService } from '../../../../../../server/services/game.service';
import { skillService } from '../../../../../../server/services/skill.service';

type CharacterPageProps = {
  params: {
    gameSlug: string;
    slug: string;
  };
};

export async function generateMetadata({ params }: CharacterPageProps) {
  const game = moduleRegistry.get(params.gameSlug);

  if (!game) {
    return {};
  }

  return {
    title: `${params.slug} | ${game.name}`,
    description: `Character details for ${params.slug} in ${game.name}.`,
  };
}

export default async function CharacterPage({ params }: CharacterPageProps) {
  const game = moduleRegistry.get(params.gameSlug);

  if (!game) {
    notFound();
  }

  const gameRecord = await gameService.getGameBySlug(params.gameSlug);

  if (!gameRecord) {
    notFound();
  }

  const character = await characterService.getCharacter(gameRecord.id, params.slug);

  if (!character) {
    notFound();
  }

  const skills = await skillService.listSkillsForCharacter(character.id);

  return (
    <section aria-labelledby="character-title" className="mx-auto max-w-6xl px-6 py-10">
      <p className="text-sm uppercase tracking-[0.3em] text-sky-300">{game.name}</p>
      <h1 id="character-title" className="mt-3 text-4xl font-semibold">{character.name}</h1>
      <p className="mt-3 max-w-2xl text-white/80">
        Character detail pages will render from the shared runtime shell and database content.
      </p>

      <div className="mt-10">
        <h2 className="text-2xl font-semibold">Skills</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {skills.length > 0 ? (
            skills.map((skill) => (
              <Link
                key={skill.id}
                href={`/games/${game.slug}/skills/${skill.slug}`}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-sky-300/40 hover:bg-white/10 focus-visible:border-sky-300/55 focus-visible:bg-white/15"
              >
                <p className="text-xs uppercase tracking-[0.25em] text-sky-300">{skill.type ?? 'Skill'}</p>
                <h3 className="mt-2 text-xl font-medium">{skill.name}</h3>
                <p className="mt-2 text-sm text-white/75 font-medium">{skill.description}</p>
              </Link>
            ))
          ) : (
            <p className="text-white/75">No skills registered for this character yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}
