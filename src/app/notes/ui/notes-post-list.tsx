'use client';

import { ArrowUpRightIcon } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';

import { cn } from '@/shared/lib/tailwind-merge';

interface Post {
  _id: string;
  slug: string;
  title: string;
  date: string;
  summary?: string;
}

interface NotesPostListProps {
  posts: Post[];
}

const STAGGER_DELAY = 0.06;
const INITIAL_DELAY = 0.15;

const fadeInUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

export function NotesPostList({ posts }: NotesPostListProps) {
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
            href={`/notes/${post.slug}`}
            className={cn(
              'group flex items-start justify-between gap-4',
              'py-4 -mx-2 px-2 rounded-lg',
              'hover:bg-white/60 transition-all duration-200',
              'border-b border-gray-200/60 last:border-0',
            )}
          >
            <div className="flex-1 min-w-0">
              <time className="text-xs text-gray-400 mb-1 block">
                {new Date(post.date).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </time>
              <h2 className="font-semibold text-gray-900 group-hover:text-violet-700 transition-colors">
                {post.title}
              </h2>
              {post.summary && (
                <p className="mt-1 text-sm text-gray-500 line-clamp-1">
                  {post.summary}
                </p>
              )}
            </div>
            <ArrowUpRightIcon className="w-5 h-5 text-gray-300 group-hover:text-violet-600 transition-colors shrink-0 mt-1" />
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
