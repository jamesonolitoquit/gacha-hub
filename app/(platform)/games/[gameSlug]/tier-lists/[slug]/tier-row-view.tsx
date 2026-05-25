'use client';

import { useMemo } from 'react';
import TierRow from '../../../../../../features/tiers/components/TierRow';

type Props = {
  grouped: Record<string, { character: any; previousTier?: string | null; notes?: string | null }[]>;
  tierConfig: {
    tiers: string[];
    colors: Record<string, string>;
  };
  gameSlug: string;
};

export default function TierRowView({ grouped, tierConfig, gameSlug }: Props) {
  const orderedTiers = useMemo(
    () => tierConfig.tiers.filter((t) => grouped[t]?.length > 0),
    [grouped, tierConfig.tiers],
  );

  return (
    <div className="space-y-3">
      {orderedTiers.map((tierName) => {
        const entries = grouped[tierName] ?? [];
        const heroes = entries.map((e) => e.character);

        return (
          <TierRow
            key={tierName}
            tier={tierName}
            color={tierConfig.colors[tierName] ?? '#888888'}
            heroes={heroes}
            entries={entries}
            gameSlug={gameSlug}
          />
        );
      })}
    </div>
  );
}
