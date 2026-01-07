import type { Metadata } from 'next';

import { isValidLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';
import { siteConfig } from '@/shared/config/site';
import { PageTitle } from '@/shared/ui/page-title';
import { openGraph, twitter } from '@/shared/util/seo';

import { PlaygroundList } from './ui/playground-list';

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
    title: dict.playground.title,
    description: dict.playground.description,
    alternates: {
      canonical: `${siteConfig.url}/${lang}/playground`,
      languages: {
        ko: `${siteConfig.url}/ko/playground`,
        en: `${siteConfig.url}/en/playground`,
      },
    },
    openGraph: openGraph({
      title: `${dict.playground.title} | ${siteConfig.siteName}`,
      description: dict.playground.description,
      locale: lang === 'ko' ? 'ko_KR' : 'en_US',
    }),
    twitter: twitter({
      title: `${dict.playground.title} | ${siteConfig.siteName}`,
      description: dict.playground.description,
    }),
  };
}

export default async function PlaygroundPage({ params }: Props) {
  const { lang } = await params;

  if (!isValidLocale(lang)) {
    return null;
  }

  const dict = await getDictionary(lang);

  return (
    <div>
      <PageTitle title={dict.playground.title} />
      <PlaygroundList lang={lang} emptyMessage={dict.playground.empty} />
    </div>
  );
}
