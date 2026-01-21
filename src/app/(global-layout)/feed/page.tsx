import type { Metadata } from 'next';

import { siteConfig } from '@/shared/config/site';
import { PageTitle } from '@/shared/ui/page-title';
import { openGraph, twitter } from '@/shared/util/seo';

import { RSS_FEEDS } from './config/rss-feeds';
import { parseAllRssFeeds } from './model/rss-parser';
import { FeedList } from './ui/feed-list';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Feed (Beta)',
    alternates: {
      canonical: `${siteConfig.url}/feed`,
    },
    openGraph: openGraph({
      title: `Feed (Beta) | ${siteConfig.siteName}`,
      locale: 'ko_KR',
    }),
    twitter: twitter({
      title: `Feed (Beta) | ${siteConfig.siteName}`,
    }),
  };
}

export default async function FeedPage() {
  const rssItems = await parseAllRssFeeds(RSS_FEEDS);

  return (
    <div>
      <PageTitle title="Feed (Beta)" />
      <FeedList items={rssItems} />
    </div>
  );
}
