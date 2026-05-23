import { readFileSync } from 'fs';
import { join } from 'path';
import PetsTable from './PetsTable';

type Pet = {
  slug: string;
  name: string;
  rarity: string;
  faction: string | null;
  passive1Name: string;
  passive1Description: string;
  passive1Enhanced: string;
  passive2Name: string;
  passive2Description: string;
  passive2Enhanced: string;
};

export default function PetsPage() {
  const data: Pet[] = JSON.parse(
    readFileSync(join(process.cwd(), 'data', 'seeds', 'pruned', 'seven-knights-rebirth-pets.json'), 'utf8')
  );

  return (
    <section aria-labelledby="pets-title">
      <h1 id="pets-title" className="text-2xl font-semibold">Pets</h1>
      <p className="mt-1 text-sm text-white/50">{data.length.toLocaleString()} pets</p>
      <div className="mt-6">
        <PetsTable data={data} />
      </div>
    </section>
  );
}
