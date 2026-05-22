import Link from 'next/link';

type Props = {
  gameSlug: string;
  skill: {
    id: number;
    slug: string;
    name: string;
    type?: string | null;
    description?: string | null;
  };
};

export default function SkillCard({ gameSlug, skill }: Props) {
  return (
    <Link
      href={`/games/${gameSlug}/skills/${skill.slug}`}
      className="block rounded-2xl border border-white/10 bg-white/5 p-4 hover:border-sky-300/40 transition"
    >
      <p className="text-xs uppercase tracking-[0.25em] text-sky-300">{skill.type ?? 'Skill'}</p>
      <h4 className="mt-2 text-lg font-medium">{skill.name}</h4>
      <p className="mt-1 text-sm text-white/75">{skill.description ?? '—'}</p>
    </Link>
  );
}
