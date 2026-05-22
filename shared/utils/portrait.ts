const ROLE_GRADIENTS: Record<string, [string, string]> = {
  Attack: ['#ef4444', '#f97316'],
  Attacker: ['#ef4444', '#f97316'],
  Defense: ['#3b82f6', '#14b8a6'],
  Defender: ['#3b82f6', '#14b8a6'],
  Magic: ['#a855f7', '#8b5cf6'],
  Magician: ['#a855f7', '#8b5cf6'],
  Support: ['#22c55e', '#10b981'],
  Universal: ['#f59e0b', '#eab308'],
};

const DEFAULT_GRADIENT: [string, string] = ['#64748b', '#475569'];

function getInitials(name: string): string {
  return (name || '')
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('')
    .padEnd(1, '—');
}

export function generatePlaceholderPortraitUrl(name: string, role?: string | null): string {
  const initials = getInitials(name);
  const [c1, c2] = role ? ROLE_GRADIENTS[role] ?? DEFAULT_GRADIENT : DEFAULT_GRADIENT;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${c1}" />
        <stop offset="100%" stop-color="${c2}" />
      </linearGradient>
      <linearGradient id="s" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="rgba(255,255,255,0.20)" />
        <stop offset="100%" stop-color="rgba(255,255,255,0.04)" />
      </linearGradient>
    </defs>
    <rect width="300" height="300" fill="url(#g)" rx="16" />
    <rect width="300" height="300" fill="url(#s)" rx="16" />
    <text x="150" y="155" text-anchor="middle" dominant-baseline="central"
      font-family="system-ui, -apple-system, sans-serif" font-size="120" font-weight="700"
      fill="rgba(255,255,255,0.85)">${initials}</text>
  </svg>`;

  const base64 = typeof Buffer !== 'undefined'
    ? Buffer.from(svg, 'utf8').toString('base64')
    : btoa(unescape(encodeURIComponent(svg)));
  return `data:image/svg+xml;base64,${base64}`;
}

export function isDataUri(src: string): boolean {
  return src.startsWith('data:');
}
