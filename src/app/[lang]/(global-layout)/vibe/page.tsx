import type { Metadata } from 'next';

import { isValidLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';
import { siteConfig } from '@/shared/config/site';
import { PageTitle } from '@/shared/ui/page-title';
import { openGraph, twitter } from '@/shared/util/seo';

import { VibeList } from './ui/vibe-list';

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
    title: dict.vibe.title,
    description: dict.vibe.description,
    alternates: {
      canonical: `${siteConfig.url}/${lang}/vibe`,
      languages: {
        ko: `${siteConfig.url}/ko/vibe`,
        en: `${siteConfig.url}/en/vibe`,
      },
    },
    openGraph: openGraph({
      title: `${dict.vibe.title} | ${siteConfig.siteName}`,
      description: dict.vibe.description,
      locale: lang === 'ko' ? 'ko_KR' : 'en_US',
    }),
    twitter: twitter({
      title: `${dict.vibe.title} | ${siteConfig.siteName}`,
      description: dict.vibe.description,
    }),
  };
}

export default async function VibePage({ params }: Props) {
  const { lang } = await params;

  if (!isValidLocale(lang)) {
    return null;
  }

  const dict = await getDictionary(lang);

  return (
    <div>
      <PageTitle title={dict.vibe.title} />
      <VibeList lang={lang} emptyMessage={dict.vibe.empty} />
    </div>
  );
}
