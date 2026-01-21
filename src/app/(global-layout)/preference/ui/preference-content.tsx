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
        <h2 className="text-xs sm:text-sm font-normal text-foreground mb-3 sm:mb-4 flex items-center gap-2 uppercase tracking-[0.15em]">
          <span className="w-2 h-2 bg-primary" />
          Music
        </h2>
        <div className="mb-6">
          <h3 className="text-[9px] sm:text-[10px] font-normal text-muted-foreground uppercase tracking-[0.15em] mb-3">
            Concert
          </h3>
          <ul className="space-y-2 text-xs sm:text-sm">
            {concerts.map((concert) => (
              <li key={concert.title}>
                <a
                  href={concert.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
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
        <h2 className="text-xs sm:text-sm font-normal text-foreground mb-3 sm:mb-4 flex items-center gap-2 uppercase tracking-[0.15em]">
          <span className="w-2 h-2 bg-primary" />
          Book
        </h2>
        {Object.entries(booksByYear)
          .sort(([a], [b]) => Number(b) - Number(a))
          .map(([year, books]) => (
            <div key={year} className="mb-6">
              <h3 className="text-[9px] sm:text-[10px] font-normal text-muted-foreground uppercase tracking-[0.15em] mb-3">
                {year}
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm">
                {books.map((book) => (
                  <li key={book.title}>
                    <a
                      href={book.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {book.title}{' '}
                      <span className="text-muted-foreground/60">
                        ({book.author})
                      </span>
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
        <h2 className="text-xs sm:text-sm font-normal text-foreground mb-3 sm:mb-4 flex items-center gap-2 uppercase tracking-[0.15em]">
          <span className="w-2 h-2 bg-primary" />
          Movie
        </h2>
        {Object.entries(movies)
          .sort(([a], [b]) => Number(b) - Number(a))
          .map(([year, movieList]) => (
            <div key={year} className="mb-6">
              <h3 className="text-[9px] sm:text-[10px] font-normal text-muted-foreground uppercase tracking-[0.15em] mb-3">
                {year}
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm">
                {movieList.map((movie) => (
                  <li key={movie.title} className="text-muted-foreground">
                    {movie.title}{' '}
                    <span className="text-muted-foreground/60">
                      ({movie.director})
                    </span>
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
        <h2 className="text-xs sm:text-sm font-normal text-foreground mb-3 sm:mb-4 flex items-center gap-2 uppercase tracking-[0.15em]">
          <span className="w-2 h-2 bg-primary" />
          Interest
        </h2>
        <ul className="space-y-2 text-xs sm:text-sm">
          {interests.map((interest) => (
            <li key={interest.title} className="text-muted-foreground">
              {interest.title}
              {interest.link && interest.linkText && (
                <>
                  {' '}
                  <a
                    href={interest.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 transition-colors"
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
