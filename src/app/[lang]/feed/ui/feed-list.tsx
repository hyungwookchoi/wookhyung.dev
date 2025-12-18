'use client';

import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ArrowUpRightIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useMemo, useState } from 'react';

import { cn } from '@/shared/lib/tailwind-merge';

interface FeedItem {
  title: string;
  link: string;
  pubDate: string;
  feedName: string;
  feedUrl: string;
}

interface FeedListProps {
  items: FeedItem[];
}

const STAGGER_DELAY = 0.03;
const INITIAL_DELAY = 0.1;

const fadeInUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export function FeedList({ items }: FeedListProps) {
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);

  const authors = useMemo(() => {
    const authorSet = new Set(items.map((item) => item.feedName));
    return Array.from(authorSet).sort();
  }, [items]);

  const filteredItems = useMemo(() => {
    if (!selectedAuthor) return items;
    return items.filter((item) => item.feedName === selectedAuthor);
  }, [items, selectedAuthor]);

  return (
    <div className="flex flex-col gap-6">
      {/* Filter Buttons */}
      <motion.div
        className="flex flex-wrap gap-2"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: INITIAL_DELAY }}
      >
        <button
          onClick={() => setSelectedAuthor(null)}
          className={cn(
            'px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200',
            !selectedAuthor
              ? 'bg-gray-900 text-white'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50',
          )}
        >
          All
          <span className="ml-1.5 text-xs opacity-60">{items.length}</span>
        </button>
        {authors.map((author) => {
          const count = items.filter((item) => item.feedName === author).length;
          const isSelected = selectedAuthor === author;

          return (
            <button
              key={author}
              onClick={() => setSelectedAuthor(isSelected ? null : author)}
              className={cn(
                'px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200',
                isSelected
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700',
              )}
            >
              {author}
              <span className="ml-1.5 text-xs opacity-60">{count}</span>
            </button>
          );
        })}
      </motion.div>

      {/* Feed Items */}
      <div className="flex flex-col">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item, index) => (
            <motion.div
              key={`${item.feedUrl}-${item.title}`}
              layout
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{
                duration: 0.3,
                delay: INITIAL_DELAY + STAGGER_DELAY * Math.min(index, 10),
                ease: [0.25, 0.25, 0.25, 0.75],
              }}
            >
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'group flex items-start justify-between gap-4',
                  'py-4 -mx-2 px-2 rounded-lg',
                  'hover:bg-white/60 transition-all duration-200',
                  'border-b border-gray-200/60 last:border-0',
                )}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      {item.feedName}
                    </span>
                    <time className="text-xs text-gray-400">
                      {format(new Date(item.pubDate), 'yyyy년 MM월 dd일', {
                        locale: ko,
                      })}
                    </time>
                  </div>
                  <h2 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-2">
                    {item.title}
                  </h2>
                </div>
                <ArrowUpRightIcon className="w-5 h-5 text-gray-300 group-hover:text-blue-600 transition-colors shrink-0 mt-1" />
              </a>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <motion.div
            className="py-12 text-center text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            선택한 작성자의 피드가 없습니다.
          </motion.div>
        )}
      </div>
    </div>
  );
}
