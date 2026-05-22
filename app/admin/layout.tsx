import Link from 'next/link';
import { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-slate-900/80 px-6 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-sm font-semibold tracking-[0.15em] text-sky-300 uppercase">
              Admin
            </Link>
            <span className="text-white/20">|</span>
            <Link href="/" className="text-xs text-white/50 transition hover:text-white/80">
              Back to site
            </Link>
          </div>
        </div>
      </header>
      <div className="mx-auto flex max-w-6xl gap-6 px-6 py-8">
        <nav className="hidden w-48 shrink-0 flex-col gap-2 md:flex" aria-label="Admin navigation">
          <Link
            href="/admin"
            className="rounded-lg px-3 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
          >
            Home
          </Link>
          <Link
            href="/admin/evidence"
            className="rounded-lg px-3 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
          >
            Evidence
          </Link>
        </nav>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
