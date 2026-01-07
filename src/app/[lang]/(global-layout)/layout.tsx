import { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';
import { Header } from '@/shared/ui/header';

export default async function GlobalLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  return (
    <>
      <div className="max-w-3xl mx-auto w-full">
        <Header lang={lang as Locale} dict={dict} />
      </div>
      <main className="flex-1 flex flex-col py-6 px-4 max-w-3xl mx-auto w-full">
        {children}
      </main>
    </>
  );
}
