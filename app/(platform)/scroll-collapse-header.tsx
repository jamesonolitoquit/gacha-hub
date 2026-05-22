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

  function publishHeight(el: HTMLElement | null, compactState: boolean) {
    try {
      if (!el) return;
      const h = Math.round(el.getBoundingClientRect().height);
      document.documentElement.style.setProperty('--platform-header-height', `${h}px`);
      document.documentElement.setAttribute('data-platform-compact', compactState ? 'true' : 'false');
    } catch (e) {
      // ignore
    }
  }

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY || 0;

      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          if (y > lastY.current && y > 48) {
            setCompact(true);
          } else if (y < lastY.current) {
            setCompact(false);
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

  // publish height on mount, on compact change, and on resize
  useEffect(() => {
    const el = headerRef.current;
    publishHeight(el, compact);

    const onResize = () => publishHeight(headerRef.current, compact);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [compact]);

  return (
    <header ref={headerRef as any} className={`sticky top-0 z-50 border-b border-white/10 bg-black/55 backdrop-blur-xl transition-all duration-200 ${compact ? 'py-0' : 'py-1 md:py-1.5'}`}>
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 md:px-6">
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
