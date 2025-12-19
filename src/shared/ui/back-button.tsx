'use client';

import { ArrowLeftIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

import type { Locale } from '@/i18n/config';

interface BackButtonProps {
  className?: string;
  lang?: Locale;
}

export function BackButton({ className = '', lang = 'ko' }: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const ariaLabel = lang === 'ko' ? '뒤로 가기' : 'Go back';

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`inline-flex items-center justify-center p-2 text-neutral-400 hover:text-emerald-400 transition-colors duration-200 hover:bg-neutral-800 ${className}`}
      aria-label={ariaLabel}
    >
      <ArrowLeftIcon className="w-5 h-5" />
    </button>
  );
}
