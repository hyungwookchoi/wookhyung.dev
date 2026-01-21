import type { Metadata } from 'next';

import { siteConfig } from '@/shared/config/site';
import { openGraph, twitter } from '@/shared/util/seo';

import { AboutContent } from './ui/about-content';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'About',
    alternates: {
      canonical: `${siteConfig.url}/about`,
    },
    openGraph: openGraph({
      title: `About | ${siteConfig.siteName}`,
      locale: 'ko_KR',
    }),
    twitter: twitter({
      title: `About | ${siteConfig.siteName}`,
    }),
  };
}

export default function AboutPage() {
  return <AboutContent />;
}
