import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { AsciiVideoConverter } from '@/features/ascii-video';
import { BlockchainPlayground } from '@/features/blockchain-viz';
import { siteConfig } from '@/shared/config/site';
import { BackButton } from '@/shared/ui/back-button';
import { openGraph, twitter } from '@/shared/util/seo';

import { VIBES } from '../config/vibes';

interface Props {
  params: Promise<{ slug: string }>;
}

// Vibe slug to component mapping
const VIBE_COMPONENTS: Record<string, React.ComponentType> = {
  'ascii-video': AsciiVideoConverter,
  'blockchain-viz': BlockchainPlayground,
};

export async function generateStaticParams() {
  return VIBES.map((vibe) => ({
    slug: vibe.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const vibe = VIBES.find((p) => p.slug === slug);
  if (!vibe) {
    return {};
  }

  const title = vibe.title;
  const description = vibe.description;

  return {
    title,
    description,
    alternates: {
      canonical: `${siteConfig.url}/vibe/${slug}`,
    },
    openGraph: openGraph({
      title: `${title} | ${siteConfig.siteName}`,
      description,
      locale: 'ko_KR',
    }),
    twitter: twitter({
      title: `${title} | ${siteConfig.siteName}`,
      description,
    }),
  };
}

export default async function VibeDetailPage({ params }: Props) {
  const { slug } = await params;

  const vibe = VIBES.find((p) => p.slug === slug);
  if (!vibe) {
    notFound();
  }

  const VibeComponent = VIBE_COMPONENTS[slug];
  if (!VibeComponent) {
    notFound();
  }

  return (
    <div>
      <BackButton />
      <VibeComponent />
    </div>
  );
}
