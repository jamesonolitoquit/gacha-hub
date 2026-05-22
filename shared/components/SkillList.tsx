import SkillCard from './SkillCard';

type Skill = {
  id: number;
  slug: string;
  name: string;
  type?: string | null;
  description?: string | null;
};

/**
 * @deprecated External reference count: 0.
 * Remove after confirming no imports remain.
 */
export default function SkillList({ gameSlug, groups }: { gameSlug: string; groups: { characterId: number; characterSlug: string; characterName: string; skills: Skill[] }[] }) {
  if (!groups || groups.length === 0) {
    return <p className="text-white/75">No skills available yet.</p>;
  }

  return (
    <div className="space-y-6">
      {groups.map((g) => (
        <section key={g.characterId} aria-labelledby={`char-${g.characterSlug}`}>
          <h3 id={`char-${g.characterSlug}`} className="text-xl font-medium">{g.characterName}</h3>
          <div className="mt-3 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {g.skills.map((s) => (
              <div key={s.id}>
                <SkillCard gameSlug={gameSlug} skill={s} />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
