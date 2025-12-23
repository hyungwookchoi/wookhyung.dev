import { type NextRequest, NextResponse } from 'next/server';

import { defaultLocale, isValidLocale, locales } from '@/i18n/config';

const LOCALE_COOKIE = 'NEXT_LOCALE';

function getLocaleFromHeaders(request: NextRequest): string {
  const acceptLanguage = request.headers.get('accept-language');
  if (!acceptLanguage) return defaultLocale;

  const preferredLocales = acceptLanguage
    .split(',')
    .map((lang) => {
      const [locale, priority = 'q=1'] = lang.trim().split(';');
      return {
        locale: locale.split('-')[0],
        priority: parseFloat(priority.replace('q=', '')),
      };
    })
    .sort((a, b) => b.priority - a.priority);

  for (const { locale } of preferredLocales) {
    if (isValidLocale(locale)) {
      return locale;
    }
  }

  return defaultLocale;
}

function getLocale(request: NextRequest): string {
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  if (cookieLocale && isValidLocale(cookieLocale)) {
    return cookieLocale;
  }

  return getLocaleFromHeaders(request);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (pathnameHasLocale) {
    // Extract locale from pathname and set cookie if not set
    const localeFromPath = pathname.split('/')[1];
    const response = NextResponse.next();

    if (
      isValidLocale(localeFromPath) &&
      request.cookies.get(LOCALE_COOKIE)?.value !== localeFromPath
    ) {
      response.cookies.set(LOCALE_COOKIE, localeFromPath, {
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: '/',
      });
    }

    return response;
  }

  // Redirect to locale-prefixed URL
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;

  const response = NextResponse.redirect(request.nextUrl);
  response.cookies.set(LOCALE_COOKIE, locale, {
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: '/',
  });

  return response;
}

export const config = {
  matcher: [
    // Skip internal paths and static files
    '/((?!_next|api|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|xml|txt|json|woff|woff2|ttf|eot|webmanifest)).*)',
  ],
};
