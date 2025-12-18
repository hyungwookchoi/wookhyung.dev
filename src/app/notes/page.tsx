import type { Metadata } from 'next';
import serialize from 'serialize-javascript';

import { siteConfig } from '@/shared/config/site';
import { PageTitle } from '@/shared/ui/page-title';
import { notesPosts } from '@/shared/util/post';
import { openGraph, twitter } from '@/shared/util/seo';

import { NotesPostList } from './ui/notes-post-list';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Notes',
  name: 'Notes',
  url: `${siteConfig.url}/notes`,
  author: {
    '@type': 'Person',
    name: siteConfig.author.name,
  },
};

export const metadata: Metadata = {
  title: 'Notes',
  alternates: {
    canonical: `${siteConfig.url}/notes`,
  },
  openGraph: openGraph({
    title: `Notes | ${siteConfig.siteName}`,
  }),
  twitter: twitter({
    title: `Notes | ${siteConfig.siteName}`,
  }),
};

export default function Page() {
  return (
    <>
      <div>
        <PageTitle title="Notes" />
        <NotesPostList posts={notesPosts} />
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serialize(jsonLd) }}
      />
    </>
  );
}
