import { readFileSync } from 'fs';
import { join } from 'path';
import CharacterTable from './CharacterTable';

type Character = {
  name: string;
  slug: string;
  characterClass: string;
  rarity: string;
  element: string | null;
  description: string | null;
};

export default function CharactersPage() {
  const data: Character[] = JSON.parse(
    readFileSync(join(process.cwd(), 'data', 'seeds', 'pruned', 'seven-knights-rebirth.json'), 'utf8')
  );

  return (
    <section aria-labelledby="characters-title">
      <h1 id="characters-title" className="text-2xl font-semibold">Characters</h1>
      <p className="mt-1 text-sm text-white/50">{data.length.toLocaleString()} heroes</p>
      <div className="mt-6">
        <CharacterTable data={data} />
      </div>
    </section>
  );
}
