import type { Metadata } from 'next';

import { isValidLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';
import { siteConfig } from '@/shared/config/site';
import { openGraph, twitter } from '@/shared/util/seo';

import { AboutContent } from './ui/about-content';

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;

  if (!isValidLocale(lang)) {
    return {};
  }

  return {
    title: 'About',
    alternates: {
      canonical: `${siteConfig.url}/${lang}/about`,
      languages: {
        ko: `${siteConfig.url}/ko/about`,
        en: `${siteConfig.url}/en/about`,
      },
    },
    openGraph: openGraph({
      title: `About | ${siteConfig.siteName}`,
      locale: lang === 'ko' ? 'ko_KR' : 'en_US',
    }),
    twitter: twitter({
      title: `About | ${siteConfig.siteName}`,
    }),
  };
}

export default async function AboutPage({ params }: Props) {
  const { lang } = await params;

  if (!isValidLocale(lang)) {
    return null;
  }

  const dict = await getDictionary(lang);

  return <AboutContent lang={lang as Locale} dict={dict} />;
}
