import type { Metadata } from 'next';

import { siteConfig } from '@/shared/config/site';
import { PageTitle } from '@/shared/ui/page-title';
import { openGraph, twitter } from '@/shared/util/seo';

import { BOOKS_BY_YEAR, CONCERTS, INTERESTS, MOVIES } from './const/preference';
import { PreferenceContent } from './ui/preference-content';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Preference',
    alternates: {
      canonical: `${siteConfig.url}/preference`,
    },
    openGraph: openGraph({
      title: `Preference | ${siteConfig.siteName}`,
      locale: 'ko_KR',
    }),
    twitter: twitter({
      title: `Preference | ${siteConfig.siteName}`,
    }),
  };
}

export default function PreferencePage() {
  return (
    <div>
      <PageTitle title="Preference" />
      <PreferenceContent
        concerts={CONCERTS}
        booksByYear={BOOKS_BY_YEAR}
        movies={MOVIES}
        interests={INTERESTS}
      />
    </div>
  );
}
