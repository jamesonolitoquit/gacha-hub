import PetCard from './PetCard';

type Props = {
  pets: {
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
  }[];
};

export default function PetIndex({ pets }: Props) {
  if (pets.length === 0) {
    return (
      <p role="status" aria-live="polite" className="text-sm text-white/40">
        No pets seeded for this game yet.
      </p>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {pets.map((pet) => (
        <PetCard key={pet.slug} pet={pet} />
      ))}
    </div>
  );
}
