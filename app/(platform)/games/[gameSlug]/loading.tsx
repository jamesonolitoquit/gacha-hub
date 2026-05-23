export default function Loading() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-12">
      <div className="mb-12 flex flex-col gap-4">
        <div className="h-10 w-64 animate-pulse rounded-full bg-white/5" />
        <div className="h-5 w-96 animate-pulse rounded-full bg-white/5" />
      </div>

      <div className="mb-12 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-2xl bg-white/5" style={{ aspectRatio: '3/4' }} />
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <div className="h-8 w-48 animate-pulse rounded-full bg-white/5" />
        <div className="h-24 w-full animate-pulse rounded-2xl bg-white/5" />
      </div>
    </section>
  );
}
