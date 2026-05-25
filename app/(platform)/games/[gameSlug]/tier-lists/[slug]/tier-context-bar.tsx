type PatchSummary = {
  version?: string | null;
  displayName?: string | null;
  title?: string | null;
};

export default function TierContextBar({
  patch,
  updatedAt,
}: {
  patch?: PatchSummary | null;
  updatedAt?: Date | string | null;
}) {
  const patchLabel = patch?.version ?? patch?.displayName ?? patch?.title;

  return (
    <div
      className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-xl px-4 py-2.5 text-size-tiny"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)' }}
    >
      {patchLabel && (
        <span className="text-white/50">
          Patch: <span className="font-medium text-white/80">{patchLabel}</span>
        </span>
      )}
      {updatedAt && (
        <span className="text-white/50">
          Updated: <span className="font-medium text-white/80">{timeAgo(updatedAt)}</span>
        </span>
      )}
    </div>
  );
}

function timeAgo(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const diff = Date.now() - d.getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 1) return 'Today';
  if (days === 1) return '1d ago';
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}
