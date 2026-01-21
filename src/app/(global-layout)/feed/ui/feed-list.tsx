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

  const dateFormat = 'yyyy년 M월 d일';

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
            'px-4 py-2 text-xs font-medium uppercase tracking-wider transition-all duration-200 border',
            !selectedAuthor
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-transparent text-muted-foreground border-border hover:text-foreground hover:border-muted-foreground',
          )}
        >
          All
          <span className="ml-1.5 opacity-60">{items.length}</span>
        </button>
        {authors.map((author) => {
          const count = items.filter((item) => item.feedName === author).length;
          const isSelected = selectedAuthor === author;

          return (
            <button
              key={author}
              onClick={() => setSelectedAuthor(isSelected ? null : author)}
              className={cn(
                'px-4 py-2 text-xs font-medium uppercase tracking-wider transition-all duration-200 border',
                isSelected
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-transparent text-muted-foreground border-border hover:text-primary hover:border-primary/50',
              )}
            >
              {author}
              <span className="ml-1.5 opacity-60">{count}</span>
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
                  'py-4 sm:py-5 -mx-2 sm:-mx-3 px-2 sm:px-3',
                  'hover:bg-muted/50 transition-all duration-200',
                  'border-b border-border last:border-0',
                )}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 sm:mb-1.5">
                    <span className="text-[10px] uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5">
                      {item.feedName}
                    </span>
                    <time className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">
                      {format(new Date(item.pubDate), dateFormat, {
                        locale: ko,
                      })}
                    </time>
                  </div>
                  <h2 className="text-sm sm:text-base font-normal text-foreground group-hover:text-primary transition-colors line-clamp-2 sm:line-clamp-1">
                    {item.title}
                  </h2>
                </div>
                <ArrowUpRightIcon className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-0.5 sm:mt-1" />
              </a>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <motion.div
            className="py-12 text-center text-muted-foreground font-mono text-sm"
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
