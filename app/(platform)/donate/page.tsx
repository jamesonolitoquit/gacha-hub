import { Heart } from 'lucide-react';

export default function DonatePage() {
  return (
    <section className="max-w-xl mx-auto text-center py-20">
      <Heart className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--accent)' }} />
      <h1 className="text-3xl font-semibold" style={{ color: 'var(--foreground)' }}>Support GachaHub</h1>
      <p className="mt-3" style={{ color: 'var(--muted)' }}>
        Donations are coming soon. Your support helps keep the archive alive.
      </p>
    </section>
  );
}
