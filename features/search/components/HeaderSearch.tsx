'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function HeaderSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q.length < 2) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
    setQuery('');
  };

  return (
    <form onSubmit={submit} className="relative w-full max-w-[180px]">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search…"
        aria-label="Search across games"
        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white placeholder:text-white/30 outline-none transition focus:border-sky-300/50"
      />
      <kbd className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 text-[0.5rem] text-white/30 md:inline">
        ⌘K
      </kbd>
    </form>
  );
}
