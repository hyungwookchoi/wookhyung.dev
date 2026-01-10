import { format } from 'date-fns';
import { enUS, ko } from 'date-fns/locale';
import { notFound } from 'next/navigation';
import serialize from 'serialize-javascript';

import { isValidLocale, Locale } from '@/i18n/config';
import { siteConfig } from '@/shared/config/site';
import { BackButton } from '@/shared/ui/back-button';
import { WithClaudeBadge } from '@/shared/ui/with-claude-badge';
import { getTechPostBySlugAndLocale, techPosts } from '@/shared/util/post';
import { openGraph, twitter } from '@/shared/util/seo';

import { Comments } from './ui/comments';
import { MDXContent } from './ui/mdx-content';
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
  for (const post of techPosts) {
    params.push({ lang: post.locale, slug: post.slug });
  }
  return params;
};

export const generateMetadata = async ({ params }: Props) => {
  const { lang, slug } = await params;

  if (!isValidLocale(lang)) {
    return {};
  }

  const post = getTechPostBySlugAndLocale(slug, lang as Locale);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.summary,
    alternates: {
      canonical: `${siteConfig.url}/${lang}/tech/${slug}`,
      languages: {
        ko: `${siteConfig.url}/ko/tech/${slug}`,
        en: `${siteConfig.url}/en/tech/${slug}`,
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

  const post = getTechPostBySlugAndLocale(slug, lang as Locale);

  if (!post) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.summary,
    url: `${siteConfig.url}/${lang}/tech/${slug}`,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: siteConfig.author.name,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteConfig.url}/${lang}/tech/${slug}`,
    },
    inLanguage: lang === 'ko' ? 'ko-KR' : 'en-US',
  };

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
          <div className="flex items-center gap-3 mt-2 mb-4 not-prose">
            <time
              dateTime={post.date}
              className="text-[10px] text-muted-foreground uppercase tracking-[0.15em]"
            >
              {format(new Date(post.date), dateFormat, { locale: dateLocale })}
            </time>
            {post.withClaude && <WithClaudeBadge />}
          </div>
          <hr className="border-border" />
          <MDXContent code={post.body.code} />
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
