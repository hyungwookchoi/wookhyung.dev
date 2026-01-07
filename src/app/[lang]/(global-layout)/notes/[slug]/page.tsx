import { format } from 'date-fns';
import { enUS, ko } from 'date-fns/locale';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getMDXComponent } from 'next-contentlayer2/hooks';
import serialize from 'serialize-javascript';

import { isValidLocale, Locale } from '@/i18n/config';
import { siteConfig } from '@/shared/config/site';
import { BackButton } from '@/shared/ui/back-button';
import { getNotesPostBySlugAndLocale, notesPosts } from '@/shared/util/post';
import { openGraph, twitter } from '@/shared/util/seo';

import { Comments } from './ui/comments';
import ProgressBar from './ui/progress-bar';
import ScrollToTop from './ui/scroll-to-top';

interface Props {
  params: Promise<{
    lang: string;
    slug: string;
  }>;
}

export const generateStaticParams = () => {
  const params: { lang: string; slug: string }[] = [];
  for (const post of notesPosts) {
    params.push({ lang: post.locale, slug: post.slug });
  }
  return params;
};

export const generateMetadata = async ({ params }: Props) => {
  const { lang, slug } = await params;

  if (!isValidLocale(lang)) {
    return {};
  }

  const post = getNotesPostBySlugAndLocale(slug, lang as Locale);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.summary,
    alternates: {
      canonical: `${siteConfig.url}/${lang}/notes/${slug}`,
      languages: {
        ko: `${siteConfig.url}/ko/notes/${slug}`,
        en: `${siteConfig.url}/en/notes/${slug}`,
      },
    },
    openGraph: openGraph({
      title: post.title,
      locale: lang === 'ko' ? 'ko_KR' : 'en_US',
    }),
    twitter: twitter({
      title: post.title,
    }),
  };
};

export default async function Page({ params }: Props) {
  const { lang, slug } = await params;

  if (!isValidLocale(lang)) {
    notFound();
  }

  const post = getNotesPostBySlugAndLocale(slug, lang as Locale);

  if (!post) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.summary,
    url: `${siteConfig.url}/${lang}/notes/${slug}`,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: siteConfig.author.name,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteConfig.url}/${lang}/notes/${slug}`,
    },
    inLanguage: lang === 'ko' ? 'ko-KR' : 'en-US',
  };

  const Content = getMDXComponent(post.body.code);
  const dateLocale = lang === 'ko' ? ko : enUS;
  const dateFormat = lang === 'ko' ? 'yyyy년 M월 d일' : 'MMM d, yyyy';

  return (
    <>
      <div className="flex flex-col gap-6 pb-40">
        <ProgressBar />
        <BackButton className="self-start" lang={lang} />
        <article className="py-6 prose prose-invert max-w-none break-words">
          <h1 className="text-foreground">{post.title}</h1>
          {post.summary && (
            <p className="text-lg mt-0 text-muted-foreground font-light">
              {post.summary}
            </p>
          )}
          <div className="flex items-center gap-2 mt-2 mb-4 not-prose">
            <time
              dateTime={post.date}
              className="text-[10px] text-muted-foreground uppercase tracking-[0.15em]"
            >
              {format(new Date(post.date), dateFormat, { locale: dateLocale })}
            </time>
          </div>
          <hr className="border-border" />
          <Content
            components={{
              Image,
            }}
          />
        </article>
        <Comments />
        <ScrollToTop />
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serialize(jsonLd) }}
      />
    </>
  );
}
