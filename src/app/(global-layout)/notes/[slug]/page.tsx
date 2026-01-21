import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getMDXComponent } from 'next-contentlayer2/hooks';
import serialize from 'serialize-javascript';

import { siteConfig } from '@/shared/config/site';
import { BackButton } from '@/shared/ui/back-button';
import { getNotesPostBySlug, notesPosts } from '@/shared/util/post';
import { openGraph, twitter } from '@/shared/util/seo';

import { Comments } from './ui/comments';
import ProgressBar from './ui/progress-bar';
import ScrollToTop from './ui/scroll-to-top';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export const generateStaticParams = () => {
  return notesPosts.map((post) => ({
    slug: post.slug,
  }));
};

export const generateMetadata = async ({ params }: Props) => {
  const { slug } = await params;
  const post = getNotesPostBySlug(slug);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    alternates: {
      canonical: `${siteConfig.url}/notes/${slug}`,
    },
    openGraph: openGraph({
      title: post.title,
      locale: 'ko_KR',
    }),
    twitter: twitter({
      title: post.title,
    }),
  };
};

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const post = getNotesPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    url: `${siteConfig.url}/notes/${slug}`,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: siteConfig.author.name,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteConfig.url}/notes/${slug}`,
    },
    inLanguage: 'ko-KR',
  };

  const Content = getMDXComponent(post.body.code);

  return (
    <>
      <div className="flex flex-col gap-6 pb-40">
        <ProgressBar />
        <BackButton className="self-start" />
        <article className="pb-6 prose prose-sm prose-invert max-w-none wrap-break-word">
          <h1 className="text-foreground text-2xl not-prose mb-2">
            {post.title}
          </h1>
          <div className="flex items-center gap-3 not-prose">
            <time
              dateTime={post.date}
              className="text-[10px] text-muted-foreground uppercase tracking-[0.15em]"
            >
              {format(new Date(post.date), 'yyyy년 M월 d일', { locale: ko })}
            </time>
          </div>
          <hr className="border-border border-dotted" />
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
