import Link from 'next/link';
import { notFound } from 'next/navigation';
import { moduleRegistry } from '../../../../../../core/module-registry';
import { gameService } from '../../../../../../server/services/game.service';
import { characterService } from '../../../../../../server/services/character.service';
import { skillService } from '../../../../../../server/services/skill.service';

type SkillDetailPageProps = {
  params: {
    gameSlug: string;
    slug: string;
  };
};

export async function generateMetadata({ params }: SkillDetailPageProps) {
  const game = moduleRegistry.get(params.gameSlug);
  if (!game) return {};

  const gameRecord = await gameService.getGameBySlug(params.gameSlug);
  if (!gameRecord) return {};

  const skill = await skillService.getSkill(gameRecord.id, params.slug);
  if (!skill) return {};

  return {
    title: `${skill.name} | ${game.name}`,
    description: skill.description ?? `Skill details for ${skill.name} in ${game.name}.`,
  };
}

export default async function SkillDetailPage({ params }: SkillDetailPageProps) {
  const game = moduleRegistry.get(params.gameSlug);
  if (!game) notFound();

  const gameRecord = await gameService.getGameBySlug(params.gameSlug);
  if (!gameRecord) notFound();

  const skill = await skillService.getSkill(gameRecord.id, params.slug);
  if (!skill) notFound();

  const character = skill.characterId
    ? await characterService.getCharacterById(gameRecord.id, skill.characterId)
    : null;

  function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return (
    <section aria-labelledby="skill-detail-title" className="mx-auto max-w-4xl px-6 py-10">
      <p className="text-sm uppercase tracking-[0.3em] text-sky-300">{game.name}</p>

      <div className="mt-2 flex items-center gap-3">
        {character && (
          <Link
            href={`/games/${game.slug}/characters/${character.slug}`}
            className="text-xs uppercase tracking-[0.15em] text-white/50 transition hover:text-sky-300"
          >
            ← {character.name}
          </Link>
        )}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <h1 id="skill-detail-title" className="text-4xl font-semibold">{skill.name}</h1>
        {skill.type && (
          <span
            className="rounded-full border px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.15em]"
            style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}
          >
            {skill.type}
          </span>
        )}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_280px]">
        <div>
          {skill.description && (
            <div className="space-y-2">
              {skill.description.split('\n').filter(Boolean).map((line: string, i: number) => (
                <p key={i} className="text-sm leading-relaxed text-white/80">{line}</p>
              ))}
            </div>
          )}

          {skill.enhancementText && (
            <div className="mt-6 rounded-xl border p-4" style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}>
              <p className="text-[0.6rem] uppercase tracking-[0.2em] font-semibold text-sky-300">Enhancement</p>
              <p className="mt-2 text-sm text-white/80">{skill.enhancementText}</p>
            </div>
          )}

          {skill.transcendenceText && (
            <div className="mt-3 rounded-xl border p-4" style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}>
              <p className="text-[0.6rem] uppercase tracking-[0.2em] font-semibold text-amber-300">Transcendence</p>
              <p className="mt-2 text-sm text-white/80">{skill.transcendenceText}</p>
            </div>
          )}
        </div>

        <div className="rounded-xl border p-4" style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
          <p className="mb-3 text-[0.6rem] uppercase tracking-[0.2em] text-white/40">Skill Info</p>
          <dl className="space-y-2">
            {skill.cooldownTurns != null && (
              <div className="flex justify-between">
                <dt className="text-xs text-white/40">Cooldown</dt>
                <dd className="text-xs font-medium text-white">{skill.cooldownTurns} turns</dd>
              </div>
            )}
            {skill.cost != null && (
              <div className="flex justify-between">
                <dt className="text-xs text-white/40">Cost</dt>
                <dd className="text-xs font-medium text-white">{skill.cost}</dd>
              </div>
            )}
            {skill.powerType && (
              <div className="flex justify-between">
                <dt className="text-xs text-white/40">Type</dt>
                <dd className="text-xs font-medium text-white">{capitalize(skill.powerType)}</dd>
              </div>
            )}
            {skill.scalingStat && (
              <div className="flex justify-between">
                <dt className="text-xs text-white/40">Scaling</dt>
                <dd className="text-xs font-medium text-white">{skill.scalingStat.toUpperCase()}</dd>
              </div>
            )}
            {skill.targets && (
              <div className="flex justify-between">
                <dt className="text-xs text-white/40">Targets</dt>
                <dd className="text-xs font-medium text-white">{capitalize(skill.targets)}</dd>
              </div>
            )}
            {skill.rangeType && (
              <div className="flex justify-between">
                <dt className="text-xs text-white/40">Range</dt>
                <dd className="text-xs font-medium text-white">{capitalize(skill.rangeType)}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {character && (
        <div className="mt-8">
          <Link
            href={`/games/${game.slug}/characters/${character.slug}`}
            className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm text-white/70 transition hover:border-sky-300/40 hover:text-white"
            style={{ borderColor: 'rgba(255,255,255,0.08)' }}
          >
            <span>←</span>
            <span>Back to {character.name}</span>
          </Link>
        </div>
      )}
    </section>
  );
}
