'use client';

import { useState } from 'react';
import Link from 'next/link';

type BuildGearSet = {
  weapon: string;
  armor: string;
  accessory: string;
  setName: string;
};

type Props = {
  build: {
    characterSlug: string;
    characterName: string;
    gearSet1: BuildGearSet;
    gearSet2?: BuildGearSet;
    keyUsage?: string[];
    statPriorities: string[];
    skillPriority?: string[];
    transcendencePath?: string[];
    exclusiveEquipment?: string;
    notes?: string;
  };
  gameSlug: string;
};

const MODE_LABELS: Record<string, string> = { pve: 'PVE', pvp: 'PVP', raid: 'Raid' };
const MODE_COLORS: Record<string, string> = { pve: '#33b5e5', pvp: '#ff4444', raid: '#aa66cc' };

export default function BuildCard({ build, gameSlug }: Props) {
  const [showAlt, setShowAlt] = useState(false);

  const activeGear = showAlt && build.gearSet2 ? build.gearSet2 : build.gearSet1;

  return (
    <div className="rounded-xl border p-3 transition hover:bg-white/[0.03]" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <Link href={`/games/${gameSlug}/characters/${build.characterSlug}`} className="text-sm font-semibold text-white hover:text-sky-300 transition truncate block">
            {build.characterName}
          </Link>
          <p className="mt-0.5 text-[0.55rem] text-white/50">{activeGear.setName}</p>
        </div>
        <div className="flex shrink-0 gap-1">
          {(build.keyUsage ?? []).map((mode) => {
            const color = MODE_COLORS[mode] ?? '#888';
            return (
              <span key={mode} className="inline-block rounded px-1.5 py-0.5 text-[0.45rem] font-bold uppercase tracking-[0.15em]" style={{ background: `${color}18`, color }}>
                {MODE_LABELS[mode] ?? mode}
              </span>
            );
          })}
        </div>
      </div>

      {/* Gear Set toggle */}
      <div className="mt-2 flex items-center gap-2">
        <span className="text-[0.45rem] font-medium text-white/40">{activeGear.weapon} · {activeGear.armor} · {activeGear.accessory}</span>
        {build.gearSet2 && (
          <button onClick={() => setShowAlt((s) => !s)} className="text-[0.4rem] uppercase tracking-[0.15em] text-white/35 hover:text-white/70 transition">
            {showAlt ? 'Primary' : 'Alt'}
          </button>
        )}
      </div>

      {build.exclusiveEquipment && (
        <div className="mt-1.5 rounded-lg px-2 py-1" style={{ background: '#aa66cc12' }}>
          <span className="text-[0.4rem] font-semibold uppercase tracking-[0.15em]" style={{ color: '#aa66cc' }}>Exclusive</span>
          <span className="ml-1 text-[0.5rem] text-white/60">{build.exclusiveEquipment}</span>
        </div>
      )}

      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-0.5">
        <div>
          <p className="text-[0.4rem] font-semibold uppercase tracking-[0.15em] text-white/35">Stats</p>
          <div className="flex flex-wrap gap-x-1.5 gap-y-0.5 mt-0.5">
            {build.statPriorities.map((stat) => (
              <span key={stat} className="text-[0.5rem] font-medium text-white/60">{stat}</span>
            ))}
          </div>
        </div>
        {build.skillPriority && build.skillPriority.length > 0 && (
          <div>
            <p className="text-[0.4rem] font-semibold uppercase tracking-[0.15em] text-white/35">Skills</p>
            <div className="flex flex-wrap gap-x-1.5 gap-y-0.5 mt-0.5">
              {build.skillPriority.map((sk) => (
                <span key={sk} className="text-[0.5rem] font-medium text-white/60 capitalize">{sk.replace(/-/g, ' ')}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {build.transcendencePath && build.transcendencePath.length > 0 && (
        <div className="mt-2 flex items-center gap-1 text-[0.5rem] text-white/40">
          <span className="text-[0.4rem] font-semibold uppercase tracking-[0.15em] text-white/35">Transcend</span>
          {build.transcendencePath.map((step, i, arr) => (
            <span key={step}>
              <span className="text-white/60">{step}</span>
              {i < arr.length - 1 && <span className="mx-0.5 text-white/20">→</span>}
            </span>
          ))}
        </div>
      )}

      {build.notes && (
        <p className="mt-1.5 text-[0.5rem] text-white/40 line-clamp-2 italic">{build.notes}</p>
      )}
    </div>
  );
}
