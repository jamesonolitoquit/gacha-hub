"use client";

import Image from 'next/image';
import { useState } from 'react';

function getInitials(name?: string): string {
  return (name || '')
    .split(/[^a-z0-9]+/i)
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function isDataUri(src: string): boolean {
  return src.startsWith('data:');
}

export default function ImageWithFallback({ src, alt, className, nameFallback }: { src?: string | null; alt?: string; className?: string; nameFallback?: string }) {
  const [errored, setErrored] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const initials = getInitials(nameFallback);

  if (!src || errored) {
    return (
      <div className={`flex h-full w-full items-center justify-center bg-white/6 text-white/70 ${className ?? ''}`}>
        <span className="text-lg font-semibold">{initials || '—'}</span>
      </div>
    );
  }

  if (isDataUri(src)) {
    return (
      <div className={`relative overflow-hidden bg-white/4 ${className ?? ''}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt ?? nameFallback ?? ''}
          className={`h-full w-full object-cover ${loaded ? '' : 'opacity-0'}`}
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
        />
        {!loaded && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-white/4 via-white/6 to-white/4" aria-hidden />
        )}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-white/4 ${className ?? ''}`}>
      <Image
        src={src}
        alt={alt ?? nameFallback ?? ''}
        fill
        sizes="(max-width: 640px) 144px, (max-width: 1024px) 144px, 144px"
        className={`object-cover transition-opacity ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoadingComplete={() => setLoaded(true)}
        onError={() => setErrored(true)}
      />

      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-white/4 via-white/6 to-white/4" aria-hidden />
      )}
    </div>
  );
}
