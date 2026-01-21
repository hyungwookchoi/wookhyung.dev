import type { Metadata } from 'next';

import { siteConfig } from '@/shared/config/site';
import { PageTitle } from '@/shared/ui/page-title';
import { openGraph, twitter } from '@/shared/util/seo';

import { VibeList } from './ui/vibe-list';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Vibe',
    description: '빠르게 만들어보는 바이브 코딩 프로젝트 모음입니다.',
    alternates: {
      canonical: `${siteConfig.url}/vibe`,
    },
    openGraph: openGraph({
      title: `Vibe | ${siteConfig.siteName}`,
      description: '빠르게 만들어보는 바이브 코딩 프로젝트 모음입니다.',
      locale: 'ko_KR',
    }),
    twitter: twitter({
      title: `Vibe | ${siteConfig.siteName}`,
      description: '빠르게 만들어보는 바이브 코딩 프로젝트 모음입니다.',
    }),
  };
}

export default function VibePage() {
  return (
    <div>
      <PageTitle title="Vibe" />
      <VibeList emptyMessage="아직 등록된 바이브 프로젝트가 없습니다." />
    </div>
  );
}
