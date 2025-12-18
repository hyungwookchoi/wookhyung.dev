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
import { techPosts } from '@/shared/util/post';

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
  const recentPosts = techPosts.slice(0, 5);

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
          className="absolute inset-0 -z-10 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(to right, currentColor 1px, transparent 1px),
              linear-gradient(to bottom, currentColor 1px, transparent 1px)
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
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-gray-300 bg-gray-200">
                <Image
                  src="/wookhyung.png"
                  width={80}
                  height={80}
                  alt="Wookhyung Profile"
                  className="object-cover"
                />
              </div>
              {/* Status indicator */}
              <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-5 h-5 sm:w-6 sm:h-6 bg-emerald-500 rounded-full border-[3px] sm:border-4 border-gray-100" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
                {dict.home.name}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 tracking-wide">
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
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              {dict.home.bio}
              <br />
              <span className="text-gray-500">{dict.home.bioSub}</span>
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
                'flex items-center gap-2 px-3 sm:px-4 py-2',
                'bg-gray-900 text-gray-100 rounded-full',
                'text-xs sm:text-sm font-medium',
                'hover:bg-gray-800 transition-colors',
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
                'flex items-center gap-2 px-3 sm:px-4 py-2',
                'bg-white text-gray-700 rounded-full',
                'text-xs sm:text-sm font-medium border border-gray-300',
                'hover:bg-gray-50 hover:border-gray-400 transition-colors',
              )}
            >
              <LinkedinIcon className="w-4 h-4" />
              LinkedIn
            </a>
            <Link
              href={`/${lang}/about`}
              className={cn(
                'flex items-center gap-1 px-3 sm:px-4 py-2',
                'text-gray-600 text-xs sm:text-sm font-medium',
                'hover:text-gray-900 transition-colors',
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
        className="h-px bg-linear-to-r from-gray-300 via-gray-200 to-transparent"
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
            <h2 className="text-[10px] sm:text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">
              {dict.home.recentPostsLabel}
            </h2>
            <p className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
              {dict.home.recentPostsTitle}
            </p>
          </div>
          <Link
            href={`/${lang}/tech`}
            className={cn(
              'flex items-center gap-1',
              'text-xs sm:text-sm text-gray-500',
              'hover:text-gray-900 transition-colors',
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
                  'py-4 sm:py-5 -mx-2 sm:-mx-3 px-2 sm:px-3 rounded-lg',
                  'hover:bg-white/60 transition-all duration-200',
                  'border-b border-gray-200/60 last:border-0',
                )}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 sm:mb-1.5">
                    <span className="text-[10px] sm:text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 sm:px-2 py-0.5 rounded">
                      Tech
                    </span>
                    <time className="text-[10px] sm:text-xs text-gray-400">
                      {formatDate(post.date)}
                    </time>
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-2 sm:line-clamp-1">
                    {post.title}
                  </h3>
                  {post.summary && (
                    <p className="hidden sm:block mt-1 text-sm text-gray-500 line-clamp-1">
                      {post.summary}
                    </p>
                  )}
                </div>
                <ArrowUpRightIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300 group-hover:text-emerald-600 transition-colors shrink-0 mt-0.5 sm:mt-1" />
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
              'mt-4 sm:mt-6 py-3 sm:py-4 px-4 sm:px-6',
              'bg-gray-900 text-gray-100 rounded-xl',
              'text-sm sm:text-base font-medium',
              'hover:bg-gray-800 transition-colors',
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
