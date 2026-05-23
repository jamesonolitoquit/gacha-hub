import { ReactNode } from 'react';

type AppShellProps = {
  skipTargetId: string;
  skipLabel: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AppShell({ skipTargetId, skipLabel, children, footer }: AppShellProps) {
  return (
    <div className="min-h-screen pt-12 pb-14 md:pb-0 lg:pl-12">
      <a
        href={`#${skipTargetId}`}
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-40 focus:rounded focus:bg-sky-300 focus:px-4 focus:py-2 focus:font-semibold focus:text-slate-950"
      >
        {skipLabel}
      </a>

      <main id={skipTargetId} className="pb-16">
        {children}
      </main>

      {footer}
    </div>
  );
}
