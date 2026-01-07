import { isValidLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';

import { HomeContent } from './ui/home-content';

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function Page({ params }: Props) {
  const { lang } = await params;

  if (!isValidLocale(lang)) {
    return null;
  }

  const dict = await getDictionary(lang);

  return <HomeContent lang={lang as Locale} dict={dict} />;
}
