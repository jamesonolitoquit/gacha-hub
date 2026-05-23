import { readFileSync } from 'fs';
import { join } from 'path';
import BuildsTable from './BuildsTable';

type GearSet = {
  weapon: string;
  armor: string;
  accessory: string;
  setName: string;
};

type Build = {
  characterSlug: string;
  gameSlug: string;
  gearSet1: GearSet;
  gearSet2: GearSet;
  transcendencePath: string[];
  skillPriority: string[];
  statPriorities: string[];
  keyUsage: string[];
  exclusiveEquipment: string;
  notes: string;
};

export default function BuildsPage() {
  const data: Build[] = JSON.parse(
    readFileSync(join(process.cwd(), 'data', 'seeds', 'pruned', 'seven-knights-rebirth-builds.json'), 'utf8')
  );

  return (
    <section aria-labelledby="builds-title">
      <h1 id="builds-title" className="text-2xl font-semibold">Builds</h1>
      <p className="mt-1 text-sm text-white/50">{data.length.toLocaleString()} builds</p>
      <div className="mt-6">
        <BuildsTable data={data} />
      </div>
    </section>
  );
}
