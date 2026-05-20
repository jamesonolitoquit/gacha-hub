"use client";

import { useCallback } from 'react';

type Props = {
  railId: string;
};

export default function ScrollRailControls({ railId }: Props) {
  const scroll = useCallback((delta: number) => {
    const el = document.getElementById(railId);
    if (!el) return;
    el.scrollBy({ left: delta, behavior: 'smooth' });
  }, [railId]);

  return (
    <div className="scroll-rail-controls" aria-hidden="true">
      <button
        type="button"
        className="scroll-rail-btn left"
        onClick={() => scroll(-420)}
        aria-label="Scroll left"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        type="button"
        className="scroll-rail-btn right"
        onClick={() => scroll(420)}
        aria-label="Scroll right"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
