import SkillCard from './SkillCard';

export default function SkillList({ gameSlug, groups }: { gameSlug: string; groups: { characterId: number; characterSlug: string; characterName: string; skills: any[] }[] }) {
  if (!groups || groups.length === 0) {
    return <p className="text-xs text-white/50">No skills available yet.</p>;
  }

  return (
    <div className="space-y-5">
      {groups.map((g) => (
        <section key={g.characterId}>
          <p className="mb-2 text-[0.55rem] font-semibold uppercase tracking-[0.2em] text-white/40">{g.characterName}</p>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {g.skills.map((s) => (
              <SkillCard key={s.id} gameSlug={gameSlug} skill={s} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
