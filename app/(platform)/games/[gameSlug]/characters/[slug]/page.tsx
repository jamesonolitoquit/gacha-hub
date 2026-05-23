import Link from 'next/link';
import { notFound } from 'next/navigation';
import { moduleRegistry } from '../../../../../../core/module-registry';
import { characterService } from '../../../../../../server/services/character.service';
import { gameService } from '../../../../../../server/services/game.service';
import { guideService } from '../../../../../../server/services/guide.service';
import { skillService } from '../../../../../../server/services/skill.service';
import { tierEntryService } from '../../../../../../server/services/tier-entry.service';

export const revalidate = 3600;
import { buildService } from '../../../../../../server/services/build.service';
import HeroDetail from '../../../../../../shared/components/HeroDetail';

type CharacterPageProps = {
  params: {
    gameSlug: string;
    slug: string;
  };
};

export async function generateStaticParams() {
  const games = moduleRegistry.list();
  const params: { gameSlug: string; slug: string }[] = [];

  for (const game of games) {
    const gameRecord = await gameService.getGameBySlug(game.slug);
    if (!gameRecord) continue;

    const characters = await characterService.listCharacters(gameRecord.id);
    for (const character of characters) {
      params.push({ gameSlug: game.slug, slug: character.slug });
    }
  }

  return params;
}

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

  const [roster, skills, guides, statValues, tierEntries, build] = await Promise.all([
    characterService.listCharacters(gameRecord.id),
    skillService.listSkillsForCharacter(character.id),
    guideService.listGuides(gameRecord.id, character.id),
    characterService.getCharacterStats(character.id),
    tierEntryService.getTiersForCharacter(gameRecord.id, character.id),
    buildService.getBuildForCharacter(gameRecord.id, character.slug),
  ]);

  const skillTypeLabels = game.taxonomies?.skillTypes
    ? Object.fromEntries(game.taxonomies.skillTypes.map((st: any) => [st.slug, st.label]))
    : undefined;

  const heroTiers = tierEntries.map((te: any) => ({
    mode: te.mode,
    tier: te.tier,
    previousTier: te.previousTier,
  }));

  return (
    <section aria-labelledby="character-title">
      <HeroDetail
        gameSlug={params.gameSlug}
        character={character}
        skills={skills}
        roster={roster}
        guides={guides}
        statValues={statValues}
        skillTypeLabels={skillTypeLabels}
        heroTiers={heroTiers}
        build={build}
      />
    </section>
  );
}
