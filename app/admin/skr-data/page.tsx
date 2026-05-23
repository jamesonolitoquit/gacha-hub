import { readFileSync } from 'fs';
import { join } from 'path';
import Link from 'next/link';

const sections = [
  { title: 'Characters', slug: 'characters', file: 'seven-knights-rebirth.json', accent: 'text-sky-300', description: 'All hero rosters with class, rarity, element' },
  { title: 'Skills', slug: 'skills', file: 'seven-knights-rebirth-skills.json', accent: 'text-emerald-300', description: 'Passive, Basic, S1, S2, Ult with enhancements' },
  { title: 'Builds', slug: 'builds', file: 'seven-knights-rebirth-builds.json', accent: 'text-amber-300', description: 'Gear sets, transcendence paths, stat priorities' },
  { title: 'Gear', slug: 'gear', file: 'seven-knights-rebirth-gear.json', accent: 'text-rose-300', description: 'Gear sets with set bonuses and sources' },
  { title: 'Pets', slug: 'pets', file: 'seven-knights-rebirth-pets.json', accent: 'text-purple-300', description: 'Pets with rarities, factions, passives' },
];

function getCount(file: string): number {
  try {
    const raw = readFileSync(join(process.cwd(), 'data', 'seeds', 'pruned', file), 'utf8');
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data.length : 0;
  } catch {
    return -1;
  }
}

export default function SkrDataPage() {
  return (
    <section aria-labelledby="skr-data-title">
      <h1 id="skr-data-title" className="text-2xl font-semibold">SKR Data Viewer</h1>
      <p className="mt-1 text-sm text-white/50">
        Raw seed data for <span className="font-medium text-white/80">Seven Knights: Rebirth</span>. All data is read directly from <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">data/seeds/pruned/</code>.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {sections.map((s) => {
          const count = getCount(s.file);
          return (
            <Link
              key={s.slug}
              href={`/admin/skr-data/${s.slug}`}
              className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-white/20 hover:bg-white/10"
            >
              <div className="flex items-center justify-between">
                <h2 className={`text-lg font-semibold ${s.accent} group-hover:brightness-110`}>{s.title}</h2>
                {count >= 0 ? (
                  <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium text-white/60">
                    {count.toLocaleString()}
                  </span>
                ) : (
                  <span className="rounded-full bg-red-500/20 px-2.5 py-0.5 text-xs text-red-400">Error</span>
                )}
              </div>
              <p className="mt-2 text-sm text-white/50">{s.description}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
