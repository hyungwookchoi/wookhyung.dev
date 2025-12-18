import { ExternalLink } from 'lucide-react';
import type { Metadata } from 'next';
import serialize from 'serialize-javascript';

import { siteConfig } from '@/shared/config/site';
import { PageTitle } from '@/shared/ui/page-title';
import { techPosts } from '@/shared/util/post';
import { openGraph, twitter } from '@/shared/util/seo';

import { TechPostList } from './ui/tech-post-list';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Tech',
  name: 'Tech',
  url: `${siteConfig.url}/tech`,
  author: {
    '@type': 'Person',
    name: siteConfig.author.name,
  },
};

export const metadata: Metadata = {
  title: 'Tech',
  alternates: {
    canonical: `${siteConfig.url}/tech`,
  },
  openGraph: openGraph({
    title: `Tech | ${siteConfig.siteName}`,
  }),
  twitter: twitter({
    title: `Tech | ${siteConfig.siteName}`,
  }),
};

export default function Page() {
  return (
    <>
      <div>
        <PageTitle title="Tech" />
        <TechPostList posts={techPosts} />

        <div className="mt-6 text-end">
          <a
            href="https://velog.io/@ctdlog/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline inline-flex items-center gap-1 text-sm"
          >
            이전 블로그 보기
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serialize(jsonLd) }}
      />
    </>
  );
}
