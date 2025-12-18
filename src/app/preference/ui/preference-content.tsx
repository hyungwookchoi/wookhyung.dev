'use client';

import { motion } from 'motion/react';

import type { Book, InterestItem, Link } from '../const/preference';

interface PreferenceContentProps {
  concerts: readonly Link[];
  booksByYear: Record<number, readonly Book[]>;
  movies: Readonly<
    Record<
      number,
      readonly { readonly title: string; readonly director: string }[]
    >
  >;
  interests: readonly InterestItem[];
}

const STAGGER_DELAY = 0.08;
const INITIAL_DELAY = 0.1;

const fadeInUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

export function PreferenceContent({
  concerts,
  booksByYear,
  movies,
  interests,
}: PreferenceContentProps) {
  let sectionIndex = 0;

  return (
    <div className="pb-12 space-y-10">
      <motion.section
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        transition={{
          duration: 0.5,
          delay: INITIAL_DELAY + STAGGER_DELAY * sectionIndex++,
        }}
      >
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-rose-500 rounded-full" />
          Music
        </h2>
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Concert
          </h3>
          <ul className="space-y-2">
            {concerts.map((concert) => (
              <li key={concert.title}>
                <a
                  href={concert.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-rose-600 transition-colors inline-flex items-center gap-1"
                >
                  {concert.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </motion.section>

      <motion.section
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        transition={{
          duration: 0.5,
          delay: INITIAL_DELAY + STAGGER_DELAY * sectionIndex++,
        }}
      >
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-amber-500 rounded-full" />
          Book
        </h2>
        {Object.entries(booksByYear)
          .sort(([a], [b]) => Number(b) - Number(a))
          .map(([year, books]) => (
            <div key={year} className="mb-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                {year}
              </h3>
              <ul className="space-y-2">
                {books.map((book) => (
                  <li key={book.title}>
                    <a
                      href={book.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-700 hover:text-amber-600 transition-colors"
                    >
                      {book.title}{' '}
                      <span className="text-gray-400">({book.author})</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
      </motion.section>

      <motion.section
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        transition={{
          duration: 0.5,
          delay: INITIAL_DELAY + STAGGER_DELAY * sectionIndex++,
        }}
      >
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-sky-500 rounded-full" />
          Movie
        </h2>
        {Object.entries(movies)
          .sort(([a], [b]) => Number(b) - Number(a))
          .map(([year, movieList]) => (
            <div key={year} className="mb-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                {year}
              </h3>
              <ul className="space-y-2">
                {movieList.map((movie) => (
                  <li key={movie.title} className="text-gray-700">
                    {movie.title}{' '}
                    <span className="text-gray-400">({movie.director})</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
      </motion.section>

      <motion.section
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        transition={{
          duration: 0.5,
          delay: INITIAL_DELAY + STAGGER_DELAY * sectionIndex++,
        }}
      >
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-500 rounded-full" />
          Interest
        </h2>
        <ul className="space-y-2">
          {interests.map((interest) => (
            <li key={interest.title} className="text-gray-700">
              {interest.title}
              {interest.link && interest.linkText && (
                <>
                  {' '}
                  <a
                    href={interest.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    {interest.linkText}
                  </a>
                </>
              )}
            </li>
          ))}
        </ul>
      </motion.section>
    </div>
  );
}
