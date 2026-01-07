import { isValidLocale } from '@/i18n/config';

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function ResumePage({ params }: Props) {
  const { lang } = await params;

  if (!isValidLocale(lang)) {
    return null;
  }

  return (
    <iframe
      src="/resume.pdf"
      className="w-full h-screen border-0"
      title="Resume"
    />
  );
}
