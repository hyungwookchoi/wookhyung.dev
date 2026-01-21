import type { MetadataRoute } from 'next';

import { siteConfig } from '@/shared/config/site';
import {
  notesPosts as notesPostsData,
  techPosts as techPostsData,
} from '@/shared/util/post';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ['', '/about', '/tech', '/feed', '/notes', '/preference'];

  const staticEntries = staticPages.map((page) => ({
    url: `${siteConfig.url}${page}`,
    lastModified: new Date(),
    changeFrequency: (page === '' ? 'yearly' : 'weekly') as 'yearly' | 'weekly',
    priority: page === '' ? 1 : page === '/about' ? 0.8 : 0.5,
  }));

  const techPosts = techPostsData.map((post) => ({
    url: `${siteConfig.url}/tech/${post.slug}`,
    lastModified: post.date,
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  const notesPosts = notesPostsData.map((post) => ({
    url: `${siteConfig.url}/notes/${post.slug}`,
    lastModified: post.date,
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...techPosts, ...notesPosts];
}
