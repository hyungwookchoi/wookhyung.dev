import type { Metadata } from 'next';

import { isValidLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';
import { siteConfig } from '@/shared/config/site';
import { PageTitle } from '@/shared/ui/page-title';
import { openGraph, twitter } from '@/shared/util/seo';

import { RSS_FEEDS } from './config/rss-feeds';
import { parseAllRssFeeds } from './model/rss-parser';
import { FeedList } from './ui/feed-list';

export const revalidate = 3600;

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
    title: dict.feed.title,
    alternates: {
      canonical: `${siteConfig.url}/${lang}/feed`,
      languages: {
        ko: `${siteConfig.url}/ko/feed`,
        en: `${siteConfig.url}/en/feed`,
      },
    },
    openGraph: openGraph({
      title: `${dict.feed.title} | ${siteConfig.siteName}`,
      locale: lang === 'ko' ? 'ko_KR' : 'en_US',
    }),
    twitter: twitter({
      title: `${dict.feed.title} | ${siteConfig.siteName}`,
    }),
  };
}

export default async function FeedPage({ params }: Props) {
  const { lang } = await params;

  if (!isValidLocale(lang)) {
    return null;
  }

  const dict = await getDictionary(lang);
  const rssItems = await parseAllRssFeeds(RSS_FEEDS);

  return (
    <div>
      <PageTitle title={dict.feed.title} />
      <FeedList items={rssItems} />
    </div>
  );
}
