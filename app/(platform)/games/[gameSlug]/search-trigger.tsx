'use client';

import { useEffect, useState } from 'react';

export default function SearchTrigger() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  function openPalette() {
    window.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'k',
      metaKey: true,
      bubbles: true,
    }));
  }

  return (
    <button
      onClick={openPalette}
      className="flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs text-white/40 transition hover:text-white/70"
      style={{ borderColor: 'rgba(255,255,255,0.1)' }}
      aria-label="Search (⌘K)"
    >
      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
      <span className="hidden sm:inline">Search</span>
      {mounted && (
        <kbd className="rounded border px-1 font-mono text-[0.55rem]" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          ⌘K
        </kbd>
      )}
    </button>
  );
}
