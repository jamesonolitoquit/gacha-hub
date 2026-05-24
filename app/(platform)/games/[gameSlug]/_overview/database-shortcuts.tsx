import Link from 'next/link';

type Shortcut = {
  label: string;
  href: string;
  icon: string;
};

export default function DatabaseShortcuts({ gameSlug }: { gameSlug: string }) {
  const shortcuts: Shortcut[] = [
    { label: 'Heroes', href: `/games/${gameSlug}/characters`, icon: 'User' },
    { label: 'Skills', href: `/games/${gameSlug}/skills`, icon: 'Sparkles' },
    { label: 'Gear', href: `/games/${gameSlug}/database/gear`, icon: 'Shield' },
    { label: 'Pets', href: `/games/${gameSlug}/database/pets`, icon: 'Heart' },
  ];

  return (
    <section>
      <SectionHeading title="Browse Database" />

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {shortcuts.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="flex items-center gap-2 rounded-xl px-3 py-2.5 transition hover:-translate-y-0.5"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)' }}
          >
            <Icon name={s.icon} />
            <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{s.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <h2 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{title}</h2>
      <span className="h-px flex-1" style={{ background: 'var(--border-color)' }} />
    </div>
  );
}

function Icon({ name }: { name: string }) {
  return (
    <svg className="h-4 w-4 shrink-0 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {name === 'User' && <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>}
      {name === 'Sparkles' && <><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></>}
      {name === 'Shield' && <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />}
      {name === 'Heart' && <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />}
    </svg>
  );
}
