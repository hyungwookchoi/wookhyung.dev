'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import { useLocale } from '@/i18n/context';

import { getTranslations } from '../../constants/translations';

type Stage = 0 | 1 | 2 | 3;

export function MultipartProcessDemo() {
  const locale = useLocale();
  const t = getTranslations(locale).processDemo;
  const [stage, setStage] = useState<Stage>(0);
  const hasAutoStarted = useRef(false);

  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const mockParts = [
    { id: 1, etag: 'a1b2c3d4e5f6' },
    { id: 2, etag: 'f6e5d4c3b2a1' },
    { id: 3, etag: '1a2b3c4d5e6f' },
  ];

  // 전체 시뮬레이션 자동 실행
  const runFullSimulation = useCallback(async () => {
    setStage(0);
    await new Promise((r) => setTimeout(r, 1000));
    setStage(1);
    await new Promise((r) => setTimeout(r, 2000));
    setStage(2);
    await new Promise((r) => setTimeout(r, 2000));
    setStage(3);
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
        <div className="w-2 h-6 bg-cyan-400" />
        <div>
          <h3 className="text-sm font-mono uppercase tracking-wider text-foreground">
            {t.title}
          </h3>
          <p className="text-xs text-muted-foreground">{t.subtitle}</p>
        </div>
      </div>

      {/* Main visualization */}
      <div className="bg-card border border-border overflow-hidden">
        {/* Stage indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-3 border-b border-border">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`py-3 px-4 text-center transition-colors ${
                stage >= s
                  ? 'bg-cyan-500/10 border-b-2 border-cyan-400'
                  : 'bg-muted/50'
              }`}
            >
              <div
                className={`text-[10px] font-mono uppercase tracking-wider ${
                  stage >= s ? 'text-cyan-400' : 'text-muted-foreground/60'
                }`}
              >
                {s === 1 && t.stage1Title}
                {s === 2 && t.stage2Title}
                {s === 3 && t.stage3Title}
              </div>
              <div className="text-[9px] text-muted-foreground mt-0.5">
                {s === 1 && t.stage1Desc}
                {s === 2 && t.stage2Desc}
                {s === 3 && t.stage3Desc}
              </div>
            </div>
          ))}
        </div>

        {/* Visualization area */}
        <div className="p-6 min-h-[280px] relative">
          <AnimatePresence mode="wait">
            {/* Stage 0: Initial state */}
            {stage === 0 && (
              <motion.div
                key="stage0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-full min-h-[220px]"
              >
                <div className="w-24 h-28 border-2 border-dashed border-border flex items-center justify-center mb-4">
                  <div className="text-center">
                    <div className="text-2xl text-muted-foreground/60">
                      <svg
                        className="w-10 h-10 mx-auto"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-1">
                      video.mp4
                    </div>
                    <div className="text-[9px] text-muted-foreground/60">
                      100 MB
                    </div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {t.clickToStart}
                </div>
              </motion.div>
            )}

            {/* Stage 1: Initiate */}
            {stage === 1 && (
              <motion.div
                key="stage1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 min-h-[220px]"
              >
                {/* Client */}
                <div className="text-center">
                  <div className="w-20 h-20 bg-muted border border-border flex items-center justify-center mb-2">
                    <svg
                      className="w-8 h-8 text-muted-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    Client
                  </div>
                </div>

                {/* Arrow with API call */}
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={{ scaleX: 0, scaleY: 0 }}
                    animate={{ scaleX: 1, scaleY: 1 }}
                    transition={{ delay: 0.2 }}
                    className="w-0.5 h-12 sm:w-24 sm:h-0.5 bg-gradient-to-b sm:bg-gradient-to-r from-cyan-500 to-amber-500"
                  />
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-[9px] text-cyan-400 font-mono mt-1"
                  >
                    CreateMultipartUpload
                  </motion.div>
                </div>

                {/* S3 */}
                <div className="text-center">
                  <div className="w-20 h-20 bg-amber-500/10 border border-amber-500/50 flex items-center justify-center mb-2">
                    <span className="text-amber-400 font-mono text-lg font-bold">
                      S3
                    </span>
                  </div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-[10px] text-muted-foreground"
                  >
                    {t.uploadId}
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-[9px] text-amber-400 font-mono"
                  >
                    abc123xyz
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* Stage 2: Upload Parts */}
            {stage === 2 && (
              <motion.div
                key="stage2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 min-h-[220px]"
              >
                {/* File parts */}
                <div className="flex flex-col gap-2">
                  {mockParts.map((part, i) => (
                    <motion.div
                      key={part.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.15 }}
                      className="flex items-center gap-2"
                    >
                      <div
                        className="w-14 h-10 flex items-center justify-center font-mono text-sm"
                        style={{
                          background: `hsl(${180 + i * 40}, 60%, 15%)`,
                          border: `1px solid hsl(${180 + i * 40}, 60%, 40%)`,
                          color: `hsl(${180 + i * 40}, 60%, 60%)`,
                        }}
                      >
                        P{part.id}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Arrows */}
                <div className="hidden sm:flex flex-col gap-2">
                  {mockParts.map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.3 + i * 0.15 }}
                      className="w-16 h-0.5 bg-gradient-to-r from-cyan-500 to-amber-500"
                    />
                  ))}
                </div>
                {/* Mobile Arrow */}
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: 0.3 }}
                  className="sm:hidden w-0.5 h-8 bg-gradient-to-b from-cyan-500 to-amber-500"
                />

                {/* S3 bucket with ETags */}
                <div className="bg-amber-500/10 border border-amber-500/50 p-4">
                  <div className="text-center mb-3">
                    <span className="text-amber-400 font-mono text-sm font-bold">
                      S3
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {mockParts.map((part, i) => (
                      <motion.div
                        key={part.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 + i * 0.15 }}
                        className="flex items-center gap-2 text-[9px] font-mono"
                      >
                        <span className="text-muted-foreground">
                          {t.partLabel} {part.id}:
                        </span>
                        <span className="text-cyan-400">{part.etag}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Stage 3: Complete */}
            {stage === 3 && (
              <motion.div
                key="stage3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center min-h-[220px]"
              >
                {/* Parts merging animation */}
                <div className="flex items-center gap-2 mb-6">
                  {mockParts.map((part, i) => (
                    <motion.div
                      key={part.id}
                      initial={{
                        x: i === 0 ? -20 : i === 2 ? 20 : 0,
                        opacity: 1,
                      }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.1, duration: 0.3 }}
                      className="w-10 h-8 flex items-center justify-center font-mono text-xs"
                      style={{
                        background: `hsl(${180 + i * 40}, 60%, 15%)`,
                        border: `1px solid hsl(${180 + i * 40}, 60%, 40%)`,
                        color: `hsl(${180 + i * 40}, 60%, 60%)`,
                      }}
                    >
                      P{part.id}
                    </motion.div>
                  ))}
                </div>

                {/* Arrow down */}
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: 0.4 }}
                  className="w-0.5 h-8 bg-gradient-to-b from-cyan-500 to-emerald-500"
                />

                {/* Final object */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-14 bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-emerald-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs text-emerald-400">
                        {t.finalObject}
                      </div>
                      <div className="text-[10px] text-muted-foreground font-mono">
                        video.mp4
                      </div>
                      <div className="text-[9px] text-muted-foreground">
                        100 MB
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Success checkmark */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mt-4 text-[10px] text-emerald-400"
                >
                  CompleteMultipartUpload Success
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Control button */}
        {stage === 3 && (
          <div className="border-t border-border p-4 flex justify-center">
            <button
              onClick={handleReplay}
              className="px-6 py-2 bg-cyan-500 text-background font-mono text-sm uppercase tracking-wider
                       hover:bg-cyan-400 transition-colors"
            >
              {t.restart}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
