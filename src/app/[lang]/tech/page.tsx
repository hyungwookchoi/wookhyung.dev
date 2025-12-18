import { ExternalLink } from 'lucide-react';
import type { Metadata } from 'next';
import serialize from 'serialize-javascript';

import { isValidLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';
import { siteConfig } from '@/shared/config/site';
import { PageTitle } from '@/shared/ui/page-title';
import { techPosts } from '@/shared/util/post';
import { openGraph, twitter } from '@/shared/util/seo';

import { TechPostList } from './ui/tech-post-list';

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
    title: dict.tech.title,
    alternates: {
      canonical: `${siteConfig.url}/${lang}/tech`,
      languages: {
        ko: `${siteConfig.url}/ko/tech`,
        en: `${siteConfig.url}/en/tech`,
      },
    },
    openGraph: openGraph({
      title: `${dict.tech.title} | ${siteConfig.siteName}`,
      locale: lang === 'ko' ? 'ko_KR' : 'en_US',
    }),
    twitter: twitter({
      title: `${dict.tech.title} | ${siteConfig.siteName}`,
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
    name: dict.tech.title,
    url: `${siteConfig.url}/${lang}/tech`,
    author: {
      '@type': 'Person',
      name: siteConfig.author.name,
    },
  };

  return (
    <>
      <div>
        <PageTitle title={dict.tech.title} />
        <TechPostList posts={techPosts} lang={lang as Locale} />

        <div className="mt-6 text-end">
          <a
            href="https://velog.io/@ctdlog/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline inline-flex items-center gap-1 text-sm"
          >
            {dict.tech.viewPrevBlog}
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
