import Link from 'next/link';
import ImageWithFallback from '../../../shared/components/ImageWithFallback';

type Character = {
  slug: string;
  name: string;
  rarity?: string | number | null;
  element?: string | null;
  characterClass?: string | null;
  role?: string | null;
  portraitUrl?: string | null;
  iconUrl?: string | null;
};

type GearRecommendations = Record<string, { setName: string; weapon: string; armor: string; accessory: string }>;

type Props = {
  characters: Character[];
  gearRecommendations?: GearRecommendations | null;
  gameSlug: string;
};

const ELEMENT_COLORS: Record<string, string> = {
  fire: '#e74c3c', ice: '#3498db', light: '#f1c40f', dark: '#8e44ad',
  water: '#3498db', wind: '#2ecc71',
};

export default function TeamComposition({ characters, gearRecommendations, gameSlug }: Props) {
  return (
    <div className="p-4">
      <p className="mb-3 text-[0.55rem] font-semibold uppercase tracking-[0.2em] text-white/40">Team Composition</p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {characters.map((char) => {
          const gear = gearRecommendations?.[char.slug];
          const elemColor = ELEMENT_COLORS[char.element?.toLowerCase() ?? ''] ?? '#888';

          return (
            <div key={char.slug} className="rounded-xl border p-3" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-2">
                <Link href={`/games/${gameSlug}/characters/${char.slug}`} className="h-9 w-9 shrink-0 overflow-hidden rounded-lg border" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                  <ImageWithFallback src={char.portraitUrl ?? char.iconUrl} alt={char.name} nameFallback={char.name} className="h-full w-full object-cover" sizes="36px" />
                </Link>
                <div className="min-w-0">
                  <Link href={`/games/${gameSlug}/characters/${char.slug}`} className="text-sm font-semibold text-white hover:text-sky-200 transition truncate block">
                    {char.name}
                  </Link>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {char.rarity && <span className="text-[0.45rem] font-medium text-white/50">{char.rarity}</span>}
                    {char.element && <span className="text-[0.45rem] font-medium" style={{ color: elemColor }}>{char.element}</span>}
                    {char.characterClass && <span className="text-[0.45rem] uppercase tracking-[0.1em] text-white/35">{char.characterClass}</span>}
                  </div>
                </div>
              </div>

              {gear && (
                <div className="mt-2 space-y-0.5 text-[0.5rem]">
                  <p className="font-medium text-white/70">{gear.setName}</p>
                  <p className="text-white/40">{gear.weapon} · {gear.armor} · {gear.accessory}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
