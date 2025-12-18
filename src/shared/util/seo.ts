import type { Metadata } from 'next';

import { siteConfig } from '@/shared/config/site';

export const openGraph = ({
  title = siteConfig.title.default,
  description = siteConfig.description,
  locale = siteConfig.locale,
}: {
  title?: string;
  description?: string;
  locale?: string;
}): Metadata['openGraph'] => {
  return {
    title,
    description,
    siteName: siteConfig.siteName,
    url: siteConfig.url,
    locale,
    type: 'website',
    images: [
      {
        url: siteConfig.images.opengraph,
        width: 1200,
        height: 600,
      },
    ],
  };
};

export const twitter = ({
  title = siteConfig.title.default,
  description = siteConfig.description,
}: {
  title?: string;
  description?: string;
}): Metadata['twitter'] => {
  return {
    card: 'summary_large_image',
    title,
    description,
    images: [siteConfig.images.opengraph],
  };
};
