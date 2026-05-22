'use client';

import { useEffect, useState } from 'react';

type ScrollRailControlsProps = {
  railId: string;
};

export default function ScrollRailControls({ railId }: ScrollRailControlsProps) {
  const [canScroll, setCanScroll] = useState(false);

  useEffect(() => {
    const rail = document.getElementById(railId);
    if (!rail) return;

    const updateCanScroll = () => {
      setCanScroll(rail.scrollWidth > rail.clientWidth + 8);
    };

    updateCanScroll();
    window.addEventListener('resize', updateCanScroll);

    return () => window.removeEventListener('resize', updateCanScroll);
  }, [railId]);

  const scrollRail = (direction: 'left' | 'right') => {
    const rail = document.getElementById(railId);
    if (!rail) return;

    const amount = Math.max(rail.clientWidth * 0.72, 280);
    rail.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  if (!canScroll) return null;

  return (
    <div className="scroll-rail-controls" aria-hidden="true">
      <button type="button" className="scroll-rail-btn left" onClick={() => scrollRail('left')} aria-label="Scroll left">
        ←
      </button>
      <button type="button" className="scroll-rail-btn right" onClick={() => scrollRail('right')} aria-label="Scroll right">
        →
      </button>
    </div>
  );
}
