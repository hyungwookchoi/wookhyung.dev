import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { AsciiVideoConverter } from '@/features/ascii-video';
import { isValidLocale } from '@/i18n/config';
import { LocaleProvider } from '@/i18n/context';
import { siteConfig } from '@/shared/config/site';
import { BackButton } from '@/shared/ui/back-button';
import { openGraph, twitter } from '@/shared/util/seo';

import { PLAYGROUNDS } from '../config/playgrounds';

interface Props {
  params: Promise<{ lang: string; slug: string }>;
}

// Playground slug to component mapping
const PLAYGROUND_COMPONENTS: Record<string, React.ComponentType> = {
  'ascii-video': AsciiVideoConverter,
};

export async function generateStaticParams() {
  const locales = ['ko', 'en'];
  return locales.flatMap((lang) =>
    PLAYGROUNDS.map((p) => ({
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

  const playground = PLAYGROUNDS.find((p) => p.slug === slug);
  if (!playground) {
    return {};
  }

  const title = playground.title[lang];
  const description = playground.description[lang];

  return {
    title,
    description,
    alternates: {
      canonical: `${siteConfig.url}/${lang}/playground/${slug}`,
      languages: {
        ko: `${siteConfig.url}/ko/playground/${slug}`,
        en: `${siteConfig.url}/en/playground/${slug}`,
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

export default async function PlaygroundDetailPage({ params }: Props) {
  const { lang, slug } = await params;

  if (!isValidLocale(lang)) {
    notFound();
  }

  const playground = PLAYGROUNDS.find((p) => p.slug === slug);
  if (!playground) {
    notFound();
  }

  const PlaygroundComponent = PLAYGROUND_COMPONENTS[slug];
  if (!PlaygroundComponent) {
    notFound();
  }

  return (
    <LocaleProvider locale={lang}>
      <div>
        <BackButton lang={lang} />
        <PlaygroundComponent />
      </div>
    </LocaleProvider>
  );
}
