import Link from 'next/link';
import { notFound } from 'next/navigation';
import { moduleRegistry } from '../../../../../../../core/module-registry';
import { gameService } from '../../../../../../../server/services/game.service';
import { petService } from '../../../../../../../server/services/pets.service';

type Props = {
  params: { gameSlug: string; slug: string };
};

export async function generateStaticParams() {
  const games = moduleRegistry.list();
  const params: { gameSlug: string; slug: string }[] = [];

  for (const game of games) {
    const gameRecord = await gameService.getGameBySlug(game.slug);
    if (!gameRecord) continue;

    const pets = await petService.listPets(gameRecord.id);
    for (const p of pets) {
      params.push({ gameSlug: game.slug, slug: p.slug });
    }
  }

  return params;
}

export async function generateMetadata({ params }: Props) {
  const game = moduleRegistry.get(params.gameSlug);
  if (!game) return {};

  const gameRecord = await gameService.getGameBySlug(params.gameSlug);
  if (!gameRecord) return {};

  const pet = await petService.getPetBySlug(gameRecord.id, params.slug);
  if (!pet) return {};

  return {
    title: `${pet.name} | ${game.name}`,
    description: pet.passive1Description ?? `Pet details for ${pet.name}.`,
    alternates: { canonical: `/games/${params.gameSlug}/database/pets/${params.slug}` },
  };
}

const RARITY_COLORS: Record<string, string> = {
  Legendary: '#ffd700',
  Epic: '#aa66cc',
  Rare: '#33b5e5',
  Common: '#95a5a6',
};

export default async function PetDetailPage({ params }: Props) {
  const game = moduleRegistry.get(params.gameSlug);
  if (!game) notFound();

  const gameRecord = await gameService.getGameBySlug(params.gameSlug);
  if (!gameRecord) notFound();

  const pet = await petService.getPetBySlug(gameRecord.id, params.slug);
  if (!pet) notFound();

  const rarityColor = RARITY_COLORS[pet.rarity ?? ''] ?? '#888888';
  const primaryColor = game.theme?.colors?.primary ?? '#aa66cc';

  return (
    <section aria-labelledby="pet-detail-title">
      <Link
        href={`/games/${params.gameSlug}/database/pets`}
        className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-white/50 transition hover:text-white"
      >
        &larr; Back to Pets
      </Link>

      <div
        className="relative overflow-hidden rounded-[2rem] border p-6 lg:p-8"
        style={{
          borderColor: 'rgba(255,255,255,0.08)',
          background: `linear-gradient(135deg, ${rarityColor}12 0%, rgba(10,15,24,0.92) 100%)`,
        }}
      >
        <div className="relative z-10">
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">{game.name}</p>
          <div className="mt-2 flex items-center gap-3">
            <h1 id="pet-detail-title" className="text-3xl font-semibold text-white">
              {pet.name}
            </h1>
            {pet.rarity && (
              <span
                className="inline-block rounded-full px-2.5 py-0.5 text-size-tiny font-semibold uppercase tracking-[0.15em]"
                style={{ background: `${rarityColor}20`, color: rarityColor, border: `1px solid ${rarityColor}40` }}
              >
                {pet.rarity}
              </span>
            )}
          </div>

          {pet.faction && (
            <p className="mt-2 text-sm text-white/50">Faction: {pet.faction}</p>
          )}

          {/* Passives */}
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {pet.passive1Name && (
              <PassiveCard
                name={pet.passive1Name}
                baseDescription={pet.passive1Description}
                enhancedDescription={pet.passive1Enhanced}
                accentColor={primaryColor}
              />
            )}
            {pet.passive2Name && (
              <PassiveCard
                name={pet.passive2Name}
                baseDescription={pet.passive2Description}
                enhancedDescription={pet.passive2Enhanced}
                accentColor={primaryColor}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function PassiveCard({
  name,
  baseDescription,
  enhancedDescription,
  accentColor,
}: {
  name: string;
  baseDescription: string | null;
  enhancedDescription: string | null;
  accentColor: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
      <p className="mb-3 text-[0.6rem] uppercase tracking-[0.2em] text-[#f4c542] font-semibold">{name}</p>
      <div>
        <p className="text-xs font-semibold text-white/60">Base</p>
        <p className="mt-1 text-sm text-white/80">{baseDescription ?? '—'}</p>
      </div>
      {enhancedDescription && (
        <div className="mt-3 rounded-lg p-3" style={{ background: `${accentColor}10` }}>
          <p className="text-xs font-semibold" style={{ color: accentColor }}>Enhanced</p>
          <p className="mt-1 text-sm text-white/90">{enhancedDescription}</p>
        </div>
      )}
    </div>
  );
}
