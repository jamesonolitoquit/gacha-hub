import GearCard from './GearCard';

type Props = {
  gearSets: {
    slug: string;
    name: string;
    source: string | null;
    twoPieceEffect: string | null;
    fourPieceEffect: string | null;
    description: string | null;
    tags: string[] | null;
  }[];
};

export default function GearIndex({ gearSets }: Props) {
  if (gearSets.length === 0) {
    return (
      <p role="status" aria-live="polite" className="text-sm text-white/40">
        No gear sets seeded for this game yet.
      </p>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {gearSets.map((gearSet) => (
        <GearCard key={gearSet.slug} gear={gearSet} />
      ))}
    </div>
  );
}
