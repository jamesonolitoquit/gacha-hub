"use client";

import { useEffect, useRef } from 'react';

type Props = {
  src?: string | null;
  alt?: string;
  open: boolean;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
};

export default function Lightbox({ src, alt = '', open, onClose, onPrev, onNext }: Props) {
  const touchStartX = useRef<number | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const prevActive = useRef<Element | null>(null);

  useEffect(() => {
    if (!open) return;

    // Save previously focused element to restore later
    prevActive.current = document.activeElement;

    // Focus close button when opening
    if (closeRef.current) {
      try {
        closeRef.current.focus();
      } catch {}
    }

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'ArrowLeft' && typeof onPrev === 'function') {
        e.preventDefault();
        onPrev();
        return;
      }

      if (e.key === 'ArrowRight' && typeof onNext === 'function') {
        e.preventDefault();
        onNext();
        return;
      }

      // Trap focus inside the dialog on Tab/Shift+Tab
      if (e.key === 'Tab') {
        const container = containerRef.current;
        if (!container) return;
        const focusable = Array.from(
          container.querySelectorAll<HTMLElement>(
            'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable]'
          )
        ).filter(Boolean) as HTMLElement[];

        if (focusable.length === 0) {
          e.preventDefault();
          closeRef.current?.focus();
          return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKey);

    return () => {
      document.removeEventListener('keydown', handleKey);

      // Restore focus to previous element when closing
      if (prevActive.current && (prevActive.current as HTMLElement).focus) {
        try {
          (prevActive.current as HTMLElement).focus();
        } catch {}
      }
      prevActive.current = null;
    };
  }, [open, onClose, onPrev, onNext]);

  if (!open || !src) return null;

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const threshold = 50;
    if (dx > threshold && typeof onPrev === 'function') onPrev();
    if (dx < -threshold && typeof onNext === 'function') onNext();
    touchStartX.current = null;
  }

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div className="max-h-full max-w-full overflow-auto" onClick={(e) => e.stopPropagation()} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <button
          ref={closeRef}
          aria-label="Close dialog"
          onClick={onClose}
          className="absolute right-4 top-4 z-60 rounded bg-black/60 px-3 py-1 text-white backdrop-blur"
        >
          ✕
        </button>

        <div className="flex items-center gap-3">
          <button aria-label="Previous" onClick={onPrev} className="rounded-full bg-black/40 p-2 text-white/90 hover:scale-105 transform-gpu transition-transform">◀</button>
          <img src={src} alt={alt} className="max-h-[80vh] max-w-[82vw] object-contain transition-transform duration-300 ease-out transform-gpu" />
          <button aria-label="Next" onClick={onNext} className="rounded-full bg-black/40 p-2 text-white/90 hover:scale-105 transform-gpu transition-transform">▶</button>
        </div>
      </div>
    </div>
  );
}
