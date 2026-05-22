'use client';

import { useEffect, useState } from 'react';

type RailIndicatorProps = {
  railId: string;
};

export default function RailIndicator({ railId }: RailIndicatorProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dotCount, setDotCount] = useState(0);

  useEffect(() => {
    const rail = document.getElementById(railId);
    if (!rail) return;

    const update = () => {
      const items = Array.from(rail.children).length;
      const width = Math.max(rail.clientWidth, 1);
      const index = Math.round(rail.scrollLeft / width);
      setDotCount(items);
      setActiveIndex(Math.min(Math.max(index, 0), Math.max(items - 1, 0)));
    };

    update();
    rail.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);

    return () => {
      rail.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [railId]);

  if (!dotCount || dotCount <= 1) return null;

  return (
    <div className="rail-indicator" aria-hidden="true">
      {Array.from({ length: dotCount }).map((_, index) => (
        <span key={index} className={`rail-dot${index === activeIndex ? ' active' : ''}`} />
      ))}
    </div>
  );
}
