import { NextResponse } from 'next/server';
import { gameService } from '../../../../../server/services/game.service';
import { characterService } from '../../../../../server/services/character.service';
import { skillService } from '../../../../../server/services/skill.service';
import { guideService } from '../../../../../server/services/guide.service';
import { gearService } from '../../../../../server/services/gear.service';
import { petService } from '../../../../../server/services/pets.service';

export async function GET(
  _request: Request,
  { params }: { params: { gameSlug: string } }
) {
  const gameRecord = await gameService.getGameBySlug(params.gameSlug);
  if (!gameRecord) {
    return NextResponse.json({ entries: [] });
  }

  const [characters, groupedSkills, guides, gearSets, pets] = await Promise.all([
    characterService.listCharacters(gameRecord.id),
    skillService.listSkillsForGame(gameRecord.id),
    guideService.listGuides(gameRecord.id),
    gearService.listGearSets(gameRecord.id),
    petService.listPets(gameRecord.id),
  ]);

  const entries: {
    label: string;
    description: string;
    href: string;
    type: 'hero' | 'skill' | 'guide' | 'gear' | 'pet';
  }[] = [];

  for (const c of characters) {
    entries.push({
      label: c.name,
      description: [c.characterClass, c.role, c.element].filter(Boolean).join(' · '),
      href: `/games/${params.gameSlug}/characters/${c.slug}`,
      type: 'hero',
    });
  }

  for (const group of groupedSkills) {
    for (const s of group.skills) {
      entries.push({
        label: s.name,
        description: [s.type, s.powerType, s.targets].filter(Boolean).join(' · '),
        href: `/games/${params.gameSlug}/characters/${group.characterSlug}`,
        type: 'skill',
      });
    }
  }

  for (const g of guides) {
    entries.push({
      label: g.title,
      description: [g.guideType, g.mode].filter(Boolean).join(' · '),
      href: `/games/${params.gameSlug}/guides/${g.slug}`,
      type: 'guide',
    });
  }

  for (const g of gearSets) {
    entries.push({
      label: g.name,
      description: g.twoPieceEffect ?? g.description ?? '',
      href: `/games/${params.gameSlug}/database/gear`,
      type: 'gear',
    });
  }

  for (const p of pets) {
    entries.push({
      label: p.name,
      description: [p.rarity, p.faction].filter(Boolean).join(' · '),
      href: `/games/${params.gameSlug}/database/pets`,
      type: 'pet',
    });
  }

  return NextResponse.json(
    { entries },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    }
  );
}
