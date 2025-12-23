'use client';

import { ArrowRightIcon, ArrowUpRightIcon } from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';

import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/get-dictionary';
import { siteConfig } from '@/shared/config/site';
import { GithubIcon } from '@/shared/icon/github-icon';
import { LinkedinIcon } from '@/shared/icon/linkedin-icon';
import { cn } from '@/shared/lib/tailwind-merge';
import { WithClaudeBadge } from '@/shared/ui/with-claude-badge';
import { getTechPostsByLocale } from '@/shared/util/post';

const STAGGER_DELAY = 0.08;
const INITIAL_DELAY = 0.2;

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

interface HomeContentProps {
  lang: Locale;
  dict: Dictionary;
}

export function HomeContent({ lang, dict }: HomeContentProps) {
  const recentPosts = getTechPostsByLocale(lang).slice(0, 5);

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
    <div className="flex flex-col gap-10 sm:gap-16 py-2 sm:py-4">
      {/* Hero Section */}
      <section className="relative">
        {/* Decorative grid background */}
        <div
          className="absolute inset-0 -z-10 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(to right, var(--primary) 1px, transparent 1px),
              linear-gradient(to bottom, var(--primary) 1px, transparent 1px)
            `,
            backgroundSize: '24px 24px',
          }}
        />

        <div className="flex flex-col gap-6 sm:gap-8">
          {/* Profile + Name */}
          <motion.div
            className="flex items-center gap-4 sm:gap-5"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.6, delay: INITIAL_DELAY }}
          >
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 overflow-hidden border border-border bg-white">
                <Image
                  src="/wookhyung.png"
                  width={80}
                  height={80}
                  alt="Wookhyung Profile"
                  className="object-cover"
                />
              </div>
              {/* Status indicator */}
              <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 bg-primary" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-foreground">
                {dict.home.name}
              </h1>
              <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-[0.15em]">
                {dict.home.role}
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
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {dict.home.bio}
              <br />
              <span className="opacity-70">{dict.home.bioSub}</span>
            </p>
          </motion.div>

          {/* Social Links */}
          <motion.div
            className="flex flex-wrap items-center gap-2 sm:gap-3"
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
                'flex items-center gap-2 px-4 py-2',
                'bg-primary text-primary-foreground',
                'text-xs font-medium uppercase tracking-wider',
                'hover:opacity-90 transition-opacity',
              )}
            >
              <GithubIcon className="w-4 h-4" />
              GitHub
            </a>
            <a
              href={siteConfig.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'flex items-center gap-2 px-4 py-2',
                'bg-secondary text-secondary-foreground',
                'text-xs font-medium uppercase tracking-wider border border-border',
                'hover:bg-muted hover:text-primary transition-colors',
              )}
            >
              <LinkedinIcon className="w-4 h-4" />
              LinkedIn
            </a>
            <Link
              href={`/${lang}/about`}
              className={cn(
                'flex items-center gap-1 px-4 py-2',
                'text-muted-foreground text-xs font-medium uppercase tracking-wider',
                'hover:text-primary transition-colors',
              )}
            >
              {dict.home.learnMore}
              <ArrowRightIcon className="w-4 h-4" />
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

      {/* Recent Posts Section */}
      <section>
        <motion.div
          className="flex items-baseline justify-between mb-6 sm:mb-8"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{
            duration: 0.6,
            delay: INITIAL_DELAY + STAGGER_DELAY * 4,
          }}
        >
          <div>
            <h2 className="text-[10px] text-muted-foreground uppercase tracking-[0.15em] mb-1">
              {dict.home.recentPostsLabel}
            </h2>
            <p className="text-xl sm:text-2xl font-light tracking-tight text-foreground">
              {dict.home.recentPostsTitle}
            </p>
          </div>
          <Link
            href={`/${lang}/tech`}
            className={cn(
              'flex items-center gap-1',
              'text-xs text-muted-foreground uppercase tracking-wider',
              'hover:text-primary transition-colors',
              'group',
            )}
          >
            {dict.home.viewAll}
            <ArrowRightIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>

        <div className="flex flex-col">
          {recentPosts.map((post, index) => (
            <motion.div
              key={post._id}
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              transition={{
                duration: 0.5,
                delay: INITIAL_DELAY + STAGGER_DELAY * (5 + index),
              }}
            >
              <Link
                href={`/${lang}/tech/${post.slug}`}
                className={cn(
                  'group flex items-start justify-between gap-3 sm:gap-4',
                  'py-4 sm:py-5 -mx-2 sm:-mx-3 px-2 sm:px-3',
                  'hover:bg-muted/50 transition-all duration-200',
                  'border-b border-border last:border-0',
                )}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 sm:mb-1.5 flex-wrap">
                    <span className="text-[10px] uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5">
                      Tech
                    </span>
                    <time className="text-[10px] text-muted-foreground uppercase tracking-wider">
                      {formatDate(post.date)}
                    </time>
                    {post.withClaude && <WithClaudeBadge />}
                  </div>
                  <h3 className="text-sm sm:text-base font-normal text-foreground group-hover:text-primary transition-colors line-clamp-2 sm:line-clamp-1">
                    {post.title}
                  </h3>
                  {post.summary && (
                    <p className="hidden sm:block mt-1 text-sm text-muted-foreground line-clamp-1">
                      {post.summary}
                    </p>
                  )}
                </div>
                <ArrowUpRightIcon className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-0.5 sm:mt-1" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Card */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{
            duration: 0.5,
            delay: INITIAL_DELAY + STAGGER_DELAY * (5 + recentPosts.length),
          }}
        >
          <Link
            href={`/${lang}/tech`}
            className={cn(
              'flex items-center justify-center gap-2',
              'mt-4 sm:mt-6 py-4 px-6',
              'bg-primary text-primary-foreground',
              'text-sm uppercase tracking-wider font-medium',
              'hover:opacity-90 transition-opacity',
              'group',
            )}
          >
            {dict.home.viewAllTech}
            <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
