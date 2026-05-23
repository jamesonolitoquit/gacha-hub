import { readFileSync } from 'fs';
import { join } from 'path';
import SkillsTable from './SkillsTable';

type Skill = {
  name: string;
  character_slug: string;
  slug: string;
  type: string;
  description: string;
  order: number;
  enhancements: string[];
  transcendence: string[];
};

export default function SkillsPage() {
  const data: Skill[] = JSON.parse(
    readFileSync(join(process.cwd(), 'data', 'seeds', 'pruned', 'seven-knights-rebirth-skills.json'), 'utf8')
  );

  return (
    <section aria-labelledby="skills-title">
      <h1 id="skills-title" className="text-2xl font-semibold">Skills</h1>
      <p className="mt-1 text-sm text-white/50">{data.length.toLocaleString()} skills</p>
      <div className="mt-6">
        <SkillsTable data={data} />
      </div>
    </section>
  );
}
