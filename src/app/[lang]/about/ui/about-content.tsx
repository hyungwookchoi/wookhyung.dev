'use client';

import {
  ArrowRightIcon,
  GitMergeIcon,
  GitPullRequestIcon,
  RssIcon,
} from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';

import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/get-dictionary';
import { siteConfig } from '@/shared/config/site';
import { EmailIcon } from '@/shared/icon/email-icon';
import { GithubIcon } from '@/shared/icon/github-icon';
import { LinkedinIcon } from '@/shared/icon/linkedin-icon';
import { cn } from '@/shared/lib/tailwind-merge';

const STAGGER_DELAY = 0.08;
const INITIAL_DELAY = 0.1;

const fadeInUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

type ContributionStatus = 'merged' | 'open';

interface Contribution {
  title: string;
  link: string;
  status: ContributionStatus;
}

const contributions: Contribution[] = [
  {
    title: 'make head function scripts load properly',
    link: 'https://github.com/TanStack/router/pull/4323',
    status: 'merged',
  },
  {
    title: 'support SSR for non-Latin character route paths',
    link: 'https://github.com/TanStack/router/pull/4611',
    status: 'merged',
  },
  {
    title: 'properly merge middleware context objects',
    link: 'https://github.com/TanStack/router/pull/4665',
    status: 'merged',
  },
  {
    title: 'reset statusCode to 200 on navigation start',
    link: 'https://github.com/TanStack/router/pull/4664',
    status: 'merged',
  },
  {
    title: 'prevent script tag duplication in SSR and client-side navigation',
    link: 'https://github.com/TanStack/router/pull/5095',
    status: 'merged',
  },
];

const projects = [
  {
    title: 'wookhyung.dev',
    link: 'https://github.com/hyungwookchoi/wookhyung.dev',
    description: {
      ko: '개인 블로그, 25.07 - 현재',
      en: 'Personal blog, Jul 2025 - Present',
    },
  },
  {
    title: 'Google Chat Webhook Action',
    link: 'https://github.com/hyungwookchoi/google-chat-webhook-action',
    description: {
      ko: 'GitHub Action for Google Chat, 25.06 - 25.07',
      en: 'GitHub Action for Google Chat, Jun 2025 - Jul 2025',
    },
  },
  {
    title: 'nowoo',
    link: 'https://github.com/thoupe/nowoo',
    description: {
      ko: '메이플랜드 아이템 검색 사이트, 24.01 - 24.02',
      en: 'Mapleland item search site, Jan 2024 - Feb 2024',
    },
  },
];

interface AboutContentProps {
  lang: Locale;
  dict: Dictionary;
}

export function AboutContent({ lang, dict }: AboutContentProps) {
  let sectionIndex = 0;

  return (
    <div className="min-h-screen py-8">
      {/* Hero */}
      <motion.div
        className="flex flex-col items-center text-center pb-12"
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.5, delay: INITIAL_DELAY }}
      >
        <div className="relative overflow-hidden border border-neutral-700 bg-neutral-200 mb-6">
          <Image
            src="/wookhyung.png"
            width={128}
            height={128}
            alt="Wookhyung Profile"
          />
        </div>

        <div className="space-y-2 mb-6">
          <h1 className="text-3xl font-light text-neutral-100">
            {dict.about.name}
          </h1>
          <p className="text-sm text-neutral-500 uppercase tracking-[0.15em]">
            {dict.about.subName}
          </p>
        </div>

        <div className="flex space-x-3">
          <a
            href={siteConfig.social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-11 h-11 bg-emerald-400 text-[#0a0a0b] hover:bg-emerald-300 transition-colors"
            aria-label="GitHub"
          >
            <GithubIcon className="w-5 h-5" />
          </a>
          <a
            href={siteConfig.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-11 h-11 bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-emerald-400 transition-colors"
            aria-label="LinkedIn"
          >
            <LinkedinIcon className="w-5 h-5" />
          </a>
          <a
            href={`mailto:${siteConfig.social.email}`}
            className="flex items-center justify-center w-11 h-11 bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-emerald-400 transition-colors"
            aria-label="Email"
          >
            <EmailIcon className="w-5 h-5" />
          </a>
          <a
            href={siteConfig.feeds.rss}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-11 h-11 bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-emerald-400 transition-colors"
            aria-label="RSS"
          >
            <RssIcon className="w-5 h-5" />
          </a>
        </div>
      </motion.div>

      <div className="max-w-2xl mx-auto space-y-10">
        <motion.section
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{
            duration: 0.5,
            delay: INITIAL_DELAY + STAGGER_DELAY * ++sectionIndex,
          }}
        >
          <h2 className="text-sm font-normal text-neutral-200 mb-4 flex items-center gap-2 uppercase tracking-[0.15em]">
            <span className="w-2 h-2 bg-emerald-400" />
            {dict.about.experience}
          </h2>
          <ul className="space-y-2 text-neutral-400">
            <li>{dict.about.experienceDesc}</li>
          </ul>
        </motion.section>

        <motion.section
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{
            duration: 0.5,
            delay: INITIAL_DELAY + STAGGER_DELAY * ++sectionIndex,
          }}
        >
          <h2 className="text-sm font-normal text-neutral-200 mb-4 flex items-center gap-2 uppercase tracking-[0.15em]">
            <span className="w-2 h-2 bg-emerald-400" />
            {dict.about.techStack}
          </h2>
          <ul className="space-y-2 text-neutral-400">
            <li>{dict.about.techStackDesc}</li>
          </ul>
        </motion.section>

        <motion.section
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{
            duration: 0.5,
            delay: INITIAL_DELAY + STAGGER_DELAY * ++sectionIndex,
          }}
        >
          <h2 className="text-sm font-normal text-neutral-200 mb-4 flex items-center gap-2 uppercase tracking-[0.15em]">
            <span className="w-2 h-2 bg-emerald-400" />
            {dict.about.openSource}
          </h2>
          <h3 className="text-[10px] font-normal text-neutral-500 uppercase tracking-[0.15em] mb-3">
            <a
              href="https://github.com/TanStack/router"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 transition-colors"
            >
              TanStack Router(Start)
            </a>
          </h3>
          <ul className="space-y-3">
            {contributions.map(({ title, link, status }) => (
              <li key={title}>
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      'flex items-center gap-1 text-[#0a0a0b] px-2 py-0.5 text-xs',
                      {
                        'bg-emerald-400': status === 'merged',
                        'bg-neutral-400': status === 'open',
                      },
                    )}
                  >
                    {status === 'merged' && (
                      <GitMergeIcon className="w-3 h-3" />
                    )}
                    {status === 'open' && (
                      <GitPullRequestIcon className="w-3 h-3" />
                    )}
                    <span>{status}</span>
                  </div>
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-400 hover:text-emerald-400 transition-colors line-clamp-1"
                  >
                    {title}
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </motion.section>

        <motion.section
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{
            duration: 0.5,
            delay: INITIAL_DELAY + STAGGER_DELAY * ++sectionIndex,
          }}
        >
          <h2 className="text-sm font-normal text-neutral-200 mb-4 flex items-center gap-2 uppercase tracking-[0.15em]">
            <span className="w-2 h-2 bg-emerald-400" />
            {dict.about.project}
          </h2>
          <ul className="space-y-2">
            {projects.map(({ title, link, description }) => (
              <li key={title} className="text-neutral-400">
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors"
                >
                  {title}
                </a>
                <span className="text-neutral-600"> ({description[lang]})</span>
              </li>
            ))}
          </ul>
        </motion.section>

        <motion.section
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{
            duration: 0.5,
            delay: INITIAL_DELAY + STAGGER_DELAY * ++sectionIndex,
          }}
        >
          <h2 className="text-sm font-normal text-neutral-200 mb-4 flex items-center gap-2 uppercase tracking-[0.15em]">
            <span className="w-2 h-2 bg-emerald-400" />
            {dict.about.education}
          </h2>
          <ul className="space-y-2 text-neutral-400">
            <li>{dict.about.educationDesc}</li>
          </ul>
        </motion.section>

        <motion.section
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{
            duration: 0.5,
            delay: INITIAL_DELAY + STAGGER_DELAY * ++sectionIndex,
          }}
        >
          <h2 className="text-sm font-normal text-neutral-200 mb-4 flex items-center gap-2 uppercase tracking-[0.15em]">
            <span className="w-2 h-2 bg-emerald-400" />
            {dict.about.contact}
          </h2>
          <ul className="space-y-2">
            <li>
              <a
                href={siteConfig.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-emerald-400 transition-colors"
              >
                GitHub: {siteConfig.author.name}
              </a>
            </li>
            <li>
              <a
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-emerald-400 transition-colors"
              >
                LinkedIn: hyungwookchoi
              </a>
            </li>
            <li>
              <a
                href={`mailto:${siteConfig.social.email}`}
                className="text-neutral-400 hover:text-emerald-400 transition-colors"
              >
                Email: {siteConfig.social.email}
              </a>
            </li>
          </ul>
        </motion.section>

        <motion.section
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{
            duration: 0.5,
            delay: INITIAL_DELAY + STAGGER_DELAY * ++sectionIndex,
          }}
        >
          <h2 className="text-sm font-normal text-neutral-200 mb-4 flex items-center gap-2 uppercase tracking-[0.15em]">
            <span className="w-2 h-2 bg-emerald-400" />
            {dict.about.interests}
          </h2>
          <ul className="space-y-2">
            <li>
              <a
                href="https://www.anthropic.com/claude-code"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-emerald-400 transition-colors"
              >
                Claude Code
              </a>
            </li>
          </ul>
        </motion.section>

        {/* Preference Link */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{
            duration: 0.5,
            delay: INITIAL_DELAY + STAGGER_DELAY * ++sectionIndex,
          }}
        >
          <Link
            href={`/${lang}/preference`}
            className={cn(
              'group flex items-center justify-between',
              'p-5',
              'bg-neutral-900/50 border border-neutral-800',
              'hover:bg-neutral-800/50 hover:border-neutral-700',
              'transition-all duration-200',
            )}
          >
            <div>
              <p className="text-[10px] text-neutral-500 uppercase tracking-[0.15em] mb-1">
                {dict.home.learnMore}
              </p>
              <p className="font-normal text-neutral-200 group-hover:text-emerald-400 transition-colors">
                {lang === 'ko'
                  ? '음악, 책, 영화, 관심사'
                  : 'Music, Books, Movies, Interests'}
              </p>
            </div>
            <ArrowRightIcon className="w-5 h-5 text-neutral-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
