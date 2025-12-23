'use client';

import { motion } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import { useLocale } from '@/i18n/context';

import { getTranslations } from '../../constants/translations';

export function ETagVisualization() {
  const locale = useLocale();
  const t = getTranslations(locale).etagDemo;
  const [step, setStep] = useState(0);
  const hasAutoStarted = useRef(false);

  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const mockParts = [
    { id: 1, hash: 'd41d8cd98f00b204e9800998ecf8427e' },
    { id: 2, hash: '098f6bcd4621d373cade4e832627b4f6' },
    { id: 3, hash: '5d41402abc4b2a76b9719d911017c592' },
  ];

  const concatenatedHash = 'd41d8cd9...098f6bcd...5d41402a';
  const finalMd5 = '7c12b89b4bd8b1a8f5e2...';
  const finalEtag = '7c12b89b4bd8b1a8f5e2...-3';

  // 전체 시뮬레이션 자동 실행
  const runFullSimulation = useCallback(async () => {
    setStep(0);
    await new Promise((r) => setTimeout(r, 500));
    setStep(1);
    await new Promise((r) => setTimeout(r, 1000));
    setStep(2);
    await new Promise((r) => setTimeout(r, 1000));
    setStep(3);
    await new Promise((r) => setTimeout(r, 1000));
    setStep(4);
  }, []);

  // 뷰포트 진입 시 자동 시작
  useEffect(() => {
    if (inView && !hasAutoStarted.current) {
      hasAutoStarted.current = true;
      runFullSimulation();
    }
  }, [inView, runFullSimulation]);

  const handleReplay = useCallback(() => {
    runFullSimulation();
  }, [runFullSimulation]);

  return (
    <div ref={ref} className="not-prose my-8 relative">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-2 h-6 bg-amber-400" />
        <div>
          <h3 className="text-sm font-mono uppercase tracking-wider text-foreground">
            {t.title}
          </h3>
          <p className="text-xs text-muted-foreground">{t.subtitle}</p>
        </div>
      </div>

      {/* Main visualization */}
      <div className="bg-card border border-border overflow-hidden">
        {/* Step indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-border">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`py-2 px-3 text-center transition-colors ${
                step >= s
                  ? 'bg-amber-500/10 border-b-2 border-amber-400'
                  : 'bg-muted/50'
              }`}
            >
              <div
                className={`text-[9px] font-mono ${
                  step >= s ? 'text-amber-400' : 'text-muted-foreground/60'
                }`}
              >
                {s === 1 && t.step1}
                {s === 2 && t.step2}
                {s === 3 && t.step3}
                {s === 4 && t.step4}
              </div>
            </div>
          ))}
        </div>

        {/* Visualization */}
        <div className="p-6 min-h-[300px]">
          <div className="flex flex-col gap-6">
            {/* Step 1: Part hashes */}
            <div className="flex flex-col gap-2">
              <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-2">
                {t.partHash}
              </div>
              <div className="grid gap-2">
                {mockParts.map((part, i) => (
                  <motion.div
                    key={part.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: step >= 1 ? 1 : 0.3, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div
                      className="w-12 h-8 flex items-center justify-center font-mono text-xs"
                      style={{
                        background: `hsl(${180 + i * 40}, 60%, 15%)`,
                        border: `1px solid hsl(${180 + i * 40}, 60%, 40%)`,
                        color: `hsl(${180 + i * 40}, 60%, 60%)`,
                      }}
                    >
                      P{part.id}
                    </div>
                    <div className="text-muted-foreground/60 text-xs">
                      MD5 =
                    </div>
                    <div
                      className={`font-mono text-[10px] px-2 py-1 bg-muted border transition-colors ${
                        step >= 1
                          ? 'text-cyan-400 border-cyan-500/30'
                          : 'text-muted-foreground/60 border-border'
                      }`}
                    >
                      {part.hash}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Arrow */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: step >= 2 ? 1 : 0.2 }}
              className="flex items-center justify-center"
            >
              <svg
                className="w-6 h-6 text-muted-foreground/60"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </motion.div>

            {/* Step 2: Concatenation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: step >= 2 ? 1 : 0.2 }}
              className="flex flex-col items-center"
            >
              <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-2">
                {t.concatenate} (Binary)
              </div>
              <div
                className={`font-mono text-[10px] px-3 py-2 bg-muted border transition-colors ${
                  step >= 2
                    ? 'text-amber-400 border-amber-500/30'
                    : 'text-muted-foreground/60 border-border'
                }`}
              >
                {concatenatedHash}
              </div>
            </motion.div>

            {/* Arrow */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: step >= 3 ? 1 : 0.2 }}
              className="flex items-center justify-center"
            >
              <svg
                className="w-6 h-6 text-muted-foreground/60"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </motion.div>

            {/* Step 3: Final MD5 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: step >= 3 ? 1 : 0.2 }}
              className="flex flex-col items-center"
            >
              <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-2">
                {t.finalHash}
              </div>
              <div
                className={`font-mono text-[10px] px-3 py-2 bg-muted border transition-colors ${
                  step >= 3
                    ? 'text-emerald-400 border-emerald-500/30'
                    : 'text-muted-foreground/60 border-border'
                }`}
              >
                {finalMd5}
              </div>
            </motion.div>

            {/* Arrow */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: step >= 4 ? 1 : 0.2 }}
              className="flex items-center justify-center"
            >
              <svg
                className="w-6 h-6 text-muted-foreground/60"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </motion.div>

            {/* Step 4: Final ETag */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{
                opacity: step >= 4 ? 1 : 0.2,
                scale: step >= 4 ? 1 : 0.9,
              }}
              className="flex flex-col items-center"
            >
              <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-2">
                {t.finalEtag}
              </div>
              <div
                className={`font-mono text-sm px-4 py-3 transition-colors ${
                  step >= 4
                    ? 'bg-emerald-500/10 border-2 border-emerald-500/50 text-emerald-400'
                    : 'bg-muted border border-border text-muted-foreground/60'
                }`}
              >
                &quot;{finalEtag}&quot;
              </div>
              {step >= 4 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-2 text-[10px] text-muted-foreground"
                >
                  <span className="text-emerald-400">-3</span> = {t.partCount}
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Note */}
        <div className="px-6 py-3 bg-muted/50 border-t border-border">
          <p className="text-[10px] text-muted-foreground font-mono">
            {t.note}
          </p>
        </div>

        {/* Control button */}
        {step >= 4 && (
          <div className="border-t border-border p-4 flex justify-center">
            <button
              onClick={handleReplay}
              className="px-6 py-2 bg-amber-500 text-background font-mono text-sm uppercase tracking-wider
                       hover:bg-amber-400 transition-colors"
            >
              {locale === 'ko' ? '다시 보기' : 'Replay'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
