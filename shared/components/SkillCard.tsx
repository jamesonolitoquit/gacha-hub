'use client';

import { useState } from 'react';

type Skill = {
  id: number;
  slug: string;
  name: string;
  type?: string | null;
  description?: string | null;
  cooldownTurns?: number | null;
  cost?: number | null;
  powerType?: string | null;
  scalingStat?: string | null;
  targets?: string | null;
  rangeType?: string | null;
  enhancementText?: string | null;
  transcendenceText?: string | null;
  iconUrl?: string | null;
};

type Props = { gameSlug: string; skill: Skill };

function capitalize(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }

export default function SkillCard({ skill }: Props) {
  const [showEnhance, setShowEnhance] = useState(false);

  return (
    <div className="rounded-xl border p-3" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-[0.5rem] font-semibold uppercase tracking-[0.2em] text-sky-400">{skill.type ?? 'Skill'}</p>
            {skill.cooldownTurns != null && (
              <span className="text-[0.45rem] text-white/40">CD:{skill.cooldownTurns}t</span>
            )}
            {skill.cost != null && (
              <span className="text-[0.45rem] text-white/40">Cost:{skill.cost}</span>
            )}
          </div>
          <h4 className="mt-0.5 text-sm font-semibold text-white">{skill.name}</h4>
        </div>
        {skill.iconUrl && (
          <div className="h-8 w-8 shrink-0 overflow-hidden rounded-lg border" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            <img src={skill.iconUrl} alt="" className="h-full w-full object-cover" />
          </div>
        )}
      </div>

      {skill.description && (
        <p className="mt-1.5 text-xs text-white/65 leading-relaxed">{skill.description}</p>
      )}

      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-0.5 text-[0.5rem] text-white/40">
        {skill.powerType && <span>{capitalize(skill.powerType)}</span>}
        {skill.scalingStat && <span>Scales: {skill.scalingStat.toUpperCase()}</span>}
        {skill.targets && <span>{capitalize(skill.targets)}</span>}
        {skill.rangeType && <span>{capitalize(skill.rangeType)}</span>}
      </div>

      {(skill.enhancementText || skill.transcendenceText) && (
        <button
          onClick={() => setShowEnhance((s) => !s)}
          className="mt-2 text-[0.45rem] font-semibold uppercase tracking-[0.15em] text-white/40 hover:text-white transition"
        >
          {showEnhance ? 'Hide upgrades' : 'Show upgrades'}
        </button>
      )}

      {showEnhance && skill.enhancementText && (
        <div className="mt-2 rounded-lg border p-2" style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
          <p className="text-[0.45rem] font-semibold uppercase tracking-[0.15em] text-sky-400">Enhancement</p>
          <p className="mt-0.5 text-[0.55rem] text-white/70">{skill.enhancementText}</p>
        </div>
      )}

      {showEnhance && skill.transcendenceText && (
        <div className="mt-1.5 rounded-lg border p-2" style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
          <p className="text-[0.45rem] font-semibold uppercase tracking-[0.15em] text-amber-400">Transcendence</p>
          <p className="mt-0.5 text-[0.55rem] text-white/70">{skill.transcendenceText}</p>
        </div>
      )}
    </div>
  );
}
