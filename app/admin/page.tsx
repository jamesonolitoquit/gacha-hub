import Link from 'next/link';

export const metadata = {
  title: 'Admin | GachaHub',
  description: 'Internal administration workspace.',
};

const cards = [
  {
    title: 'Evidence Workspace',
    description: 'Review unverified evidence records, approve or reject extracted data.',
    href: '/admin/evidence',
    accent: 'text-sky-300',
  },
];

export default function AdminPage() {
  return (
    <section aria-labelledby="admin-title">
      <h1 id="admin-title" className="text-3xl font-semibold tracking-tight">Admin</h1>
      <p className="mt-2 text-sm text-white/70">Internal tools for content management and evidence review.</p>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-white/20 hover:bg-white/10"
          >
            <h2 className={`text-lg font-semibold ${card.accent} group-hover:brightness-110`}>{card.title}</h2>
            <p className="mt-2 text-sm text-white/70">{card.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
