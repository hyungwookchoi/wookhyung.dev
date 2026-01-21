import './globals.css';

import { GoogleAnalytics } from '@next/third-parties/google';
import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';
import serialize from 'serialize-javascript';

import { siteConfig } from '@/shared/config/site';
import { openGraph, twitter } from '@/shared/util/seo';

import { Providers } from './providers';

interface LayoutProps {
  children: React.ReactNode;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: 'WOOKHYUNG',
      template: '%s | WOOKHYUNG',
    },
    description:
      '프론트엔드 개발자 최형욱의 블로그입니다. 프론트엔드 개발과 개인적인 생각을 기록합니다.',
    openGraph: openGraph({
      title: 'WOOKHYUNG',
      description:
        '프론트엔드 개발자 최형욱의 블로그입니다. 프론트엔드 개발과 개인적인 생각을 기록합니다.',
      locale: 'ko_KR',
    }),
    twitter: twitter({
      title: 'WOOKHYUNG',
      description:
        '프론트엔드 개발자 최형욱의 블로그입니다. 프론트엔드 개발과 개인적인 생각을 기록합니다.',
    }),
    authors: [siteConfig.author],
    keywords: siteConfig.keywords,
    icons: siteConfig.icons,
    robots: siteConfig.robots,
    alternates: {
      canonical: siteConfig.url,
      types: {
        'application/rss+xml': `${siteConfig.url}${siteConfig.feeds.rss}`,
      },
    },
    other: {
      'naver-site-verification': siteConfig.verification.naver,
    },
  };
}

export default function RootLayout({ children }: LayoutProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'WOOKHYUNG',
    url: siteConfig.url,
    description:
      '프론트엔드 개발자 최형욱의 블로그입니다. 프론트엔드 개발과 개인적인 생각을 기록합니다.',
    inLanguage: 'ko-KR',
  };

  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="min-h-dvh flex flex-col bg-background font-mono text-foreground relative">
        <Providers>{children}</Providers>
        <Analytics />
        <GoogleAnalytics gaId="G-F7VQE719RE" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serialize(jsonLd) }}
        />
      </body>
    </html>
  );
}
