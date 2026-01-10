'use client';

import { ProgressProvider } from '@bprogress/next/app';
import { ThemeProvider } from 'next-themes';

import type { Locale } from '@/i18n/config';
import { LocaleProvider } from '@/i18n/context';

interface ProvidersProps {
  children: React.ReactNode;
  locale: Locale;
}

export const Providers = ({ children, locale }: ProvidersProps) => {
  return (
    <LocaleProvider locale={locale}>
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
    </LocaleProvider>
  );
};
