"use client";

import { useEffect, useState } from 'react';

type Props = { railId: string };

export default function RailIndicator({ railId }: Props) {
  const [count, setCount] = useState(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = document.getElementById(railId);
    if (!el) return;

    const update = () => {
      const children = Array.from(el.children).filter((c) => (c as HTMLElement).classList.contains('fantasy-card'));
      setCount(children.length);
      if (children.length === 0) return;
      // find the child whose left is nearest to scrollLeft
      const scrollLeft = el.scrollLeft;
      let nearest = 0;
      let nearestDiff = Infinity;
      children.forEach((child, idx) => {
        const c = child as HTMLElement;
        const diff = Math.abs(c.offsetLeft - scrollLeft);
        if (diff < nearestDiff) {
          nearest = idx;
          nearestDiff = diff;
        }
      });
      setActive(nearest);
    };

    update();
    el.addEventListener('scroll', update, { passive: true });
    // keyboard navigation: left/right arrow to move between cards
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key !== 'ArrowLeft' && ev.key !== 'ArrowRight') return;
      ev.preventDefault();
      const children = Array.from(el.children).filter((c) => (c as HTMLElement).classList.contains('fantasy-card')) as HTMLElement[];
      if (children.length === 0) return;
      // find current nearest
      const scrollLeft = el.scrollLeft;
      let nearest = 0;
      let nearestDiff = Infinity;
      children.forEach((child, idx) => {
        const diff = Math.abs(child.offsetLeft - scrollLeft);
        if (diff < nearestDiff) {
          nearest = idx;
          nearestDiff = diff;
        }
      });
      let target = nearest + (ev.key === 'ArrowRight' ? 1 : -1);
      if (target < 0) target = 0;
      if (target >= children.length) target = children.length - 1;
      const child = children[target];
      if (child) el.scrollTo({ left: child.offsetLeft, behavior: 'smooth' });
    };
    el.addEventListener('keydown', onKey as any);
    window.addEventListener('resize', update);

    return () => {
      el.removeEventListener('scroll', update);
      el.removeEventListener('keydown', onKey as any);
      window.removeEventListener('resize', update);
    };
  }, [railId]);

  if (count <= 1) return null;

  return (
    <div className="rail-indicator" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          type="button"
          className={`rail-dot ${i === active ? 'active' : ''}`}
          onClick={() => {
            const el = document.getElementById(railId);
            if (!el) return;
            const child = Array.from(el.children).filter((c) => (c as HTMLElement).classList.contains('fantasy-card'))[i] as HTMLElement;
            if (!child) return;
            el.scrollTo({ left: child.offsetLeft, behavior: 'smooth' });
          }}
        />
      ))}
    </div>
  );
}
