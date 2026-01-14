import RSS from 'rss';

import { siteConfig } from '@/shared/config/site';
import { allPosts } from '@/shared/util/post';

export async function GET() {
  const feed = new RSS({
    title: siteConfig.title.default,
    description: siteConfig.description,
    site_url: siteConfig.url,
    feed_url: `${siteConfig.url}${siteConfig.feeds.rss}`,
    language: siteConfig.language,
    pubDate: new Date(),
  });

  for (const post of allPosts) {
    if (post.category === 'tech') {
      feed.item({
        title: post.title,
        url: `${siteConfig.url}/tech/${post.slug}`,
        date: post.date,
        description: 'No description',
      });
    }

    if (post.category === 'notes') {
      feed.item({
        title: post.title,
        url: `${siteConfig.url}/notes/${post.slug}`,
        date: post.date,
        description: 'No description',
      });
    }
  }

  return new Response(feed.xml({ indent: true }), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
