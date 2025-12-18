import type { Metadata } from 'next';

import { siteConfig } from '@/shared/config/site';
import { PageTitle } from '@/shared/ui/page-title';
import { openGraph, twitter } from '@/shared/util/seo';

import { RSS_FEEDS } from './config/rss-feeds';
import { parseAllRssFeeds } from './model/rss-parser';
import { FeedList } from './ui/feed-list';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Feed',
  alternates: {
    canonical: `${siteConfig.url}/feed`,
  },
  openGraph: openGraph({
    title: `Feed | ${siteConfig.siteName}`,
  }),
  twitter: twitter({
    title: `Feed | ${siteConfig.siteName}`,
  }),
};

export default async function FeedPage() {
  const rssItems = await parseAllRssFeeds(RSS_FEEDS);

  return (
    <div>
      <PageTitle title="Feed (Beta)" />
      <FeedList items={rssItems} />
    </div>
  );
}
