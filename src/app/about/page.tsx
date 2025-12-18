import type { Metadata } from 'next';

import { siteConfig } from '@/shared/config/site';
import { openGraph, twitter } from '@/shared/util/seo';

import { AboutContent } from './ui/about-content';

export const metadata: Metadata = {
  title: 'About',
  alternates: {
    canonical: `${siteConfig.url}/about`,
  },
  openGraph: openGraph({
    title: `About | ${siteConfig.siteName}`,
  }),
  twitter: twitter({
    title: `About | ${siteConfig.siteName}`,
  }),
};

export default function AboutPage() {
  return <AboutContent />;
}
