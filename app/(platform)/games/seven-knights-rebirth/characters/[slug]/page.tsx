import { notFound } from 'next/navigation';
import { moduleRegistry } from '@/core/module-registry';
import { characterService } from '@/server/services/character.service';
import { gameService } from '@/server/services/game.service';
import { skillService } from '@/server/services/skill.service';
import { guideService } from '@/server/services/guide.service';
import { tierEntryService } from '@/server/services/tier-entry.service';
import { buildService } from '@/server/services/build.service';
import SkrHeroDetail from '@/shared/components/skr/SkrHeroDetail';

type Props = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  const game = moduleRegistry.get('seven-knights-rebirth');
  if (!game) return [];

  const gameRecord = await gameService.getGameBySlug('seven-knights-rebirth');
  if (!gameRecord) return [];

  const characters = await characterService.listCharacters(gameRecord.id);
  return characters.map((c: any) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props) {
  const game = moduleRegistry.get('seven-knights-rebirth');
  if (!game) return {};

  const gameRecord = await gameService.getGameBySlug('seven-knights-rebirth');
  if (!gameRecord) return {};

  const character = await characterService.getCharacter(gameRecord.id, params.slug);
  if (!character) return {};

  return {
    title: `${character.name} | ${game.name}`,
    description: `${character.name} details for ${game.name}.`,
  };
}

export default async function SkrCharacterDetailPage({ params }: Props) {
  const game = moduleRegistry.get('seven-knights-rebirth');
  if (!game) notFound();

  const gameRecord = await gameService.getGameBySlug('seven-knights-rebirth');
  if (!gameRecord) notFound();

  const character = await characterService.getCharacter(gameRecord.id, params.slug);
  if (!character) notFound();

  const [roster, skills, guides, statValues] = await Promise.all([
    characterService.listCharacters(gameRecord.id),
    skillService.listSkillsForCharacter(character.id),
    guideService.listGuides(gameRecord.id, character.id),
    characterService.getCharacterStats(character.id),
  ]);

  const skillTypeLabels = game.taxonomies?.skillTypes
    ? Object.fromEntries(game.taxonomies.skillTypes.map((st: any) => [st.slug, st.label]))
    : undefined;

  const tierEntries = await tierEntryService.getTiersForCharacter(gameRecord.id, character.id);
  const heroTiers = tierEntries.map((te: any) => ({
    mode: te.mode,
    tier: te.tier,
    previousTier: te.previousTier,
  }));

  const build = await buildService.getBuildForCharacter(gameRecord.id, character.slug);

  return (
    <section aria-labelledby="character-title">
      <SkrHeroDetail
        gameSlug="seven-knights-rebirth"
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
