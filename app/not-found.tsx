import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20 text-center">
      <h2 className="text-3xl font-semibold text-white">Page not found</h2>
      <p className="mt-4 text-white/75">The page you are looking for does not exist.</p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-full border border-sky-300/40 bg-sky-300/10 px-6 py-3 text-sm font-semibold text-sky-300 transition hover:bg-sky-300/20"
      >
        Go home
      </Link>
    </section>
  );
}
