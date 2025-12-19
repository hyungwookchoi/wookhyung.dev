'use client';

import { createContext, ReactNode, useContext } from 'react';

import { defaultLocale, Locale } from './config';

const LocaleContext = createContext<Locale>(defaultLocale);

interface LocaleProviderProps {
  locale: Locale;
  children: ReactNode;
}

export function LocaleProvider({ locale, children }: LocaleProviderProps) {
  return (
    <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
  );
}

export function useLocale(): Locale {
  return useContext(LocaleContext);
}
