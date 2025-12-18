'use client';

import { motion, type Variants } from 'motion/react';
import type { ReactNode } from 'react';

const STAGGER_DELAY = 0.06;
const INITIAL_DELAY = 0.1;

const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

interface AnimateProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  variant?: 'fadeInUp' | 'fadeIn';
}

export function Animate({
  children,
  delay = 0,
  className,
  variant = 'fadeInUp',
}: AnimateProps) {
  const variants = variant === 'fadeIn' ? fadeIn : fadeInUp;

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="initial"
      animate="animate"
      transition={{
        duration: 0.5,
        delay: INITIAL_DELAY + delay,
        ease: [0.25, 0.25, 0.25, 0.75],
      }}
    >
      {children}
    </motion.div>
  );
}

interface AnimateListProps {
  children: ReactNode[];
  className?: string;
  startDelay?: number;
}

export function AnimateList({
  children,
  className,
  startDelay = 0,
}: AnimateListProps) {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <motion.div
          key={index}
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{
            duration: 0.4,
            delay: INITIAL_DELAY + startDelay + STAGGER_DELAY * index,
            ease: [0.25, 0.25, 0.25, 0.75],
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}

interface AnimatePageProps {
  children: ReactNode;
  className?: string;
}

export function AnimatePage({ children, className }: AnimatePageProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
