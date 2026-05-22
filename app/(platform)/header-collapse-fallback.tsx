"use client";

import { useEffect, useRef } from "react";

export default function HeaderCollapseFallback() {
  const ticking = useRef(false);

  useEffect(() => {
    const header = () => document.querySelector('header');

    function onScroll() {
      const y = window.scrollY || 0;

      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const el = header();
          if (!el) return;

          if (y > 48) {
            el.setAttribute('data-compact', 'true');
            el.classList.add('py-0');
            el.classList.remove('py-1', 'md:py-1.5');
          } else {
            el.removeAttribute('data-compact');
            el.classList.remove('py-0');
            el.classList.add('py-1', 'md:py-1.5');
          }

          ticking.current = false;
        });

        ticking.current = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    // run once to set initial state
    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return null;
}
