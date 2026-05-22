'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('GachaHub error:', error);
  }, [error]);

  return (
    <section className="mx-auto max-w-6xl px-6 py-20 text-center">
      <h2 className="text-3xl font-semibold text-white">Something went wrong</h2>
      <p className="mt-4 text-white/75">{error.message || 'An unexpected error occurred.'}</p>
      <button
        onClick={reset}
        className="mt-8 rounded-full border border-sky-300/40 bg-sky-300/10 px-6 py-3 text-sm font-semibold text-sky-300 transition hover:bg-sky-300/20"
      >
        Try again
      </button>
    </section>
  );
}
