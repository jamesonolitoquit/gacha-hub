export default function TierMetaNotes({ notes }: { notes: string[] }) {
  if (notes.length === 0) return null;

  return (
    <section>
      <SectionHeading title="Meta Notes" />
      <div className="space-y-2 rounded-xl px-4 py-3" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)' }}>
        {notes.map((note, i) => (
          <p key={i} className="text-size-small leading-relaxed text-white/60">{note}</p>
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
