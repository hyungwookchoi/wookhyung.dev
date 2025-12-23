'use client';

import { ProgressProvider } from '@bprogress/next/app';
import { ThemeProvider } from 'next-themes';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem={true}
      disableTransitionOnChange
    >
      <ProgressProvider
        height="4px"
        color="var(--primary)"
        options={{
          showSpinner: false,
        }}
      >
        {children}
      </ProgressProvider>
    </ThemeProvider>
  );
};
