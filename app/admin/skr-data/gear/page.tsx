import { readFileSync } from 'fs';
import { join } from 'path';
import GearTable from './GearTable';

type Gear = {
  slug: string;
  name: string;
  source: string;
  twoPieceEffect: string;
  fourPieceEffect: string;
  tags: string[];
};

export default function GearPage() {
  const data: Gear[] = JSON.parse(
    readFileSync(join(process.cwd(), 'data', 'seeds', 'pruned', 'seven-knights-rebirth-gear.json'), 'utf8')
  );

  return (
    <section aria-labelledby="gear-title">
      <h1 id="gear-title" className="text-2xl font-semibold">Gear Sets</h1>
      <p className="mt-1 text-sm text-white/50">{data.length.toLocaleString()} gear sets</p>
      <div className="mt-6">
        <GearTable data={data} />
      </div>
    </section>
  );
}
