"use client";

import { useState } from "react";

type Props = {
  pet: {
    slug: string;
    name: string;
    rarity: string | null;
    faction: string | null;
    passive1Name: string | null;
    passive1Description: string | null;
    passive1Enhanced: string | null;
    passive2Name: string | null;
    passive2Description: string | null;
    passive2Enhanced: string | null;
    iconUrl: string | null;
  };
};

function PassiveRow({
  name,
  description,
  enhanced,
}: {
  name: string | null;
  description: string | null;
  enhanced: string | null;
}) {
  const [showEnhanced, setShowEnhanced] = useState(false);

  if (!name && !description) return null;

  return (
    <div className="rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-white/90">{name ?? "Passive"}</p>
        {enhanced && (
          <button
            onClick={() => setShowEnhanced((prev) => !prev)}
            className="text-[0.55rem] uppercase tracking-[0.15em] text-amber-400/70 hover:text-amber-400 transition"
          >
            {showEnhanced ? "Base" : "Enhanced"}
          </button>
        )}
      </div>
      <p className="mt-0.5 text-sm text-white/70">
        {showEnhanced && enhanced ? enhanced : description ?? "—"}
      </p>
    </div>
  );
}

function CompactPassiveRow({
  name,
  description,
  enhanced,
}: {
  name: string | null;
  description: string | null;
  enhanced: string | null;
}) {
  const [showEnhanced, setShowEnhanced] = useState(false);

  if (!name && !description) return null;

  return (
    <div className="rounded-lg px-2 py-1.5" style={{ background: 'rgba(255,255,255,0.02)' }}>
      <div className="flex items-center justify-between">
        <p className="text-[0.5rem] font-medium text-white/80">{name ?? "Passive"}</p>
        {enhanced && (
          <button
            onClick={() => setShowEnhanced((prev) => !prev)}
            className="text-[0.4rem] uppercase tracking-[0.15em] text-amber-400/60 hover:text-amber-400 transition"
          >
            {showEnhanced ? "Base" : "+"}
          </button>
        )}
      </div>
      <p className="mt-0.5 text-[0.55rem] text-white/60 line-clamp-2">
        {showEnhanced && enhanced ? enhanced : description ?? "—"}
      </p>
    </div>
  );
}

export default function PetCard({ pet }: Props) {
  return (
    <div className="rounded-xl border p-3 transition hover:bg-white/[0.03]" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg border text-[0.45rem] text-white/50" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          {pet.name.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-white truncate">{pet.name}</h3>
          <div className="flex gap-1.5 text-[0.45rem] uppercase tracking-[0.15em] text-white/35">
            {pet.rarity && <span>{pet.rarity}</span>}
            {pet.faction && <span>{pet.faction}</span>}
          </div>
        </div>
      </div>

      <div className="mt-2 space-y-1">
        <CompactPassiveRow
          name={pet.passive1Name}
          description={pet.passive1Description}
          enhanced={pet.passive1Enhanced}
        />
        <CompactPassiveRow
          name={pet.passive2Name}
          description={pet.passive2Description}
          enhanced={pet.passive2Enhanced}
        />
      </div>
    </div>
  );
}
