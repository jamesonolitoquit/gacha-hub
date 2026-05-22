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

export default function PetCard({ pet }: Props) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-sky-300/40 hover:bg-white/10">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-xs text-white/60">
          {pet.name.charAt(0)}
        </div>
        <div>
          <h3 className="text-lg font-medium text-white">{pet.name}</h3>
          <div className="flex gap-2 text-[0.55rem] uppercase tracking-[0.15em] text-white/40">
            {pet.rarity && <span>{pet.rarity}</span>}
            {pet.faction && <span>{pet.faction}</span>}
          </div>
        </div>
      </div>

      <div className="mt-3 space-y-2">
        <PassiveRow
          name={pet.passive1Name}
          description={pet.passive1Description}
          enhanced={pet.passive1Enhanced}
        />
        <PassiveRow
          name={pet.passive2Name}
          description={pet.passive2Description}
          enhanced={pet.passive2Enhanced}
        />
      </div>
    </div>
  );
}
