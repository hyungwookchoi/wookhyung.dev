import type { Metadata } from 'next';
import serialize from 'serialize-javascript';

import { isValidLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';
import { siteConfig } from '@/shared/config/site';
import { PageTitle } from '@/shared/ui/page-title';
import { getNotesPostsByLocale } from '@/shared/util/post';
import { openGraph, twitter } from '@/shared/util/seo';

import { NotesPostList } from './ui/notes-post-list';

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
    title: dict.notes.title,
    alternates: {
      canonical: `${siteConfig.url}/${lang}/notes`,
      languages: {
        ko: `${siteConfig.url}/ko/notes`,
        en: `${siteConfig.url}/en/notes`,
      },
    },
    openGraph: openGraph({
      title: `${dict.notes.title} | ${siteConfig.siteName}`,
      locale: lang === 'ko' ? 'ko_KR' : 'en_US',
    }),
    twitter: twitter({
      title: `${dict.notes.title} | ${siteConfig.siteName}`,
    }),
  };
}

export default async function Page({ params }: Props) {
  const { lang } = await params;

  if (!isValidLocale(lang)) {
    return null;
  }

  const dict = await getDictionary(lang);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: dict.notes.title,
    url: `${siteConfig.url}/${lang}/notes`,
    author: {
      '@type': 'Person',
      name: siteConfig.author.name,
    },
  };

  const posts = getNotesPostsByLocale(lang as Locale);

  return (
    <>
      <div>
        <PageTitle title={dict.notes.title} />
        <NotesPostList
          posts={posts}
          lang={lang as Locale}
          emptyMessage={dict.notes.empty}
        />
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serialize(jsonLd) }}
      />
    </>
  );
}
