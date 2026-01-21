'use client';

import { ArrowUpRightIcon } from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/shared/lib/tailwind-merge';

import { VIBES } from '../config/vibes';

interface VibeListProps {
  emptyMessage: string;
}

const STAGGER_DELAY = 0.05;
const INITIAL_DELAY = 0.1;

const fadeInUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

export function VibeList({ emptyMessage }: VibeListProps) {
  if (VIBES.length === 0) {
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
      {VIBES.map((vibe, index) => (
        <motion.div
          key={vibe.slug}
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{
            duration: 0.4,
            delay: INITIAL_DELAY + STAGGER_DELAY * index,
          }}
        >
          <Link
            href={`/vibe/${vibe.slug}`}
            className={cn(
              'group flex flex-col overflow-hidden',
              'border border-border bg-card',
              'hover:border-primary/50 hover:bg-muted/50 transition-all duration-200',
            )}
          >
            {vibe.thumbnail && (
              <div className="relative aspect-video w-full overflow-hidden bg-muted">
                <Image
                  src={vibe.thumbnail}
                  alt={vibe.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            )}
            <div className="flex flex-col gap-3 p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5">
                    {vibe.category}
                  </span>
                  <h2 className="mt-2 text-base font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {vibe.title}
                  </h2>
                </div>
                <ArrowUpRightIcon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {vibe.description}
              </p>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
