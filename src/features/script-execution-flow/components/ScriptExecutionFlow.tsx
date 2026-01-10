'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';

import { useLocale } from '@/i18n/context';

import { FLOW_STEPS, getTranslations } from '../constants/translations';
import type { FlowStepType } from '../types';
import { FlowStep } from './FlowStep';

console.log('[ScriptExecutionFlow] Component file loaded');

export function ScriptExecutionFlow() {
  console.log('[ScriptExecutionFlow] Component rendering');

  const locale = useLocale();
  console.log('[ScriptExecutionFlow] locale from useLocale:', locale);

  const t = getTranslations(locale);
  console.log('[ScriptExecutionFlow] translations:', t);

  const [activeStep, setActiveStep] = useState<FlowStepType | null>('ssr');

  // Debug mount/unmount
  useEffect(() => {
    console.log('[ScriptExecutionFlow] Component mounted with locale:', locale);
    return () => {
      console.log('[ScriptExecutionFlow] Component unmounting');
    };
  }, [locale]);
  const [completedSteps, setCompletedSteps] = useState<Set<FlowStepType>>(
    new Set(),
  );
  const [isPlaying, setIsPlaying] = useState(false);

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying) return;

    const stepOrder: FlowStepType[] = ['ssr', 'hydration', 'dynamic'];
    const currentIndex = activeStep ? stepOrder.indexOf(activeStep) : -1;

    if (currentIndex >= stepOrder.length - 1) {
      setIsPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      const nextStep = stepOrder[currentIndex + 1];
      if (activeStep) {
        setCompletedSteps((prev) => new Set(prev).add(activeStep));
      }
      setActiveStep(nextStep);
    }, 3000);

    return () => clearTimeout(timer);
  }, [isPlaying, activeStep]);

  const handleStepClick = (stepId: FlowStepType) => {
    setIsPlaying(false);
    setActiveStep(stepId);
  };

  const handlePlay = () => {
    if (activeStep === 'dynamic') {
      handleReset();
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setActiveStep('ssr');
    setCompletedSteps(new Set());
  };

  const stepOrder: FlowStepType[] = ['ssr', 'hydration', 'dynamic'];
  const activeIndex = activeStep ? stepOrder.indexOf(activeStep) : 0;

  return (
    <div className="not-prose my-16 relative">
      {/* Container with sophisticated backdrop */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        {/* Gradient backdrop for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-card via-card to-card/80 border border-border/50 shadow-2xl" />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)
            `,
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative p-8 sm:p-12">
          {/* Header Section */}
          <header className="mb-10 space-y-4">
            <div className="flex items-center gap-3">
              {/* Status indicator dot */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="w-2 h-2 rounded-full bg-primary"
              />
              <span className="font-mono text-[10px] tracking-[0.25em] text-muted-foreground/70 uppercase font-medium">
                {t.header.badge}
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="font-mono text-2xl sm:text-3xl font-bold text-foreground tracking-tight leading-tight">
                {t.title}
              </h2>
              <p className="font-mono text-sm text-muted-foreground/80 max-w-2xl leading-relaxed">
                {t.subtitle}
              </p>
            </div>
          </header>

          {/* Divider */}
          <div className="relative h-px mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>

          {/* Control Panel */}
          <div className="mb-10 flex items-center gap-3 flex-wrap">
            <AnimatePresence mode="wait">
              {!isPlaying ? (
                <motion.button
                  key="play"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePlay}
                  className="group relative px-6 py-3 bg-primary text-primary-foreground font-mono text-xs font-semibold tracking-wide overflow-hidden transition-all"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                  />
                  <span className="relative flex items-center gap-2">
                    <svg
                      width="10"
                      height="12"
                      viewBox="0 0 10 12"
                      fill="currentColor"
                    >
                      <path d="M0 0L10 6L0 12V0Z" />
                    </svg>
                    {t.playButton}
                  </span>
                </motion.button>
              ) : (
                <motion.button
                  key="pause"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePause}
                  className="px-6 py-3 bg-amber-500 text-white font-mono text-xs font-semibold tracking-wide transition-all hover:bg-amber-600"
                >
                  <span className="flex items-center gap-2">
                    <svg
                      width="10"
                      height="12"
                      viewBox="0 0 10 12"
                      fill="currentColor"
                    >
                      <rect width="3" height="12" />
                      <rect x="7" width="3" height="12" />
                    </svg>
                    {t.pauseButton}
                  </span>
                </motion.button>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleReset}
              className="px-6 py-3 border border-border/60 font-mono text-xs font-semibold tracking-wide hover:border-primary hover:text-primary transition-all backdrop-blur-sm"
            >
              <span className="flex items-center gap-2">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M2 6a4 4 0 017-2.65L11 1M11 6a4 4 0 01-7 2.65L2 11" />
                </svg>
                {t.resetButton}
              </span>
            </motion.button>

            {/* Progress indicator */}
            <div className="ml-auto flex items-center gap-3">
              <span className="font-mono text-[10px] text-muted-foreground/60 tracking-wider uppercase">
                {t.progress}
              </span>
              <div className="flex gap-1.5">
                {stepOrder.map((step, idx) => (
                  <motion.div
                    key={step}
                    className={`h-1.5 rounded-full transition-all ${
                      idx < activeIndex || completedSteps.has(step)
                        ? 'w-8 bg-primary'
                        : idx === activeIndex
                          ? 'w-12 bg-primary'
                          : 'w-8 bg-border/40'
                    }`}
                    animate={{
                      width: idx === activeIndex ? 48 : 32,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Flow Steps Container */}
          <div className="relative space-y-0">
            {FLOW_STEPS.map((step, idx) => (
              <div key={step.id} className="relative">
                <FlowStep
                  step={step}
                  isActive={activeStep === step.id}
                  isCompleted={completedSteps.has(step.id)}
                  onClick={() => handleStepClick(step.id)}
                  locale={locale}
                  scriptLabels={t.scriptStates}
                  stepStatus={t.stepStatus}
                  sectionHeaders={t.sectionHeaders}
                  scriptDetails={t.scriptDetails}
                  stepNumber={idx + 1}
                  isPlaying={isPlaying}
                />

                {/* Connection line to next step */}
                {idx < FLOW_STEPS.length - 1 && (
                  <div className="relative h-12 flex items-center justify-center">
                    {/* Vertical line */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2">
                      <motion.div
                        className="h-full w-full bg-gradient-to-b from-primary/40 via-primary/20 to-transparent"
                        initial={{ scaleY: 0 }}
                        animate={{
                          scaleY:
                            completedSteps.has(step.id) || activeIndex > idx
                              ? 1
                              : 0.3,
                          opacity:
                            completedSteps.has(step.id) || activeIndex > idx
                              ? 1
                              : 0.3,
                        }}
                        transition={{ duration: 0.5 }}
                        style={{ transformOrigin: 'top' }}
                      />
                    </div>

                    {/* Animated flow indicator */}
                    {(completedSteps.has(step.id) || activeIndex > idx) && (
                      <motion.div
                        className="absolute left-1/2 -translate-x-1/2"
                        initial={{ top: 0, opacity: 0 }}
                        animate={{
                          top: '100%',
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      >
                        <svg
                          width="6"
                          height="8"
                          viewBox="0 0 6 8"
                          className="text-primary"
                        >
                          <path d="M3 0L6 4L3 8L0 4Z" fill="currentColor" />
                        </svg>
                      </motion.div>
                    )}

                    {/* Arrow chevron */}
                    <motion.div
                      animate={{
                        y: [0, 4, 0],
                        opacity:
                          activeIndex === idx && isPlaying
                            ? [0.3, 0.8, 0.3]
                            : 0.5,
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      className="relative z-10"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        className="text-primary/60"
                      >
                        <path
                          d="M5 7l5 5 5-5"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </motion.div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Result Highlight */}
          <AnimatePresence>
            {completedSteps.size === 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="mt-10 relative overflow-hidden"
              >
                {/* Animated gradient border */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-red-500/40 to-red-500/20 animate-pulse" />
                <div className="relative bg-card border-2 border-red-500/30 p-6">
                  {/* Warning stripe pattern */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1 opacity-20"
                    style={{
                      backgroundImage:
                        'repeating-linear-gradient(45deg, #ef4444 0, #ef4444 10px, transparent 10px, transparent 20px)',
                    }}
                  />

                  <div className="flex items-start gap-4">
                    <motion.div
                      animate={{
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 0.5,
                        repeat: 3,
                      }}
                      className="text-3xl flex-shrink-0 mt-1"
                    >
                      ⚠️
                    </motion.div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-mono text-base font-bold text-red-500 tracking-tight">
                          {t.result}
                        </h3>
                        <div className="h-px flex-1 bg-gradient-to-r from-red-500/40 to-transparent" />
                      </div>
                      <p className="font-mono text-sm text-muted-foreground/90 leading-relaxed">
                        {t.resultDescription}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer */}
          <footer className="mt-10 pt-8 border-t border-border/30">
            <div className="flex items-center gap-2 text-muted-foreground/60">
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="currentColor"
                className="opacity-50"
              >
                <circle
                  cx="6"
                  cy="6"
                  r="5"
                  stroke="currentColor"
                  strokeWidth="1"
                  fill="none"
                />
                <path
                  d="M6 3v3l2 1"
                  stroke="currentColor"
                  strokeWidth="1"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
              <p className="font-mono text-[10px] tracking-wide">{t.footer}</p>
            </div>
          </footer>
        </div>
      </motion.div>
    </div>
  );
}
