"use client";

import { useEffect, useRef, useState } from "react";
import { GameSwitcher, GameSwitcherItem } from "./game-switcher";
import { PlatformNav } from "./platform-nav";
import HeaderSearch from "../../features/search/components/HeaderSearch";

type Props = {
  games: GameSwitcherItem[];
};

export default function ScrollCollapseHeader({ games }: Props) {
  const [compact, setCompact] = useState(false);
  const lastY = useRef(0);
  const ticking = useRef(false);
  const headerRef = useRef<HTMLElement | null>(null);
  const compactRef = useRef(compact);

  function publishHeight(el: HTMLElement | null, compactState: boolean) {
    try {
      if (!el) return;
      // Use offsetHeight to get an integer height and avoid fractional layout jumps
      const h = Math.round(el.offsetHeight || el.getBoundingClientRect().height);
      document.documentElement.style.setProperty('--platform-header-height', `${h}px`);
      document.documentElement.setAttribute('data-platform-compact', compactState ? 'true' : 'false');
    } catch (e) {
      // ignore
    }
  }

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY || 0;

      // small hysteresis to avoid toggling on tiny scroll jitters
      const DELTA = 12;

      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const dy = y - lastY.current;
          // enter compact when scrolling down past threshold
          if (dy > DELTA && y > 48) {
            if (!compactRef.current) {
              setCompact(true);
              compactRef.current = true;
            }
          }

          // exit compact when scrolling up past threshold
          if (lastY.current - y > DELTA) {
            if (compactRef.current) {
              setCompact(false);
              compactRef.current = false;
            }
          }

          lastY.current = y;
          ticking.current = false;
        });

        ticking.current = true;
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // publish the stable layout height on mount and resize only.
  // The header's visual collapse now happens inside that fixed height.
  useEffect(() => {
    // keep the ref in sync if compact changes externally
    compactRef.current = compact;

    const el = headerRef.current;
    publishHeight(el, compact);

    const onResize = () => publishHeight(headerRef.current, compact);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <header
      ref={headerRef as any}
      className="sticky top-0 z-50 overflow-hidden border-b border-white/10 bg-black/55 backdrop-blur-xl"
      style={{ minHeight: 'var(--platform-header-height, 60px)' }}
    >
      <div className={`mx-auto flex max-w-6xl items-center gap-3 px-4 md:px-6 transition-transform duration-200 ${compact ? 'translate-y-0 md:translate-y-[-1px] scale-[0.985]' : 'translate-y-0 scale-100'}`}>
        <GameSwitcher games={games} compact={compact} />
        <div className="hidden md:block flex-1 max-w-[200px]">
          {!compact && <HeaderSearch />}
        </div>
        <div className="md:ml-auto">
          <PlatformNav compact={compact} />
        </div>
      </div>
    </header>
  );
}
