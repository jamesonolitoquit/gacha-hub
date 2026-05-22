'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

type EvidenceRecord = {
  id: number;
  gameId: number;
  evidenceType: string | null;
  sourceUrl: string | null;
  sourceHash: string | null;
  extractedData: string | null;
  confidenceScore: number | null;
  aiModel: string | null;
  claimType: string | null;
  isVerified: boolean;
  createdAt: string;
};

function confidenceColor(score: number | null): string {
  if (score === null) return 'text-white/50';
  if (score >= 90) return 'text-emerald-400';
  if (score >= 70) return 'text-amber-400';
  return 'text-red-400';
}

function truncateUrl(url: string | null, max = 60): string {
  if (!url) return '—';
  return url.length > max ? url.slice(0, max) + '…' : url;
}

export default function AdminEvidencePage() {
  const [evidence, setEvidence] = useState<EvidenceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unverified' | 'verified'>('unverified');
  const [gameFilter, setGameFilter] = useState('');

  const fetchEvidence = useCallback(async () => {
    setLoading(true);
    try {
      const base = '/api/evidence?' + new URLSearchParams({ gameId: gameFilter || 'seven-knights-rebirth' });
      const res = await fetch(base);
      const data = await res.json();
      setEvidence(Array.isArray(data) ? data : []);
    } catch {
      setEvidence([]);
    } finally {
      setLoading(false);
    }
  }, [gameFilter]);

  useEffect(() => {
    fetchEvidence();
  }, [fetchEvidence]);

  const filtered = evidence.filter((e) => {
    if (filter === 'verified') return e.isVerified;
    if (filter === 'unverified') return !e.isVerified;
    return true;
  });

  return (
    <section aria-labelledby="evidence-title">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 id="evidence-title" className="text-2xl font-semibold">Evidence Workspace</h1>
          <p className="mt-1 text-sm text-white/70">Review and verify extracted evidence records.</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="flex rounded-lg border border-white/10 bg-white/5 p-0.5">
          {(['unverified', 'all', 'verified'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${filter === f ? 'bg-sky-300 text-slate-950' : 'text-white/70 hover:text-white'}`}
            >
              {f === 'unverified' ? 'Needs Review' : f === 'verified' ? 'Verified' : 'All'}
            </button>
          ))}
        </div>

        <select
          value={gameFilter}
          onChange={(e) => setGameFilter(e.target.value)}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70"
          aria-label="Filter by game"
        >
          <option value="seven-knights-rebirth">Seven Knights: Rebirth</option>
          <option value="dragon-traveler">Dragon Traveler</option>
          <option value="brown-dust-2">Brown Dust 2</option>
        </select>

        <button
          onClick={fetchEvidence}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 transition hover:bg-white/10"
        >
          Refresh
        </button>

        <span className="text-xs text-white/50">{filtered.length} record{filtered.length === 1 ? '' : 's'}</span>
      </div>

      {loading ? (
        <p className="mt-8 text-sm text-white/50">Loading evidence records...</p>
      ) : filtered.length > 0 ? (
        <ul className="mt-6 grid gap-3" role="list">
          {filtered.map((record) => (
            <li key={record.id}>
              <Link
                href={`/admin/evidence/${record.id}`}
                className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-xl border border-white/10 bg-white/5 px-5 py-4 transition hover:border-white/20 hover:bg-white/10"
              >
                <span
                  className={`inline-flex h-2.5 w-2.5 shrink-0 rounded-full ${record.isVerified ? 'bg-emerald-500' : 'bg-amber-500'}`}
                  aria-label={record.isVerified ? 'Verified' : 'Unverified'}
                />
                <div className="min-w-0">
                  <p className="truncate font-medium text-white group-hover:text-sky-100">
                    {record.claimType ?? 'Unknown claim'}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-white/50">{truncateUrl(record.sourceUrl)}</p>
                </div>
                <span className={`shrink-0 text-xs font-semibold ${confidenceColor(record.confidenceScore)}`}>
                  {record.confidenceScore !== null ? `${record.confidenceScore}%` : '—'}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
          <p className="text-sm text-white/70">No evidence records found.</p>
          <p className="mt-2 text-xs text-white/50">Import evidence via <code className="rounded bg-white/10 px-1.5 py-0.5">scripts/import-evidence.js</code></p>
        </div>
      )}
    </section>
  );
}
