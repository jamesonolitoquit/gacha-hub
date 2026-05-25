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
      {/* Compact header bar */}
      <div className="flex items-center gap-4 border-b pb-3" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-2">
          <Link
            href={`/games/${gameSlug}/heroes`}
            className="flex h-7 w-7 items-center justify-center rounded-lg border text-[0.5rem] text-white/40 transition hover:text-white"
            style={{ borderColor: 'rgba(255,255,255,0.1)' }}
          >
            ←
          </Link>
          <div
            className="h-9 w-9 overflow-hidden rounded-lg border cursor-pointer"
            style={{ borderColor: 'rgba(255,255,255,0.1)' }}
            onClick={() => setOpenArt(true)}
          >
            <ImageWithFallback
              src={character.iconUrl ?? character.portraitUrl}
              alt={character.name}
              nameFallback={character.name}
              className="h-full w-full object-cover"
              sizes="36px"
            />
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-semibold truncate">{character.name}</h1>
            <div className="flex items-center gap-1.5">
              {rarity && <TaxonomyBadge taxonomy={rarity} size="sm" />}
              {heroClass && <TaxonomyBadge taxonomy={heroClass} size="sm" />}
              {element && <TaxonomyBadge taxonomy={element} size="sm" />}
            </div>
          </div>
          <div className="mt-0.5 flex items-center gap-2">
            {heroTiers.length > 0 && taxonomies?.tiers && heroTiers.map((ht) => (
              <TierBadge
                key={ht.mode}
                tier={ht.tier}
                config={taxonomies.tiers}
                size="sm"
                previousTier={ht.previousTier ?? undefined}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Quick Build — always first content section */}
      {build && (
        <section className="mt-4">
          <div className="overflow-hidden rounded-xl border" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            <div className="p-4">
              <p className="mb-3 text-[0.55rem] font-semibold uppercase tracking-[0.2em] text-white/40">Quick Build</p>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border p-3" style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                  <p className="mb-1 text-[0.5rem] uppercase tracking-[0.15em] text-white/35">Gear Set</p>
                  <span className="inline-block rounded-full border px-2 py-0.5 text-[0.5rem] font-semibold uppercase tracking-[0.15em]" style={{ borderColor: 'rgba(255,255,255,0.1)', color: '#33b5e5' }}>
                    {build.gearSet1.setName}
                  </span>
                  <div className="mt-2 space-y-0.5 text-[0.55rem]">
                    <span className="text-white/50">{build.gearSet1.weapon}</span>
                    <span className="mx-1 text-white/20">·</span>
                    <span className="text-white/50">{build.gearSet1.armor}</span>
                    <span className="mx-1 text-white/20">·</span>
                    <span className="text-white/50">{build.gearSet1.accessory}</span>
                  </div>
                  {build.keyUsage.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {build.keyUsage.map((mode: string) => {
                        const color = mode === 'pvp' ? '#ff4444' : '#33b5e5';
                        return (
                          <span key={mode} className="rounded px-1.5 py-0.5 text-[0.45rem] font-bold uppercase tracking-[0.15em]" style={{ background: `${color}18`, color }}>
                            {mode === 'pvp' ? 'PVP' : 'PVE'}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="rounded-lg border p-3" style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                  <p className="mb-1 text-[0.5rem] uppercase tracking-[0.15em] text-white/35">Stat Priority</p>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                    {build.statPriorities.slice(0, 4).map((stat: string) => (
                      <span key={stat} className="text-[0.55rem] font-medium text-white/70">{stat}</span>
                    ))}
                  </div>
                  <p className="mt-2 text-[0.5rem] uppercase tracking-[0.15em] text-white/35">Skill Priority</p>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                    {build.skillPriority.slice(0, 4).map((skill: string) => (
                      <span key={skill} className="text-[0.55rem] font-medium text-white/70 capitalize">{skill.replace(/-/g, ' ')}</span>
                    ))}
                  </div>
                  {build.notes && (
                    <p className="mt-2 text-[0.55rem] italic text-white/40 line-clamp-2">{build.notes}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Skills Section */}
      <section className="mt-5">
        <div
          className="overflow-hidden rounded-xl border"
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
                  className={`relative px-4 py-2.5 text-[0.6rem] font-bold uppercase tracking-[0.15em] transition ${
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
          <div className="grid gap-4 p-4 lg:grid-cols-[1fr_220px]">
            <div>
              {activeSkill ? (
                <>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-white">{activeSkill.name}</h3>
                    {activeSkill.type && (
                      <span className="rounded-full border px-1.5 py-0.5 text-[0.5rem] font-semibold uppercase tracking-[0.15em] text-white/50"
                        style={{ borderColor: 'rgba(255,255,255,0.1)' }}
                      >
                        {typeLabels[activeSkill.type] ?? activeSkill.type}
                      </span>
                    )}
                  </div>

                  {activeSkill.description && (
                    <div className="mt-2 space-y-1">
                      {activeSkill.description.split('\n').filter(Boolean).map((line: string, i: number) => (
                        <p key={i} className="text-xs leading-relaxed text-white/80">{line}</p>
                      ))}
                    </div>
                  )}

                  {activeSkill.enhancementText && (
                    <div className="mt-3 rounded-lg border p-3" style={{ borderColor: `${primaryColor}20`, background: `${primaryColor}08` }}>
                      <p className="text-[0.5rem] uppercase tracking-[0.2em] font-semibold" style={{ color: primaryColor }}>Enhancement</p>
                      <p className="mt-1 text-xs text-white/80">{activeSkill.enhancementText}</p>
                    </div>
                  )}

                  {activeSkill.transcendenceText && (
                    <div className="mt-2 rounded-lg border p-3" style={{ borderColor: `${accentColor}20`, background: `${accentColor}08` }}>
                      <p className="text-[0.5rem] uppercase tracking-[0.2em] font-semibold" style={{ color: accentColor }}>Transcendence</p>
                      <p className="mt-1 text-xs text-white/80">{activeSkill.transcendenceText}</p>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-xs text-white/50">No skills registered for this character.</p>
              )}
            </div>

            {/* Skill metadata sidebar */}
            {activeSkill && (
              <div className="rounded-lg border p-3" style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                <p className="mb-2 text-[0.5rem] uppercase tracking-[0.2em] text-white/40">Info</p>
                <dl className="space-y-1.5">
                  {activeSkill.cooldownTurns != null && (
                    <div className="flex justify-between">
                      <dt className="text-[0.55rem] text-white/40">CD</dt>
                      <dd className="text-[0.55rem] font-medium text-white">{activeSkill.cooldownTurns}t</dd>
                    </div>
                  )}
                  {activeSkill.cost != null && (
                    <div className="flex justify-between">
                      <dt className="text-[0.55rem] text-white/40">Cost</dt>
                      <dd className="text-[0.55rem] font-medium text-white">{activeSkill.cost}</dd>
                    </div>
                  )}
                  {activeSkill.powerType && (
                    <div className="flex justify-between">
                      <dt className="text-[0.55rem] text-white/40">Type</dt>
                      <dd className="text-[0.55rem] font-medium text-white">{capitalize(activeSkill.powerType)}</dd>
                    </div>
                  )}
                  {activeSkill.scalingStat && (
                    <div className="flex justify-between">
                      <dt className="text-[0.55rem] text-white/40">Scale</dt>
                      <dd className="text-[0.55rem] font-medium text-white">{activeSkill.scalingStat.toUpperCase()}</dd>
                    </div>
                  )}
                  {activeSkill.targets && (
                    <div className="flex justify-between">
                      <dt className="text-[0.55rem] text-white/40">Targets</dt>
                      <dd className="text-[0.55rem] font-medium text-white">{capitalize(activeSkill.targets)}</dd>
                    </div>
                  )}
                  {activeSkill.rangeType && (
                    <div className="flex justify-between">
                      <dt className="text-[0.55rem] text-white/40">Range</dt>
                      <dd className="text-[0.55rem] font-medium text-white">{capitalize(activeSkill.rangeType)}</dd>
                    </div>
                  )}
                </dl>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Base Stats */}
      <section className="mt-4">
        <div className="rounded-xl border p-3" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <p className="mb-2 text-[0.5rem] font-semibold uppercase tracking-[0.2em] text-white/40">Base Stats</p>
          {taxonomies?.stats ? (
            <StatBlock stats={statValues} config={taxonomies.stats} columns={3} />
          ) : (
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {statValues.map((s) => (
                <div key={s.statName}>
                  <p className="text-[0.45rem] uppercase tracking-widest text-white/35">{s.statName.toUpperCase()}</p>
                  <p className="font-mono text-sm font-semibold text-white">{s.value.toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Related Guides */}
      {guides.length > 0 && (
        <section className="mt-4">
          <div className="rounded-xl border p-3" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            <p className="mb-2 text-[0.5rem] font-semibold uppercase tracking-[0.2em] text-white/40">Related Guides</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {guides.map((guide) => (
                <Link
                  key={guide.slug}
                  href={`/games/${gameSlug}/guides/${guide.slug}`}
                  className="rounded-lg border p-2.5 transition hover:border-white/20"
                  style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}
                >
                  <p className="text-xs font-semibold text-white">{guide.title}</p>
                  {guide.summary && <p className="mt-0.5 text-[0.55rem] text-white/50 line-clamp-2">{guide.summary}</p>}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Roster */}
      {roster.length > 0 && (
        <section className="mt-4">
          <div className="rounded-xl border p-3" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[0.5rem] font-semibold uppercase tracking-[0.2em] text-white/40">Roster</p>
              <Link href={`/games/${gameSlug}/heroes`} className="text-[0.5rem] font-semibold uppercase tracking-[0.15em] transition" style={{ color: primaryColor }}>
                View all
              </Link>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'thin' }}>
              {roster.slice(0, 12).map((entry) => (
                <Link
                  key={entry.slug}
                  href={`/games/${gameSlug}/heroes/${entry.slug}`}
                  className={`flex-shrink-0 rounded-lg border p-2 transition ${
                    entry.slug === character.slug
                      ? 'border-white/20 bg-white/8'
                      : 'border-white/5 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]'
                  }`}
                  style={
                    entry.slug === character.slug
                      ? { borderColor: `${primaryColor}40`, background: `${primaryColor}10` }
                      : {}
                  }
                  title={entry.name}
                >
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-lg border" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                      <ImageWithFallback
                        src={entry.iconUrl ?? entry.portraitUrl}
                        alt={entry.name}
                        nameFallback={entry.name}
                        className="h-full w-full object-cover"
                        sizes="32px"
                      />
                    </div>
                    <div className="min-w-0 max-w-[80px]">
                      <p className="truncate text-[0.55rem] font-semibold text-white">{entry.name}</p>
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
