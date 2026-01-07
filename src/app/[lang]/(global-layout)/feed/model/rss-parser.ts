import Parser from 'rss-parser';

import type { RssFeed } from '../config/rss-feeds';

export interface ParsedRssItem {
  title: string;
  link: string;
  pubDate: string;
  contentSnippet?: string;
  feedName: string;
  feedUrl: string;
}

const parser = new Parser({
  timeout: 10000,
});

export async function parseRssFeed(feed: RssFeed): Promise<ParsedRssItem[]> {
  try {
    const parsedFeed = await parser.parseURL(feed.url);

    return (parsedFeed.items || []).map((item) => ({
      title: item.title || '제목 없음',
      link: item.link || '',
      pubDate: item.pubDate || '',
      contentSnippet: item.contentSnippet || item.content?.substring(0, 150),
      feedName: feed.name,
      feedUrl: feed.url,
    }));
  } catch (error) {
    console.error(`RSS 피드 파싱 실패: ${feed.name}`, error);
    return [];
  }
}

export async function parseAllRssFeeds(
  feeds: RssFeed[],
): Promise<ParsedRssItem[]> {
  const allItems = await Promise.allSettled(
    feeds.map((feed) => parseRssFeed(feed)),
  );

  const successfulResults = allItems
    .filter((result) => result.status === 'fulfilled')
    .flatMap((result) => result.value || []);

  return successfulResults.sort(
    (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime(),
  );
}
