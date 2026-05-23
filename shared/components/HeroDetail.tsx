"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useGame } from '../../platform/hooks/useGame';
import ImageWithFallback from './ImageWithFallback';
import Lightbox from './Lightbox';
import TaxonomyBadge from '../ui/TaxonomyBadge';
import TierBadge from '../ui/TierBadge';
import StatBlock from '../ui/StatBlock';
import type { StatValue } from '../ui/StatBlock';
import BuildRecommendation from '../../features/builds/components/BuildRecommendation';

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

type HeroDetailProps = {
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

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function HeroDetail({
  gameSlug,
  character,
  skills,
  roster = [],
  guides = [],
  skillTypeLabels,
  statValues: externalStatValues,
  heroTiers = [],
  build = null,
}: HeroDetailProps) {
  const game = useGame();
  const [openArt, setOpenArt] = useState(false);
  const [activeSkillIndex, setActiveSkillIndex] = useState(0);
  const tabBarRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const taxonomies = game?.taxonomies;

  const raritySlug = character.rarity?.toString().toLowerCase().replace(/[★\s]/g, '') ?? '';
  const rarity = taxonomies?.rarities.find((r) => r.slug === raritySlug || r.label.toLowerCase().includes(raritySlug));
  const heroClass = taxonomies?.classes.find((c) => c.slug === (character.characterClass?.toLowerCase() ?? ''));
  const element = taxonomies?.elements.find((e) => e.slug === (character.element?.toLowerCase() ?? ''));
  const primaryColor = rarity?.color ?? game?.theme?.colors?.primary ?? '#7c5cff';
  const accentColor = heroClass?.color ?? game?.theme?.colors?.secondary ?? '#f4c542';

  const images = [character.fullArtUrl, character.portraitUrl].filter(Boolean) as string[];

  const sortedSkills = [...skills].sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
  const activeSkill = sortedSkills[activeSkillIndex];
  const typeLabels = skillTypeLabels ?? DEFAULT_SKILL_TYPE_LABELS;

  const statValues: StatValue[] = externalStatValues ?? [
    { statName: 'atk', value: 3038, perLevel: 127 },
    { statName: 'def', value: 1892, perLevel: 84 },
    { statName: 'hp', value: 8765, perLevel: 412 },
    { statName: 'spd', value: 110, perLevel: 2 },
    { statName: 'crit', value: 41, perLevel: 0.5 },
  ];

  const handleSkillTabChange = useCallback((index: number) => {
    setActiveSkillIndex(index);
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `#skill-${index}`);
    }
    requestAnimationFrame(() => {
      tabRefs.current[index]?.focus();
    });
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const match = window.location.hash.match(/^#skill-(\d+)$/);
    if (match) {
      const idx = parseInt(match[1], 10);
      if (idx >= 0 && idx < sortedSkills.length) {
        setActiveSkillIndex(idx);
      }
    }
  }, [sortedSkills.length]);

  useEffect(() => {
    if (openArt) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const next = (activeSkillIndex - 1 + sortedSkills.length) % sortedSkills.length;
        handleSkillTabChange(next);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        const next = (activeSkillIndex + 1) % sortedSkills.length;
        handleSkillTabChange(next);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [activeSkillIndex, sortedSkills.length, openArt, handleSkillTabChange]);

  return (
    <article>
      {/* Hero Section */}
      <div
        className="relative overflow-hidden rounded-[2rem] border"
        style={{
          borderColor: 'rgba(255,255,255,0.08)',
          background: `linear-gradient(135deg, ${primaryColor}18 0%, ${accentColor}10 50%, rgba(10,15,24,0.92) 100%)`,
        }}
      >
        {/* Atmosphere gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 80% 60% at 30% 20%, ${primaryColor}25 0%, transparent 60%),
              radial-gradient(ellipse 60% 50% at 70% 80%, ${accentColor}15 0%, transparent 50%)
            `,
          }}
          aria-hidden
        />

        <div className="relative z-10 grid gap-6 p-6 lg:grid-cols-[320px_minmax(0,1fr)_300px] lg:p-8 xl:p-10">
          {/* Left: Character portrait + metadata */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Link
                href={`/games/${gameSlug}/characters`}
                className="flex h-10 w-10 items-center justify-center rounded-xl border text-xs text-white/50 transition hover:text-white"
                style={{ borderColor: 'rgba(255,255,255,0.1)' }}
              >
                ←
              </Link>
              <span className="text-xs uppercase tracking-[0.2em] text-white/40">Character</span>
            </div>

            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border">
              <div style={{ borderColor: `${primaryColor}30` }} className="absolute inset-0 border" />
              <ImageWithFallback
                src={character.portraitUrl}
                alt={character.name}
                nameFallback={character.name}
                className="h-full w-full object-cover"
                sizes="(max-width: 640px) 40vw, (max-width: 1024px) 25vw, 300px"
              />
              <div
                className="absolute inset-0"
                style={{ background: `linear-gradient(180deg, transparent 40%, rgba(10,15,24,0.6) 100%)` }}
                aria-hidden
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {rarity && <TaxonomyBadge taxonomy={rarity} size="sm" />}
              {heroClass && <TaxonomyBadge taxonomy={heroClass} size="sm" />}
              {element && <TaxonomyBadge taxonomy={element} size="sm" />}
            </div>

            {character.description && (
              <p className="text-xs leading-relaxed text-white/60">{character.description}</p>
            )}
          </div>

          {/* Center: Character art focal point */}
          <div className="flex flex-col items-center justify-center">
            <button
              onClick={() => setOpenArt(true)}
              className="group relative w-full max-w-[500px] overflow-hidden rounded-2xl border"
              style={{ borderColor: 'rgba(255,255,255,0.1)' }}
            >
              <div className="relative aspect-[4/5] w-full">
              <ImageWithFallback
                src={character.fullArtUrl ?? character.portraitUrl}
                alt={character.name}
                nameFallback={character.name}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 60vw, 500px"
              />
                <div
                  className="absolute inset-0"
                  style={{ background: `linear-gradient(180deg, transparent 50%, rgba(10,15,24,0.4) 100%)` }}
                  aria-hidden
                />
                <div className="absolute bottom-4 left-4 right-4">
                  <h1 className="text-3xl font-bold text-white drop-shadow-lg">{character.name}</h1>
                  <div className="mt-2 flex items-center gap-3">
                    {rarity && <TaxonomyBadge taxonomy={rarity} size="sm" />}
                    {heroClass && <TaxonomyBadge taxonomy={heroClass} size="sm" />}
                    <span className="text-xs text-white/50">Tap for full art</span>
                  </div>
                  {/* Per-mode tier rankings */}
                  {heroTiers.length > 0 && taxonomies?.tiers && (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="text-[0.55rem] uppercase tracking-[0.2em] text-white/40">Tiers:</span>
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
                </div>
              </div>
            </button>
          </div>

          {/* Right: Stats + quick info */}
          <div className="flex flex-col gap-4">
            <div
              className="rounded-2xl border p-4"
              style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}
            >
              <p className="mb-3 text-[0.6rem] uppercase tracking-[0.2em] text-white/40">Base Stats</p>
              {taxonomies?.stats ? (
                <StatBlock stats={statValues} config={taxonomies.stats} columns={2} />
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {statValues.map((s) => (
                    <div key={s.statName} className="rounded-lg border p-2" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                      <p className="text-[0.55rem] uppercase tracking-widest text-white/40">{s.statName.toUpperCase()}</p>
                      <p className="mt-0.5 font-mono text-base font-semibold text-white">{s.value.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div
              className="rounded-2xl border p-4"
              style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}
            >
              <p className="mb-2 text-[0.6rem] uppercase tracking-[0.2em] text-white/40">Quick Actions</p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => document.getElementById('skills-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="rounded-lg px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.15em] text-white/70 transition hover:text-white"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                >
                  Skills
                </button>
                <Link
                  href={`/games/${gameSlug}/tier-lists`}
                  className="rounded-lg px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.15em] text-white/70 transition hover:text-white"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                >
                  Tier Lists
                </Link>
                <Link
                  href={`/games/${gameSlug}/database/gear`}
                  className="rounded-lg px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.15em] text-white/70 transition hover:text-white"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                >
                  Gear
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <section id="skills-section" className="mt-8">
        <div
          className="overflow-hidden rounded-[2rem] border"
          style={{ borderColor: 'rgba(255,255,255,0.08)' }}
        >
          {/* Skill Tab Bar */}
          <div
            ref={tabBarRef}
            className="flex border-b overflow-x-auto"
            role="tablist"
            aria-label="Skill tabs"
            style={{ borderColor: 'rgba(255,255,255,0.06)' }}
          >
            {sortedSkills.map((skill, i) => {
              const isActive = i === activeSkillIndex;
              const label = typeLabels[skill.type] ?? skill.type ?? `Skill ${i + 1}`;
              return (
                <button
                  key={skill.id ?? i}
                  ref={(el) => { tabRefs.current[i] = el; }}
                  role="tab"
                  aria-selected={isActive}
                  aria-label={label}
                  onClick={() => handleSkillTabChange(i)}
                  className={`relative px-5 py-3 text-xs font-bold uppercase tracking-[0.15em] transition ${
                    isActive ? 'text-white' : 'text-white/40 hover:text-white/70'
                  }`}
                  style={isActive ? { color: primaryColor } : {}}
                >
                  {label}
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full"
                      style={{ background: primaryColor }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Skill Content */}
          <div className="p-6 lg:p-8">
            {activeSkill ? (
              <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-semibold text-white">{activeSkill.name}</h3>
                    {activeSkill.type && (
                      <span className="rounded-full border px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.15em] text-white/50"
                        style={{ borderColor: 'rgba(255,255,255,0.1)' }}
                      >
                        {activeSkill.type}
                      </span>
                    )}
                  </div>

                  {activeSkill.description && (
                    <div className="mt-4 space-y-2">
                      {activeSkill.description.split('\n').filter(Boolean).map((line: string, i: number) => (
                        <p key={i} className="text-sm leading-relaxed text-white/80">
                          {line}
                        </p>
                      ))}
                    </div>
                  )}

                  {activeSkill.enhancementText && (
                    <div
                      className="mt-6 rounded-xl border p-4"
                      style={{ borderColor: `${primaryColor}20`, background: `${primaryColor}08` }}
                    >
                      <p className="text-[0.6rem] uppercase tracking-[0.2em] font-semibold" style={{ color: primaryColor }}>
                        Enhancement
                      </p>
                      <p className="mt-2 text-sm text-white/80">{activeSkill.enhancementText}</p>
                    </div>
                  )}

                  {activeSkill.transcendenceText && (
                    <div
                      className="mt-3 rounded-xl border p-4"
                      style={{ borderColor: `${accentColor}20`, background: `${accentColor}08` }}
                    >
                      <p className="text-[0.6rem] uppercase tracking-[0.2em] font-semibold" style={{ color: accentColor }}>
                        Transcendence
                      </p>
                      <p className="mt-2 text-sm text-white/80">{activeSkill.transcendenceText}</p>
                    </div>
                  )}
                </div>

                {/* Skill metadata sidebar */}
                <div
                  className="rounded-xl border p-4"
                  style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}
                >
                  <p className="mb-3 text-[0.6rem] uppercase tracking-[0.2em] text-white/40">Skill Info</p>
                  <dl className="space-y-2">
                    {activeSkill.cooldownTurns != null && (
                      <div className="flex justify-between">
                        <dt className="text-xs text-white/40">Cooldown</dt>
                        <dd className="text-xs font-medium text-white">{activeSkill.cooldownTurns} turns</dd>
                      </div>
                    )}
                    {activeSkill.cost != null && (
                      <div className="flex justify-between">
                        <dt className="text-xs text-white/40">Cost</dt>
                        <dd className="text-xs font-medium text-white">{activeSkill.cost}</dd>
                      </div>
                    )}
                    {activeSkill.powerType && (
                      <div className="flex justify-between">
                        <dt className="text-xs text-white/40">Type</dt>
                        <dd className="text-xs font-medium text-white">{capitalize(activeSkill.powerType)}</dd>
                      </div>
                    )}
                    {activeSkill.scalingStat && (
                      <div className="flex justify-between">
                        <dt className="text-xs text-white/40">Scaling</dt>
                        <dd className="text-xs font-medium text-white">{activeSkill.scalingStat.toUpperCase()}</dd>
                      </div>
                    )}
                    {activeSkill.targets && (
                      <div className="flex justify-between">
                        <dt className="text-xs text-white/40">Targets</dt>
                        <dd className="text-xs font-medium text-white">{capitalize(activeSkill.targets)}</dd>
                      </div>
                    )}
                    {activeSkill.rangeType && (
                      <div className="flex justify-between">
                        <dt className="text-xs text-white/40">Range</dt>
                        <dd className="text-xs font-medium text-white">{capitalize(activeSkill.rangeType)}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>
            ) : (
              <p className="text-sm text-white/50">No skills registered for this character.</p>
            )}
          </div>
        </div>
      </section>

      {/* Build Recommendation */}
      {build && (
        <section className="mt-6">
          <BuildRecommendation build={build as any} gameSlug={gameSlug} />
        </section>
      )}

      {/* Related Guides */}
      {guides.length > 0 && (
        <section className="mt-6">
          <div
            className="overflow-hidden rounded-[2rem] border p-6"
            style={{ borderColor: 'rgba(255,255,255,0.08)' }}
          >
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-white/40">Related Guides</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {guides.map((guide) => (
                <Link
                  key={guide.slug}
                  href={`/games/${gameSlug}/guides/${guide.slug}`}
                  className="rounded-xl border p-4 transition hover:border-white/20"
                  style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}
                >
                  <p className="text-sm font-semibold text-white">{guide.title}</p>
                  {guide.summary && (
                    <p className="mt-1 text-xs text-white/50">{guide.summary}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer: Related Characters */}
      {roster.length > 0 && (
        <section className="mt-8">
          <div
            className="overflow-hidden rounded-[2rem] border p-6"
            style={{ borderColor: 'rgba(255,255,255,0.08)' }}
          >
            <div className="flex items-center justify-between gap-4 mb-4">
              <p className="text-xs uppercase tracking-[0.3em] text-white/40">Roster</p>
              <Link
                href={`/games/${gameSlug}/characters`}
                className="text-xs font-semibold uppercase tracking-[0.15em] transition"
                style={{ color: primaryColor }}
              >
                View all
              </Link>
            </div>
            <div
              className="flex gap-3 overflow-x-auto pb-2"
              style={{ scrollbarWidth: 'thin' }}
            >
              {roster.slice(0, 12).map((entry) => (
                <Link
                  key={entry.slug}
                  href={`/games/${gameSlug}/characters/${entry.slug}`}
                  className={`min-w-[140px] flex-shrink-0 rounded-xl border p-3 transition ${
                    entry.slug === character.slug
                      ? 'border-white/20 bg-white/8'
                      : 'border-white/5 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]'
                  }`}
                  style={
                    entry.slug === character.slug
                      ? { borderColor: `${primaryColor}40`, background: `${primaryColor}10` }
                      : {}
                  }
                >
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg border"
                      style={{ borderColor: 'rgba(255,255,255,0.08)' }}
                    >
                      <ImageWithFallback
                        src={entry.iconUrl ?? entry.portraitUrl}
                        alt={entry.name}
                        nameFallback={entry.name}
                        className="h-10 w-10 object-cover"
                        sizes="40px"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-white">{entry.name}</p>
                      <p className="truncate text-[0.55rem] uppercase tracking-[0.15em] text-white/40">
                        {entry.element ?? ''} {entry.role ?? ''}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Lightbox
        src={images[0] ?? null}
        alt={character.name}
        open={openArt}
        onClose={() => setOpenArt(false)}
        onPrev={() => {}}
        onNext={() => {}}
      />
    </article>
  );
}
