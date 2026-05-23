import { notFound } from 'next/navigation';
import { moduleRegistry } from '@/core/module-registry';
import { characterService } from '@/server/services/character.service';
import { gameService } from '@/server/services/game.service';
import SkrCharactersIndex from '@/shared/components/skr/SkrCharactersIndex';

export async function generateMetadata() {
  const game = moduleRegistry.get('seven-knights-rebirth');
  if (!game) return {};
  return {
    title: `Roster | ${game.name}`,
    description: `Browse the character roster for ${game.name}.`,
  };
}

export default async function SkrCharactersPage() {
  const game = moduleRegistry.get('seven-knights-rebirth');
  if (!game) notFound();

  const gameRecord = await gameService.getGameBySlug('seven-knights-rebirth');
  if (!gameRecord) notFound();

  const characters = await characterService.listCharacters(gameRecord.id);

  return (
    <section aria-labelledby="roster-title">
      <h1 id="roster-title" className="text-2xl font-semibold" style={{ color: 'var(--foreground)' }}>
        Roster
      </h1>
      <p className="mt-1 text-sm text-white/50">Browse all available heroes.</p>

      <div className="mt-6">
        <SkrCharactersIndex gameSlug={game.slug} characters={characters} />
      </div>
    </section>
  );
}
