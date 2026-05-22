'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

type EvidenceRecord = {
  id: number;
  evidenceType: string | null;
  sourceUrl: string | null;
  sourceHash: string | null;
  extractedData: string | null;
  confidenceScore: number | null;
  aiModel: string | null;
  gameId: number;
  patchId: number | null;
  claimType: string | null;
  isVerified: boolean;
  verifiedBy: number | null;
  verificationNotes: string | null;
  createdAt: string;
  updatedAt: string;
};

function confidenceBadge(score: number | null) {
  if (score === null) return { label: 'No score', class: 'bg-white/10 text-white/50' };
  if (score >= 90) return { label: `${score}% — High`, class: 'bg-emerald-500/20 text-emerald-300' };
  if (score >= 70) return { label: `${score}% — Medium`, class: 'bg-amber-500/20 text-amber-300' };
  return { label: `${score}% — Low`, class: 'bg-red-500/20 text-red-300' };
}

export default function AdminEvidenceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [record, setRecord] = useState<EvidenceRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);
  const [notes, setNotes] = useState('');

  const fetchRecord = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/evidence/${params.id}`);
      if (!res.ok) {
        if (res.status === 404) setRecord(null);
        return;
      }
      const data = await res.json();
      setRecord(data);
      setNotes(data.verificationNotes ?? '');
    } catch {
      setRecord(null);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchRecord();
  }, [fetchRecord]);

  const handleAction = async (isVerified: boolean) => {
    setActing(true);
    try {
      const body: Record<string, unknown> = { isVerified, verificationNotes: notes || null };

      if (!isVerified) {
        body.deletedAt = new Date().toISOString();
      }

      await fetch(`/api/evidence/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      router.push('/admin/evidence');
    } catch {
      setActing(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-white/50">Loading evidence record...</p>;
  }

  if (!record) {
    return (
      <section>
        <h1 className="text-2xl font-semibold">Evidence Not Found</h1>
        <p className="mt-2 text-sm text-white/70">This evidence record does not exist or has been deleted.</p>
        <Link
          href="/admin/evidence"
          className="mt-6 inline-flex min-h-11 items-center rounded-full border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:border-white/20"
        >
          Back to evidence workspace
        </Link>
      </section>
    );
  }

  const badge = confidenceBadge(record.confidenceScore);
  let extractedJson = '';

  try {
    if (record.extractedData) {
      extractedJson = JSON.stringify(JSON.parse(record.extractedData), null, 2);
    }
  } catch {
    extractedJson = record.extractedData ?? '';
  }

  return (
    <section aria-labelledby="evidence-detail-title">
      <Link
        href="/admin/evidence"
        className="inline-flex items-center gap-1 text-xs text-white/50 transition hover:text-white/80"
      >
        ← Back to evidence
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 id="evidence-detail-title" className="text-2xl font-semibold">
            Evidence #{record.id}
          </h1>
          <p className="mt-1 text-sm text-white/70">{record.claimType ?? 'Claim type not specified'}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badge.class}`}>{badge.label}</span>
      </div>

      <dl className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <dt className="text-xs uppercase tracking-[0.15em] text-white/50">Type</dt>
          <dd className="mt-1 text-sm">{record.evidenceType ?? '—'}</dd>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <dt className="text-xs uppercase tracking-[0.15em] text-white/50">AI Model</dt>
          <dd className="mt-1 text-sm">{record.aiModel ?? '—'}</dd>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <dt className="text-xs uppercase tracking-[0.15em] text-white/50">Status</dt>
          <dd className="mt-1 text-sm">
            {record.isVerified ? (
              <span className="text-emerald-400">Verified</span>
            ) : (
              <span className="text-amber-400">Unverified</span>
            )}
          </dd>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <dt className="text-xs uppercase tracking-[0.15em] text-white/50">Created</dt>
          <dd className="mt-1 text-sm">{new Date(record.createdAt).toLocaleString()}</dd>
        </div>
      </dl>

      <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
        <dt className="text-xs uppercase tracking-[0.15em] text-white/50">Source URL</dt>
        <dd className="mt-1">
          {record.sourceUrl ? (
            <a
              href={record.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-sm text-sky-300 underline transition hover:text-sky-200"
            >
              {record.sourceUrl}
            </a>
          ) : (
            <span className="text-sm text-white/50">—</span>
          )}
        </dd>
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
        <dt className="text-xs uppercase tracking-[0.15em] text-white/50">Extracted Data</dt>
        <dd>
          {extractedJson ? (
            <pre className="mt-2 max-h-80 overflow-auto rounded-lg bg-slate-950/60 p-4 text-xs text-white/80">{extractedJson}</pre>
          ) : (
            <span className="mt-1 block text-sm text-white/50">No extracted data</span>
          )}
        </dd>
      </div>

      <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-sm font-semibold">Verification</h2>
        <div className="mt-3">
          <label htmlFor="notes" className="text-xs text-white/50">Verification notes</label>
          <textarea
            id="notes"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white placeholder-white/30 transition focus:border-sky-300/40 focus:outline-none"
            placeholder="Add notes about this verification..."
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            onClick={() => handleAction(true)}
            disabled={acting}
            className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-50"
          >
            {acting ? 'Saving...' : 'Approve'}
          </button>
          <button
            onClick={() => handleAction(false)}
            disabled={acting}
            className="rounded-full border border-red-500/40 px-5 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-500/10 disabled:opacity-50"
          >
            {acting ? 'Saving...' : 'Reject (soft delete)'}
          </button>
          <Link
            href="/admin/evidence"
            className="rounded-full border border-white/10 px-5 py-2 text-sm text-white/70 transition hover:border-white/30"
          >
            Cancel
          </Link>
        </div>
      </div>
    </section>
  );
}
