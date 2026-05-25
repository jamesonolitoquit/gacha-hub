const fs = require('fs');

const charPath = 'data/seeds/pruned/seven-knights-rebirth.json';
const skillsPath = 'data/seeds/pruned/seven-knights-rebirth-skills.json';

const chars = JSON.parse(fs.readFileSync(charPath, 'utf8'));
const skills = JSON.parse(fs.readFileSync(skillsPath, 'utf8'));

function slugify(text) {
  return String(text || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const defs = [
  { key: 'passive', suffix: 'Passive', type: 'Passive', order: 0 },
  { key: 'basic', suffix: 'Basic Attack', type: 'Basic', order: 1 },
  { key: 's1', suffix: 'Skill 1', type: 'Active', order: 2 },
  { key: 's2', suffix: 'Skill 2', type: 'Active', order: 3 },
];

const existing = new Set(skills.map((s) => s.slug));
let added = 0;

for (const c of chars) {
  const stat = c.characterClass === 'Magic' ? 'MATK' : 'PATK';
  const template = {
    passive: `Passive data pending import from source sheet for ${c.name}.`,
    basic: `1 ENEMY:\n● Deals DMG equal to 100% of ${stat}`,
    s1: `Skill 1 data pending import from source sheet for ${c.name}.`,
    s2: `Skill 2 data pending import from source sheet for ${c.name}.`,
  };

  for (const d of defs) {
    const slug = `${c.slug}-${slugify(d.suffix)}`;
    if (existing.has(slug)) continue;

    skills.push({
      name: `${c.name}'s ${d.suffix}`,
      character_slug: c.slug,
      slug,
      type: d.type,
      description: template[d.key],
      order: d.order,
    });

    existing.add(slug);
    added++;
  }
}

skills.sort((a, b) => {
  if (a.character_slug !== b.character_slug) return a.character_slug.localeCompare(b.character_slug);
  return (a.order ?? 99) - (b.order ?? 99);
});

fs.writeFileSync(skillsPath, JSON.stringify(skills, null, 2) + '\n', 'utf8');

const counts = {};
for (const s of skills) {
  counts[s.character_slug] = (counts[s.character_slug] || 0) + 1;
}

const bad = chars.filter((c) => counts[c.slug] !== 4).map((c) => ({ slug: c.slug, count: counts[c.slug] || 0 }));

console.log({
  added,
  skillCount: skills.length,
  badCount: bad.length,
  bad,
});
