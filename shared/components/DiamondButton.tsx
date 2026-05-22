'use client';

import Link from 'next/link';
import ImageWithFallback from './ImageWithFallback';
import React from 'react';

type DiamondButtonProps = {
  href: string;
  label: string;
  active?: boolean;
  iconSrc?: string | null;
  icon?: React.ReactNode;
  size?: number; // px
  primary?: string;
  secondary?: string;
};

/**
 * @deprecated Replaced by segmented tactical nav in GameSubnav.
 * Remove after verifying no remaining references.
 */
export default function DiamondButton({ href, label, active, iconSrc, icon, size = 64, primary = '#7c5cff', secondary = '#f4c542' }: DiamondButtonProps) {
  const innerSize = Math.round(size * 0.64);

  const containerStyle: React.CSSProperties = {
    width: size,
    height: size,
    transform: 'rotate(45deg)'
  };

  const innerStyle: React.CSSProperties = {
    width: innerSize,
    height: innerSize,
    transform: 'rotate(-45deg)'
  };

  const gradient = `linear-gradient(135deg, ${primary} 6%, ${secondary} 98%)`;

  const initials = label
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <Link href={href} aria-current={active ? 'page' : undefined} className="flex flex-col items-center gap-2 focus:outline-none">
      <div
        className={`relative flex items-center justify-center rounded-sm transition-shadow duration-150 focus-visible:ring-2 focus-visible:ring-offset-2`}
        style={{ ...containerStyle, boxShadow: active ? `0 10px 30px ${primary}33` : '0 6px 18px rgba(2,6,23,0.45)', background: gradient }}
      >
        <div className="flex items-center justify-center overflow-hidden rounded-sm" style={{ ...innerStyle, background: 'rgba(0,0,0,0.18)' }}>
          {iconSrc ? (
            <div className="relative w-full h-full">
              <ImageWithFallback src={iconSrc} alt={label} className="w-full h-full object-cover" nameFallback={label} />
            </div>
          ) : icon ? (
            <div className="flex h-full w-full items-center justify-center text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.55)]">
              {icon}
            </div>
          ) : (
            <span className="text-sm font-extrabold text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]" style={{ transform: 'translateY(1px)' }}>
              {initials}
            </span>
          )}
        </div>
      </div>

      <span className={`text-xs font-semibold ${active ? 'text-white' : 'text-white/80'}`}>{label}</span>
    </Link>
  );
}
