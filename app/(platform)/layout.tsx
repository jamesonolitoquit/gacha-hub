import { ReactNode } from 'react';
import { GameProvider } from '../../platform/components/game-provider';
import { ThemeApplier } from '../../platform/components/ThemeApplier';
import { UnifiedNavbar } from '../../platform/components/UnifiedNavbar';
import SearchProvider from '../../features/search/components/SearchProvider';
import { AppShell } from './app-shell';

export default function PlatformLayout({ children }: { children: ReactNode }) {
  return (
    <GameProvider>
      <ThemeApplier>
        <SearchProvider>
          <UnifiedNavbar />
          <AppShell
            skipTargetId="platform-main"
            skipLabel="Skip to main content"
          >
            {children}
          </AppShell>
        </SearchProvider>
      </ThemeApplier>
    </GameProvider>
  );
}
