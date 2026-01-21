import type { Metadata } from 'next';

import { siteConfig } from '@/shared/config/site';
import { openGraph, twitter } from '@/shared/util/seo';

interface LayoutProps {
  children: React.ReactNode;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '이력서',
    description:
      '프론트엔드 개발자 최형욱의 블로그입니다. 프론트엔드 개발과 개인적인 생각을 기록합니다.',
    openGraph: openGraph({
      title: `이력서 | ${siteConfig.siteName}`,
      description:
        '프론트엔드 개발자 최형욱의 블로그입니다. 프론트엔드 개발과 개인적인 생각을 기록합니다.',
      locale: 'ko_KR',
    }),
    twitter: twitter({
      title: `이력서 | ${siteConfig.siteName}`,
      description:
        '프론트엔드 개발자 최형욱의 블로그입니다. 프론트엔드 개발과 개인적인 생각을 기록합니다.',
    }),
    alternates: {
      canonical: `${siteConfig.url}/resume`,
    },
  };
}

export default function ResumeLayout({ children }: LayoutProps) {
  return children;
}
