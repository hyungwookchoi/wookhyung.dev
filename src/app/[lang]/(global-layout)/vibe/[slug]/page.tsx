import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { AsciiVideoConverter } from '@/features/ascii-video';
import { BlockchainPlayground } from '@/features/blockchain-viz';
import { isValidLocale } from '@/i18n/config';
import { LocaleProvider } from '@/i18n/context';
import { siteConfig } from '@/shared/config/site';
import { BackButton } from '@/shared/ui/back-button';
import { openGraph, twitter } from '@/shared/util/seo';

import { VIBES } from '../config/vibes';

interface Props {
  params: Promise<{ lang: string; slug: string }>;
}

// Vibe slug to component mapping
const VIBE_COMPONENTS: Record<string, React.ComponentType> = {
  'ascii-video': AsciiVideoConverter,
  'blockchain-viz': BlockchainPlayground,
};

export async function generateStaticParams() {
  const locales = ['ko', 'en'];
  return locales.flatMap((lang) =>
    VIBES.map((p) => ({
      lang,
      slug: p.slug,
    })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;

  if (!isValidLocale(lang)) {
    return {};
  }

  const vibe = VIBES.find((p) => p.slug === slug);
  if (!vibe) {
    return {};
  }

  const title = vibe.title[lang];
  const description = vibe.description[lang];

  return {
    title,
    description,
    alternates: {
      canonical: `${siteConfig.url}/${lang}/vibe/${slug}`,
      languages: {
        ko: `${siteConfig.url}/ko/vibe/${slug}`,
        en: `${siteConfig.url}/en/vibe/${slug}`,
      },
    },
    openGraph: openGraph({
      title: `${title} | ${siteConfig.siteName}`,
      description,
      locale: lang === 'ko' ? 'ko_KR' : 'en_US',
    }),
    twitter: twitter({
      title: `${title} | ${siteConfig.siteName}`,
      description,
    }),
  };
}

export default async function VibeDetailPage({ params }: Props) {
  const { lang, slug } = await params;

  if (!isValidLocale(lang)) {
    notFound();
  }

  const vibe = VIBES.find((p) => p.slug === slug);
  if (!vibe) {
    notFound();
  }

  const VibeComponent = VIBE_COMPONENTS[slug];
  if (!VibeComponent) {
    notFound();
  }

  return (
    <LocaleProvider locale={lang}>
      <div>
        <BackButton lang={lang} />
        <VibeComponent />
      </div>
    </LocaleProvider>
  );
}
