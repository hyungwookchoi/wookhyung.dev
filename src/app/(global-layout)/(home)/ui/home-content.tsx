'use client';

import { ArrowRightIcon } from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';

import { siteConfig } from '@/shared/config/site';
import { GithubIcon } from '@/shared/icon/github-icon';
import { LinkedinIcon } from '@/shared/icon/linkedin-icon';
import { cn } from '@/shared/lib/tailwind-merge';
import { notesPosts, techPosts } from '@/shared/util/post';

const STAGGER_DELAY = 0.08;
const INITIAL_DELAY = 0.2;

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

interface Post {
  _id: string;
  slug: string;
  title: string;
  date: string;
}

function PostList({
  posts,
  type,
  baseDelay,
}: {
  posts: Post[];
  type: 'tech' | 'notes';
  baseDelay: number;
}) {
  const formatDate = (date: string) => {
    const d = new Date(date);
    const year = d.getFullYear().toString().slice(2);
    const month = (d.getMonth() + 1).toString();
    const day = d.getDate().toString();
    return `${year}. ${month}. ${day}.`;
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
            delay: baseDelay + STAGGER_DELAY * index * 0.5,
          }}
        >
          <Link
            href={`/${type}/${post.slug}`}
            className={cn(
              'group flex items-center justify-between gap-8',
              'py-2',
              'hover:text-primary transition-colors',
              'border-b border-border/50 last:border-0',
            )}
          >
            <h3 className="flex-1 text-xs sm:text-sm font-normal text-foreground group-hover:text-primary transition-colors truncate">
              {post.title}
            </h3>
            <time className="text-[10px] sm:text-xs text-muted-foreground group-hover:text-primary/70 transition-colors shrink-0 tabular-nums">
              {formatDate(post.date)}
            </time>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

export function HomeContent() {
  const sortedTechPosts = [...techPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const sortedNotesPosts = [...notesPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <div className="flex flex-col py-2 sm:py-4">
      {/* Hero Section */}
      <section className="relative pb-6">
        <div className="flex flex-col gap-5 sm:gap-6">
          {/* Profile + Name */}
          <motion.div
            className="flex items-center gap-3 sm:gap-4"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.6, delay: INITIAL_DELAY }}
          >
            <div className="relative">
              <div className="w-14 h-14 sm:w-16 sm:h-16 overflow-hidden border border-border bg-white">
                <Image
                  src="/wookhyung.png"
                  width={64}
                  height={64}
                  alt="Wookhyung Profile"
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 sm:w-4 sm:h-4 bg-primary" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-light tracking-tight text-foreground">
                최형욱
              </h1>
              <p className="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-[0.15em]">
                Software Engineer
              </p>
            </div>
          </motion.div>

          {/* Bio */}
          <motion.div
            className="max-w-lg"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.6, delay: INITIAL_DELAY + STAGGER_DELAY }}
          >
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              사용자 경험과 코드 품질에 관심이 많은 프론트엔드 개발자입니다.
              <br />
              <span className="opacity-70">
                TypeScript, React, TanStack 생태계를 즐겨 사용합니다.
              </span>
            </p>
          </motion.div>

          {/* Social Links */}
          <motion.div
            className="flex flex-wrap items-center gap-2"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{
              duration: 0.6,
              delay: INITIAL_DELAY + STAGGER_DELAY * 2,
            }}
          >
            <a
              href={siteConfig.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5',
                'bg-primary text-primary-foreground',
                'text-[10px] font-medium uppercase tracking-wider',
                'hover:opacity-90 transition-opacity',
              )}
            >
              <GithubIcon className="w-3 h-3" />
              GitHub
            </a>
            <a
              href={siteConfig.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5',
                'bg-secondary text-secondary-foreground',
                'text-[10px] font-medium uppercase tracking-wider border border-border',
                'hover:bg-muted hover:text-primary transition-colors',
              )}
            >
              <LinkedinIcon className="w-3 h-3" />
              LinkedIn
            </a>
            <Link
              href="/about"
              className={cn(
                'flex items-center gap-1 px-3 py-1.5',
                'text-muted-foreground text-[10px] font-medium uppercase tracking-wider',
                'hover:text-primary transition-colors',
              )}
            >
              더 알아보기
              <ArrowRightIcon className="w-3 h-3" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Divider */}
      <motion.div
        className="h-px bg-border"
        initial={{ scaleX: 0, originX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: INITIAL_DELAY + STAGGER_DELAY * 3 }}
      />

      {/* Tech Section */}
      <section className="my-6">
        <motion.div
          className="mb-2"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{
            duration: 0.6,
            delay: INITIAL_DELAY + STAGGER_DELAY * 4,
          }}
        >
          <h2 className="text-base sm:text-lg font-light tracking-tight text-foreground">
            Tech
          </h2>
          <p className="text-[9px] text-muted-foreground uppercase tracking-[0.15em]">
            {sortedTechPosts.length} posts
          </p>
        </motion.div>

        <PostList
          posts={sortedTechPosts}
          type="tech"
          baseDelay={INITIAL_DELAY + STAGGER_DELAY * 5}
        />
      </section>

      {/* Divider */}
      <motion.div
        className="h-px bg-border"
        initial={{ scaleX: 0, originX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{
          duration: 0.8,
          delay: INITIAL_DELAY + STAGGER_DELAY * (5 + sortedTechPosts.length),
        }}
      />

      {/* Notes Section */}
      <section className="my-6">
        <motion.div
          className="mb-2"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{
            duration: 0.6,
            delay:
              INITIAL_DELAY +
              STAGGER_DELAY * (6 + sortedTechPosts.length * 0.5),
          }}
        >
          <h2 className="text-base sm:text-lg font-light tracking-tight text-foreground">
            Notes
          </h2>
          <p className="text-[9px] text-muted-foreground uppercase tracking-[0.15em]">
            {sortedNotesPosts.length} posts
          </p>
        </motion.div>

        <PostList
          posts={sortedNotesPosts}
          type="notes"
          baseDelay={
            INITIAL_DELAY + STAGGER_DELAY * (7 + sortedTechPosts.length * 0.5)
          }
        />
      </section>
    </div>
  );
}
