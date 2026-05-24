'use client';

import { useState } from 'react';
import TierRow from '../../../../../../features/tiers/components/TierRow';

type Props = {
  grouped: Record<string, { character: any; previousTier?: string | null; notes?: string | null }[]>;
  tierConfig: {
    tiers: string[];
    colors: Record<string, string>;
    collapsedDefault: string[];
  };
  gameSlug: string;
};

export default function TierRowView({ grouped, tierConfig, gameSlug }: Props) {
  const [showAll, setShowAll] = useState(false);

  const orderedTiers = tierConfig.tiers.filter((t) => t in grouped);
  const collapsedSet = new Set(tierConfig.collapsedDefault);

  const colors: Record<string, string> = { ...tierConfig.colors };

  return (
    <div className="mt-8 space-y-4">
      {orderedTiers.map((tierName) => {
        const entries = grouped[tierName] ?? [];
        const heroes = entries.map((e) => e.character);
        const isCollapsed = collapsedSet.has(tierName) && !showAll;

        if (entries.length === 0) return null;
        if (isCollapsed) return null;

        return (
          <TierRow
            key={tierName}
            tier={tierName}
            color={colors[tierName] ?? '#888888'}
            heroes={heroes}
            entries={entries}
            gameSlug={gameSlug}
            collapsed={isCollapsed}
          />
        );
      })}

      {collapsedSet.size > 0 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full rounded-xl border border-dashed py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/40 transition hover:text-white/70"
          style={{ borderColor: 'rgba(255,255,255,0.1)' }}
        >
          {showAll ? 'Hide lower tiers' : 'Show all tiers'}
        </button>
      )}
    </div>
  );
}
