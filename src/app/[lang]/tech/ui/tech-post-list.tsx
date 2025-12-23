'use client';

import { ArrowUpRightIcon } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';

import type { Locale } from '@/i18n/config';
import { cn } from '@/shared/lib/tailwind-merge';
import { WithClaudeBadge } from '@/shared/ui/with-claude-badge';

interface Post {
  _id: string;
  slug: string;
  title: string;
  date: string;
  summary?: string;
  withClaude?: boolean;
}

interface TechPostListProps {
  posts: Post[];
  lang: Locale;
}

const STAGGER_DELAY = 0.06;
const INITIAL_DELAY = 0.15;

const fadeInUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

export function TechPostList({ posts, lang }: TechPostListProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(
      lang === 'ko' ? 'ko-KR' : 'en-US',
      {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      },
    );
  };

  return (
    <div className="flex flex-col">
      {posts.map((post, index) => (
        <motion.div
          key={post._id}
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{
            duration: 0.4,
            delay: INITIAL_DELAY + STAGGER_DELAY * index,
            ease: [0.25, 0.25, 0.25, 0.75],
          }}
        >
          <Link
            href={`/${lang}/tech/${post.slug}`}
            className={cn(
              'group flex items-start justify-between gap-4',
              'py-4 -mx-2 px-2',
              'hover:bg-neutral-900/50 transition-all duration-200',
              'border-b border-neutral-800 last:border-0',
            )}
          >
            <div className="flex-1 min-w-0">
              <time className="text-[10px] text-neutral-600 uppercase tracking-wider mb-1 block">
                {formatDate(post.date)}
              </time>
              <h2 className="font-normal text-neutral-200 group-hover:text-emerald-400 transition-colors flex items-center gap-2 flex-wrap">
                {post.title}
                {post.withClaude && <WithClaudeBadge />}
              </h2>
              {post.summary && (
                <p className="mt-1 text-sm text-neutral-500 line-clamp-1">
                  {post.summary}
                </p>
              )}
            </div>
            <ArrowUpRightIcon className="w-5 h-5 text-neutral-600 group-hover:text-emerald-400 transition-colors shrink-0 mt-1" />
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
