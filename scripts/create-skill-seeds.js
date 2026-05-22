const fs = require('fs');
const path = require('path');

const normalizedDir = path.join(__dirname, '..', 'data', 'seeds', 'normalized');
const prunedDir = path.join(__dirname, '..', 'data', 'seeds', 'pruned');

const SKILL_TYPE_MAP = {
  passive: 'Passive',
  basicAttack: 'Basic',
  skill1: 'Active',
  skill2: 'Active',
  awakenedSkill: 'Ultimate',
};

const SKILL_NAME_SUFFIX = {
  passive: 'Passive',
  basicAttack: 'Basic Attack',
  skill1: 'Skill 1',
  skill2: 'Skill 2',
  awakenedSkill: 'Awakened Skill',
};

const SKILL_ORDER = {
  passive: 0,
  basicAttack: 1,
  skill1: 2,
  skill2: 3,
  awakenedSkill: 4,
};

function slugify(text) {
  return String(text || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function loadRosterSkills() {
  const rosterFile = path.join(normalizedDir, 'seven-knights-rebirth-roster-combined.json');
  if (!fs.existsSync(rosterFile)) {
    console.warn('No roster data found at', rosterFile);
    return {};
  }
  const heroes = JSON.parse(fs.readFileSync(rosterFile, 'utf8'));
  const map = {};
  for (const hero of heroes) {
    map[hero.slug] = hero;
  }
  console.log(`  Loaded roster data for ${Object.keys(map).length} heroes`);
  return map;
}

function buildSkillFromRoster(hero, rosterData, skillName) {
  const rosterSkill = rosterData.skills[skillName];
  if (!rosterSkill || !rosterSkill.description) return null;

  const slug = `${hero.slug}-${slugify(SKILL_NAME_SUFFIX[skillName])}`;
  const desc = rosterSkill.description;

  const skill = {
    character_slug: hero.slug,
    slug,
    name: `${hero.name}'s ${SKILL_NAME_SUFFIX[skillName]}`,
    type: SKILL_TYPE_MAP[skillName],
    description: desc,
    order: SKILL_ORDER[skillName],
  };

  if (rosterSkill.enhancements && rosterSkill.enhancements.length > 0) {
    skill.enhancements = rosterSkill.enhancements;
  }
  if (rosterSkill.transcendence && rosterSkill.transcendence.length > 0) {
    skill.transcendence = rosterSkill.transcendence;
  }

  return skill;
}

function buildPlaceholderSkill(hero, suffix, type, order) {
  const slug = `${hero.slug}-${slugify(suffix)}`;
  const desc = hero.description
    ? `A key ability for ${hero.name}. ${hero.description}`
    : `${hero.name} uses this ${type.toLowerCase()} ability in battle.`;

  return {
    character_slug: hero.slug,
    slug,
    name: `${hero.name}'s ${suffix}`,
    type,
    description: desc,
    order,
  };
}

const PLACEHOLDER_TYPES = [
  { suffix: 'Basic Attack', type: 'Basic', order: 1 },
  { suffix: 'Skill', type: 'Active', order: 2 },
  { suffix: 'Passive', type: 'Passive', order: 0 },
];

function generateSkills() {
  const heroFile = path.join(prunedDir, 'seven-knights-rebirth.json');
  if (!fs.existsSync(heroFile)) {
    console.error('No hero seed file found at', heroFile);
    process.exit(1);
  }

  const heroes = JSON.parse(fs.readFileSync(heroFile, 'utf8'));
  if (!Array.isArray(heroes)) {
    console.error('Hero seed file is not an array');
    process.exit(1);
  }

  console.log(`Loading roster skill data...`);
  const rosterMap = loadRosterSkills();
  const foundRoster = [];
  const missingRoster = [];

  const skills = [];
  const rosterSkillNames = Object.keys(SKILL_TYPE_MAP);

  for (const hero of heroes) {
    const heroSlug = hero.slug || slugify(hero.name);
    const rosterData = rosterMap[heroSlug];

    if (rosterData) {
      let anyRosterSkill = false;
      for (const skillName of rosterSkillNames) {
        const skill = buildSkillFromRoster(hero, rosterData, skillName);
        if (skill) {
          skills.push(skill);
          anyRosterSkill = true;
        }
      }
      if (anyRosterSkill) {
        foundRoster.push(hero.name);
      } else {
        missingRoster.push(hero.name);
        for (const pt of PLACEHOLDER_TYPES) {
          skills.push(buildPlaceholderSkill(hero, pt.suffix, pt.type, pt.order));
        }
      }
    } else {
      missingRoster.push(hero.name);
      for (const pt of PLACEHOLDER_TYPES) {
        skills.push(buildPlaceholderSkill(hero, pt.suffix, pt.type, pt.order));
      }
    }
  }

  if (!fs.existsSync(normalizedDir)) fs.mkdirSync(normalizedDir, { recursive: true });

  const outFile = path.join(normalizedDir, 'seven-knights-rebirth-skills.json');
  fs.writeFileSync(outFile, JSON.stringify(skills, null, 2), 'utf8');
  console.log(`\nWrote ${skills.length} skills (${heroes.length} heroes)`);
  console.log(`  Roster-sourced: ${foundRoster.length} heroes`);
  console.log(`  Placeholder:    ${missingRoster.length} heroes`);

  const prunedSkills = skills.map((s) => ({
    character_slug: s.character_slug,
    slug: s.slug,
    name: s.name,
    type: s.type,
    description: s.description,
    order: s.order,
    ...(s.enhancements ? { enhancements: s.enhancements } : {}),
    ...(s.transcendence ? { transcendence: s.transcendence } : {}),
  }));

  if (!fs.existsSync(prunedDir)) fs.mkdirSync(prunedDir, { recursive: true });
  const prunedOut = path.join(prunedDir, 'seven-knights-rebirth-skills.json');
  fs.writeFileSync(prunedOut, JSON.stringify(prunedSkills, null, 2), 'utf8');
  console.log(`Wrote pruned skills to ${path.basename(prunedOut)}`);
}

generateSkills();
