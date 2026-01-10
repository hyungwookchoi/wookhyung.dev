import '../globals.css';

import { GoogleAnalytics } from '@next/third-parties/google';
import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import serialize from 'serialize-javascript';

import { isValidLocale, locales } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';
import { siteConfig } from '@/shared/config/site';
import { openGraph, twitter } from '@/shared/util/seo';

import { Providers } from '../providers';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;

  if (!isValidLocale(lang)) {
    return {};
  }

  const dict = await getDictionary(lang);
  const isKorean = lang === 'ko';

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: dict.metadata.siteTitle,
      template: `%s | ${dict.metadata.siteTitle}`,
    },
    description: dict.metadata.siteDescription,
    openGraph: openGraph({
      title: dict.metadata.siteTitle,
      description: dict.metadata.siteDescription,
      locale: isKorean ? 'ko_KR' : 'en_US',
    }),
    twitter: twitter({
      title: dict.metadata.siteTitle,
      description: dict.metadata.siteDescription,
    }),
    authors: [siteConfig.author],
    keywords: siteConfig.keywords,
    icons: siteConfig.icons,
    robots: siteConfig.robots,
    alternates: {
      canonical: `${siteConfig.url}/${lang}`,
      languages: {
        ko: `${siteConfig.url}/ko`,
        en: `${siteConfig.url}/en`,
        'x-default': `${siteConfig.url}/ko`,
      },
      types: {
        'application/rss+xml': `${siteConfig.url}${siteConfig.feeds.rss}`,
      },
    },
    other: {
      'naver-site-verification': siteConfig.verification.naver,
    },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { lang } = await params;

  if (!isValidLocale(lang)) {
    notFound();
  }

  const dict = await getDictionary(lang);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: dict.metadata.siteTitle,
    url: siteConfig.url,
    description: dict.metadata.siteDescription,
    inLanguage: lang === 'ko' ? 'ko-KR' : 'en-US',
  };

  return (
    <html lang={lang} suppressHydrationWarning>
      <body className="min-h-dvh flex flex-col bg-background font-mono text-foreground relative">
        <Providers locale={lang}>{children}</Providers>
        <Analytics />
        <GoogleAnalytics gaId="G-F7VQE719RE" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serialize(jsonLd) }}
        />
      </body>
    </html>
  );
}
