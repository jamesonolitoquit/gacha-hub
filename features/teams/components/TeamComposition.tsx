import Link from 'next/link';

type GearRecommendations = Record<string, { setName: string; weapon: string; armor: string; accessory: string }>;

type Props = {
  characterSlugs: string[];
  characterNames: Record<string, string>;
  gearRecommendations?: GearRecommendations | null;
  gameSlug: string;
};

export default function TeamComposition({ characterSlugs, characterNames, gearRecommendations, gameSlug }: Props) {
  return (
    <div>
      <p className="mb-4 text-xs uppercase tracking-[0.3em] text-white/40">Team Composition</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {characterSlugs.map((slug) => {
          const gear = gearRecommendations?.[slug];
          const name = characterNames[slug] ?? slug.replace(/-/g, ' ');

          return (
            <div
              key={slug}
              className="rounded-xl border border-white/10 bg-white/[0.02] p-4"
            >
              <Link
                href={`/games/${gameSlug}/characters/${slug}`}
                className="text-sm font-semibold text-white transition hover:text-sky-100"
              >
                {name}
              </Link>

              {gear && (
                <div className="mt-3 space-y-1 text-xs text-white/60">
                  <p className="text-[0.55rem] uppercase tracking-[0.15em] text-white/40">Gear</p>
                  <p className="font-medium text-white/80">{gear.setName}</p>
                  <div className="flex justify-between">
                    <span>Weapon</span>
                    <span className="text-white/70">{gear.weapon}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Armor</span>
                    <span className="text-white/70">{gear.armor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Accessory</span>
                    <span className="text-white/70">{gear.accessory}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
