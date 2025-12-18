import type { Metadata } from 'next';

import { isValidLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';
import { siteConfig } from '@/shared/config/site';
import { PageTitle } from '@/shared/ui/page-title';
import { openGraph, twitter } from '@/shared/util/seo';

import { BOOKS_BY_YEAR, CONCERTS, INTERESTS, MOVIES } from './const/preference';
import { PreferenceContent } from './ui/preference-content';

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;

  if (!isValidLocale(lang)) {
    return {};
  }

  const dict = await getDictionary(lang);

  return {
    title: dict.preference.title,
    alternates: {
      canonical: `${siteConfig.url}/${lang}/preference`,
      languages: {
        ko: `${siteConfig.url}/ko/preference`,
        en: `${siteConfig.url}/en/preference`,
      },
    },
    openGraph: openGraph({
      title: `${dict.preference.title} | ${siteConfig.siteName}`,
      locale: lang === 'ko' ? 'ko_KR' : 'en_US',
    }),
    twitter: twitter({
      title: `${dict.preference.title} | ${siteConfig.siteName}`,
    }),
  };
}

export default async function PreferencePage({ params }: Props) {
  const { lang } = await params;

  if (!isValidLocale(lang)) {
    return null;
  }

  const dict = await getDictionary(lang);

  return (
    <div>
      <PageTitle title={dict.preference.title} />
      <PreferenceContent
        concerts={CONCERTS}
        booksByYear={BOOKS_BY_YEAR}
        movies={MOVIES}
        interests={INTERESTS}
        dict={dict}
      />
    </div>
  );
}
