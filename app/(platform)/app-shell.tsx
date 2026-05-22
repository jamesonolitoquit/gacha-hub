import { ReactNode } from 'react';

type AppShellProps = {
  skipTargetId: string;
  skipLabel: string;
  header: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
};

export function AppShell({ skipTargetId, skipLabel, header, children, footer }: AppShellProps) {
  return (
    <div className="min-h-screen">
      <a
        href={`#${skipTargetId}`}
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-40 focus:rounded focus:bg-sky-300 focus:px-4 focus:py-2 focus:font-semibold focus:text-slate-950"
      >
        {skipLabel}
      </a>

      {header}

      <main id={skipTargetId} className="pb-16">
        {children}
      </main>

      {footer}
    </div>
  );
}