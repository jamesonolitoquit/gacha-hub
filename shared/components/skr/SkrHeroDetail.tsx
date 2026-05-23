'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useGame } from '../../../platform/hooks/useGame';
import ImageWithFallback from '../ImageWithFallback';
import Lightbox from '../Lightbox';
import TaxonomyBadge from '../../ui/TaxonomyBadge';
import TierBadge from '../../ui/TierBadge';
import BuildRecommendation from '../../../features/builds/components/BuildRecommendation';
import SkrStatBar from './SkrStatBar';
import SkrThumbnailCarousel from './SkrThumbnailCarousel';
import type { StatValue } from './SkrStatBar';

type Character = {
  id: number;
  slug: string;
  name: string;
  rarity?: number | string | null;
  element?: string | null;
  characterClass?: string | null;
  role?: string | null;
  portraitUrl?: string | null;
  fullArtUrl?: string | null;
  iconUrl?: string | null;
  description?: string | null;
};

type GuideSummary = {
  slug: string;
  title: string;
  guideType?: string | null;
  summary?: string | null;
};

type HeroTierEntry = {
  mode: string;
  tier: string;
  previousTier?: string | null;
};

type Props = {
  gameSlug: string;
  character: Character;
  skills: any[];
  roster?: Character[];
  guides?: GuideSummary[];
  skillTypeLabels?: Record<string, string>;
  statValues?: StatValue[];
  heroTiers?: HeroTierEntry[];
  build?: Record<string, any> | null;
};

const DEFAULT_SKILL_TYPE_LABELS: Record<string, string> = {
  passive: 'Passive',
  'basic-attack': 'Basic',
  'skill-1': 'S1',
  'skill-2': 'S2',
  awakened: 'Ult',
};

export default function SkrHeroDetail({
  gameSlug,
  character,
  skills,
  roster = [],
  guides = [],
  skillTypeLabels,
  statValues: externalStatValues,
  heroTiers = [],
  build = null,
}: Props) {
  const game = useGame();
  const taxonomies = game?.taxonomies;
  const [openArt, setOpenArt] = useState(false);
  const [tab, setTab] = useState<'skills' | 'equipment'>('skills');

  const raritySlug = character.rarity?.toString().toLowerCase().replace(/[★\s]/g, '') ?? '';
  const rarity = taxonomies?.rarities.find((r) => r.slug === raritySlug || r.label.toLowerCase().includes(raritySlug));
  const heroClass = taxonomies?.classes.find((c) => c.slug === (character.characterClass?.toLowerCase() ?? ''));
  const element = taxonomies?.elements.find((e) => e.slug === (character.element?.toLowerCase() ?? ''));
  const primaryColor = rarity?.color ?? game?.theme?.colors?.primary ?? '#7c5cff';
  const accentColor = heroClass?.color ?? game?.theme?.colors?.secondary ?? '#f4c542';

  const RARITY_DISPLAY: Record<string, { stars: number; glow?: string }> = {
    'rare': { stars: 4 },
    'legendary': { stars: 5 },
    'legendary-p': { stars: 6, glow: '#ff4444' },
    'legendary-pp': { stars: 6, glow: '#8e44ad' },
  };
  const rarityDisplay = raritySlug ? RARITY_DISPLAY[raritySlug] : undefined;
  const starCount = rarityDisplay?.stars ?? rarity?.stars ?? (typeof character.rarity === 'number' ? character.rarity : 0);
  const starGlow = rarityDisplay?.glow;

  const sortedSkills = [...skills].sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
  const typeLabels = skillTypeLabels ?? DEFAULT_SKILL_TYPE_LABELS;

  const statValues: StatValue[] = externalStatValues ?? [
    { statName: 'atk', value: 3038, perLevel: 127 },
    { statName: 'def', value: 1892, perLevel: 84 },
    { statName: 'hp', value: 8765, perLevel: 412 },
    { statName: 'spd', value: 110, perLevel: 2 },
    { statName: 'crit', value: 41, perLevel: 0.5 },
  ];

  return (
    <article className="space-y-6">
      {/* Back link */}
      <Link
        href={`/games/${gameSlug}/characters`}
        className="inline-flex items-center gap-1.5 text-xs text-white/50 transition hover:text-white"
      >
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
        </svg>
        Back to Roster
      </Link>

      {/* Hero Section */}
      <div
        className="relative overflow-hidden rounded-2xl border"
        style={{ borderColor: 'rgba(255,255,255,0.08)' }}
      >
        {/* Background glow */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 70% 50% at 30% 30%, ${primaryColor}20 0%, transparent 60%),
              radial-gradient(ellipse 50% 40% at 70% 70%, ${accentColor}12 0%, transparent 50%)
            `,
          }}
          aria-hidden
        />

        <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Left: Full art */}
          <div className="flex items-center justify-center p-4 lg:p-6">
            <button
              onClick={() => setOpenArt(true)}
              className="group relative w-full max-w-[450px] overflow-hidden rounded-xl border"
              style={{ borderColor: `${primaryColor}30` }}
            >
              <div className="relative aspect-[4/5] w-full">
                <ImageWithFallback
                  src={`/skr/${character.slug}-profile.png`}
                  backupSrc={character.fullArtUrl ?? character.portraitUrl ?? null}
                  alt={character.name}
                  nameFallback={character.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 450px"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(10,7,22,0.6) 100%)' }}
                  aria-hidden
                />
              </div>
            </button>
          </div>

          {/* Right: Info + Stats */}
          <div className="flex flex-col gap-4 p-4 pr-6 lg:py-6 lg:pr-8">
            {/* Rarity badge */}
            {rarity && (
              <span
                className="inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider"
                style={{
                  background: `${rarity.color}20`,
                  border: `1px solid ${rarity.color}40`,
                  color: rarity.textColor ?? rarity.color,
                }}
              >
                {rarity.label}
              </span>
            )}

            {/* Name */}
            <div>
              <h1 className="text-2xl font-bold text-white drop-shadow-lg">{character.name}</h1>
              {character.role && (
                <p className="mt-0.5 text-sm text-white/60">{character.role}</p>
              )}
            </div>

            {/* Stars */}
            {starCount > 0 && (
              <div
                className="text-sm tracking-wide"
                style={{
                  color: '#ffd700',
                  textShadow: starGlow
                    ? `0 0 6px ${starGlow}, 0 0 12px ${starGlow}`
                    : undefined,
                }}
              >
                {'★'.repeat(starCount)}
              </div>
            )}

            {/* Element + Class badges */}
            <div className="flex flex-wrap gap-2">
              {element && <TaxonomyBadge taxonomy={element} size="sm" />}
              {heroClass && <TaxonomyBadge taxonomy={heroClass} size="sm" />}
            </div>

            {/* Tier rankings */}
            {heroTiers.length > 0 && taxonomies?.tiers && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[0.5rem] uppercase tracking-[0.2em] text-white/40">Tiers:</span>
                {heroTiers.map((ht) => (
                  <TierBadge
                    key={ht.mode}
                    tier={ht.tier}
                    config={taxonomies.tiers}
                    size="sm"
                    previousTier={ht.previousTier ?? undefined}
                  />
                ))}
              </div>
            )}

            {/* Description */}
            {character.description && (
              <p className="text-xs leading-relaxed text-white/50">{character.description}</p>
            )}

            {/* Stats */}
            {taxonomies?.stats && statValues.length > 0 && (
              <div className="mt-2">
                <p className="mb-3 text-[0.55rem] uppercase tracking-[0.2em] text-white/40">Base Stats</p>
                <SkrStatBar stats={statValues} config={taxonomies.stats} />
              </div>
            )}
          </div>
        </div>

        {/* Lightbox overlay */}
        <Lightbox
          src={(character.fullArtUrl ?? character.portraitUrl) || null}
          alt={character.name}
          open={openArt}
          onClose={() => setOpenArt(false)}
          onPrev={() => {}}
          onNext={() => {}}
        />
      </div>

      {/* Skills / Equipment Tabs */}
      <div
        className="overflow-hidden rounded-2xl border"
        style={{ borderColor: 'rgba(255,255,255,0.08)' }}
      >
        <div
          className="flex border-b"
          style={{ borderColor: 'rgba(255,255,255,0.06)' }}
          role="tablist"
          aria-label="Character details"
        >
          <button
            role="tab"
            aria-selected={tab === 'skills'}
            onClick={() => setTab('skills')}
            className="relative px-5 py-3 text-xs font-bold uppercase tracking-[0.15em] transition"
            style={{ color: tab === 'skills' ? primaryColor : 'rgba(255,255,255,0.4)' }}
          >
            Skills
            {tab === 'skills' && (
              <span
                className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full"
                style={{ background: primaryColor }}
              />
            )}
          </button>
          <button
            role="tab"
            aria-selected={tab === 'equipment'}
            onClick={() => setTab('equipment')}
            className="relative px-5 py-3 text-xs font-bold uppercase tracking-[0.15em] transition"
            style={{ color: tab === 'equipment' ? primaryColor : 'rgba(255,255,255,0.4)' }}
          >
            Equipment
            {tab === 'equipment' && (
              <span
                className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full"
                style={{ background: primaryColor }}
              />
            )}
          </button>
        </div>

        <div className="p-4 lg:p-6">
          {tab === 'skills' ? (
            sortedSkills.length > 0 ? (
              <div className="space-y-4">
                {sortedSkills.map((skill, i) => {
                  const label = typeLabels[skill.type] ?? skill.type ?? `Skill ${i + 1}`;
                  return (
                    <div
                      key={skill.id ?? i}
                      className="rounded-xl border p-4 transition hover:border-white/20"
                      style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}
                    >
                      <div className="flex items-start gap-3">
                        {/* Skill icon placeholder */}
                        <div
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold"
                          style={{
                            background: `${primaryColor}20`,
                            color: primaryColor,
                            border: `1px solid ${primaryColor}30`,
                          }}
                        >
                          {label.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-white">{skill.name}</span>
                            {skill.type && (
                              <span
                                className="rounded-full border px-2 py-0.5 text-[0.55rem] font-semibold uppercase tracking-wider"
                                style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}
                              >
                                {label}
                              </span>
                            )}
                          </div>
                          {skill.description && (
                            <div className="mt-2 space-y-1">
                              {skill.description.split('\n').filter(Boolean).map((line: string, j: number) => (
                                <p key={j} className="text-xs leading-relaxed text-white/70">{line}</p>
                              ))}
                            </div>
                          )}
                          <div className="mt-2 flex flex-wrap gap-3 text-[0.6rem] text-white/40">
                            {skill.cooldownTurns != null && <span>Cooldown: {skill.cooldownTurns} turns</span>}
                            {skill.cost != null && <span>Cost: {skill.cost}</span>}
                            {skill.powerType && <span>Type: {skill.powerType}</span>}
                            {skill.scalingStat && <span>Scales with: {skill.scalingStat.toUpperCase()}</span>}
                          </div>
                        </div>
                      </div>
                      {skill.enhancementText && (
                        <div
                          className="mt-3 rounded-lg border p-3"
                          style={{ borderColor: `${primaryColor}20`, background: `${primaryColor}08` }}
                        >
                          <p className="text-[0.5rem] font-semibold uppercase tracking-wider" style={{ color: primaryColor }}>
                            Enhancement
                          </p>
                          <p className="mt-1 text-xs text-white/70">{skill.enhancementText}</p>
                        </div>
                      )}
                      {skill.transcendenceText && (
                        <div
                          className="mt-2 rounded-lg border p-3"
                          style={{ borderColor: `${accentColor}20`, background: `${accentColor}08` }}
                        >
                          <p className="text-[0.5rem] font-semibold uppercase tracking-wider" style={{ color: accentColor }}>
                            Transcendence
                          </p>
                          <p className="mt-1 text-xs text-white/70">{skill.transcendenceText}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-white/50">No skills registered for this character.</p>
            )
          ) : (
            /* Equipment tab */
            <div className="space-y-4">
              <p className="text-sm text-white/60">
                Browse recommended gear and equipment setups for {character.name}.
              </p>
              <Link
                href={`/games/${gameSlug}/database/gear`}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition"
                style={{
                  background: `${primaryColor}15`,
                  color: primaryColor,
                  border: `1px solid ${primaryColor}30`,
                }}
              >
                Browse gear database
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Build Recommendation */}
      {build && (
        <BuildRecommendation build={build as any} gameSlug={gameSlug} />
      )}

      {/* Related Guides */}
      {guides.length > 0 && (
        <div
          className="rounded-2xl border p-5"
          style={{ borderColor: 'rgba(255,255,255,0.08)' }}
        >
          <p className="mb-4 text-[0.55rem] uppercase tracking-[0.2em] text-white/40">Guides</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {guides.map((guide) => (
              <Link
                key={guide.slug}
                href={`/games/${gameSlug}/guides/${guide.slug}`}
                className="rounded-xl border p-4 transition hover:border-white/20"
                style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}
              >
                <p className="text-sm font-semibold text-white">{guide.title}</p>
                {guide.summary && <p className="mt-1 text-xs text-white/50">{guide.summary}</p>}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Thumbnail Carousel */}
      {roster.length > 0 && (
        <div
          className="rounded-2xl border p-5"
          style={{ borderColor: 'rgba(255,255,255,0.08)' }}
        >
          <SkrThumbnailCarousel
            gameSlug={gameSlug}
            characters={roster}
            currentSlug={character.slug}
          />
        </div>
      )}
    </article>
  );
}
