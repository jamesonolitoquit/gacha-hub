import Link from 'next/link';
import { notFound } from 'next/navigation';
import { moduleRegistry } from '../../../../../core/module-registry';
import { gameService } from '../../../../../server/services/game.service';
import { characterService } from '../../../../../server/services/character.service';
import { skillService } from '../../../../../server/services/skill.service';
import { gearService } from '../../../../../server/services/gear.service';
import { petService } from '../../../../../server/services/pets.service';

type Props = { params: { gameSlug: string } };

export const revalidate = 3600;

export default async function DatabaseLandingPage({ params }: Props) {
  const game = moduleRegistry.get(params.gameSlug);
  if (!game) notFound();

  const gameRecord = await gameService.getGameBySlug(params.gameSlug);
  if (!gameRecord) notFound();

  const [characters, skills, gearSets, pets] = await Promise.all([
    characterService.listCharacters(gameRecord.id),
    skillService.listSkillsForGame(gameRecord.id),
    gearService.listGearSets(gameRecord.id),
    petService.listPets(gameRecord.id),
  ]);

  const entries = [
    { slug: 'characters', label: 'Heroes', count: characters.length, href: `/games/${params.gameSlug}/characters` },
    { slug: 'skills', label: 'Skills', count: skills.length, href: `/games/${params.gameSlug}/skills` },
    ...(gearSets.length > 0 ? [{ slug: 'gear', label: 'Gear Sets', count: gearSets.length, href: `/games/${params.gameSlug}/database/gear` }] : []),
    ...(pets.length > 0 ? [{ slug: 'pets', label: 'Pets', count: pets.length, href: `/games/${params.gameSlug}/database/pets` }] : []),
  ];

  return (
    <section>
      <div className="flex items-center justify-between border-b pb-3 mb-4" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <h1 className="text-lg font-semibold">Database</h1>
        <p className="text-xs text-white/40">{entries.reduce((s, e) => s + e.count, 0)} total entries</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {entries.map((entry) => (
          <Link
            key={entry.slug}
            href={entry.href}
            className="rounded-xl border p-3 transition hover:bg-white/[0.03]"
            style={{ borderColor: 'rgba(255,255,255,0.06)' }}
          >
            <p className="text-lg font-bold">{entry.count}</p>
            <p className="mt-0.5 text-size-tiny uppercase tracking-[0.2em] text-white/40">{entry.label}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
