import Link from 'next/link';

export default function PlatformNotFound() {
  return (
    <section aria-labelledby="not-found-title" className="mx-auto flex min-h-[60vh] max-w-6xl flex-col items-center justify-center px-6 text-center">
      <h1 id="not-found-title" className="text-5xl font-semibold tracking-tight">404</h1>
      <p className="mt-4 text-lg text-white/70">This page does not exist in the GachaHub realm.</p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/"
          className="rounded-xl bg-sky-300 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-sky-200"
        >
          Return home
        </Link>
        <Link
          href="/games"
          className="rounded-xl border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          Browse games
        </Link>
      </div>
    </section>
  );
}
