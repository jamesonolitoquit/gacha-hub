'use client';

import { SiteHeader } from './SiteHeader';
import { GameSidebar } from './GameSidebar';
import { MobileNavSheet } from './MobileNavSheet';
import { MobileBottomNav } from './MobileBottomNav';

export function UnifiedNavbar() {
  return (
    <>
      <SiteHeader />
      <GameSidebar />
      <MobileNavSheet />
      <MobileBottomNav />
    </>
  );
}
