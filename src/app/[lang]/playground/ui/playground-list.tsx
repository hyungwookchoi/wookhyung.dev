'use client';

import { ArrowUpRightIcon } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';

import type { Locale } from '@/i18n/config';
import { cn } from '@/shared/lib/tailwind-merge';

import { PLAYGROUNDS } from '../config/playgrounds';

interface PlaygroundListProps {
  lang: Locale;
  emptyMessage: string;
}

const STAGGER_DELAY = 0.05;
const INITIAL_DELAY = 0.1;

const fadeInUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

export function PlaygroundList({ lang, emptyMessage }: PlaygroundListProps) {
  if (PLAYGROUNDS.length === 0) {
    return (
      <motion.div
        className="py-12 text-center text-muted-foreground text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {emptyMessage}
      </motion.div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {PLAYGROUNDS.map((playground, index) => (
        <motion.div
          key={playground.slug}
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{
            duration: 0.4,
            delay: INITIAL_DELAY + STAGGER_DELAY * index,
          }}
        >
          <Link
            href={`/${lang}/playground/${playground.slug}`}
            className={cn(
              'group flex flex-col gap-3 p-5',
              'border border-border bg-card',
              'hover:border-primary/50 hover:bg-muted/50 transition-all duration-200',
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <span className="text-[10px] uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5">
                  {playground.category}
                </span>
                <h2 className="mt-2 text-base font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                  {playground.title[lang]}
                </h2>
              </div>
              <ArrowUpRightIcon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {playground.description[lang]}
            </p>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
