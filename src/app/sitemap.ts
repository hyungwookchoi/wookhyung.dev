import type { MetadataRoute } from 'next';

import { locales } from '@/i18n/config';
import { siteConfig } from '@/shared/config/site';
import {
  notesPosts as notesPostsData,
  techPosts as techPostsData,
} from '@/shared/util/post';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ['', '/about', '/tech', '/feed', '/notes', '/preference'];

  const staticEntries = locales.flatMap((lang) =>
    staticPages.map((page) => ({
      url: `${siteConfig.url}/${lang}${page}`,
      lastModified: new Date(),
      changeFrequency: (page === '' ? 'yearly' : 'weekly') as
        | 'yearly'
        | 'weekly',
      priority: page === '' ? 1 : page === '/about' ? 0.8 : 0.5,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${siteConfig.url}/${l}${page}`]),
        ),
      },
    })),
  );

  const techPosts = locales.flatMap((lang) =>
    techPostsData.map((post) => ({
      url: `${siteConfig.url}/${lang}/tech/${post.slug}`,
      lastModified: post.date,
      changeFrequency: 'daily' as const,
      priority: 0.7,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${siteConfig.url}/${l}/tech/${post.slug}`]),
        ),
      },
    })),
  );

  const notesPosts = locales.flatMap((lang) =>
    notesPostsData.map((post) => ({
      url: `${siteConfig.url}/${lang}/notes/${post.slug}`,
      lastModified: post.date,
      changeFrequency: 'daily' as const,
      priority: 0.7,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${siteConfig.url}/${l}/notes/${post.slug}`]),
        ),
      },
    })),
  );

  return [...staticEntries, ...techPosts, ...notesPosts];
}
