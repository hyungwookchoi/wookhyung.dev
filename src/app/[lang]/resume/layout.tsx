import type { Metadata } from 'next';

import { isValidLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';
import { siteConfig } from '@/shared/config/site';
import { openGraph, twitter } from '@/shared/util/seo';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;

  if (!isValidLocale(lang)) {
    return {};
  }

  const dict = await getDictionary(lang);

  return {
    title: dict.resume.title,
    description: dict.metadata.siteDescription,
    openGraph: openGraph({
      title: `${dict.resume.title} | ${siteConfig.siteName}`,
      description: dict.metadata.siteDescription,
      locale: lang === 'ko' ? 'ko_KR' : 'en_US',
    }),
    twitter: twitter({
      title: `${dict.resume.title} | ${siteConfig.siteName}`,
      description: dict.metadata.siteDescription,
    }),
    alternates: {
      canonical: `${siteConfig.url}/${lang}/resume`,
      languages: {
        ko: `${siteConfig.url}/ko/resume`,
        en: `${siteConfig.url}/en/resume`,
      },
    },
  };
}

export default async function ResumeLayout({ children, params }: LayoutProps) {
  const { lang } = await params;

  if (!isValidLocale(lang)) {
    return null;
  }

  return children;
}
