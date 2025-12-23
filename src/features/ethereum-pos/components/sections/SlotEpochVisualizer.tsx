'use client';

import { motion } from 'motion/react';
import { useCallback, useEffect, useState } from 'react';

import { useLocale } from '@/i18n/context';

const translations = {
  ko: {
    title: '슬롯 & 에포크 시각화',
    subtitle: '32개의 슬롯이 1 에포크를 구성합니다',
    slot: '슬롯',
    epoch: '에포크',
    seconds: '초',
    minutes: '분',
    slotDuration: '슬롯 당 12초',
    epochDuration: '에포크 = 32 슬롯 = 6.4분',
    play: '재생',
    pause: '일시정지',
    reset: '초기화',
    currentSlot: '현재 슬롯',
    timeRemaining: '남은 시간',
    totalTime: '총 시간',
  },
  en: {
    title: 'Slot & Epoch Visualization',
    subtitle: '32 slots form 1 epoch',
    slot: 'Slot',
    epoch: 'Epoch',
    seconds: 'sec',
    minutes: 'min',
    slotDuration: '12 seconds per slot',
    epochDuration: 'Epoch = 32 slots = 6.4 min',
    play: 'Play',
    pause: 'Pause',
    reset: 'Reset',
    currentSlot: 'Current Slot',
    timeRemaining: 'Time Left',
    totalTime: 'Total Time',
  },
};

export function SlotEpochVisualizer() {
  const locale = useLocale();
  const t = translations[locale];

  const [currentSlot, setCurrentSlot] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const SLOT_DURATION = 1000; // 1초 (12초의 1/12로 축소)
  const TOTAL_SLOTS = 32;

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentSlot((slot) => {
            if (slot >= TOTAL_SLOTS - 1) {
              setIsRunning(false);
              return slot;
            }
            return slot + 1;
          });
          return 0;
        }
        return prev + 10;
      });
    }, SLOT_DURATION / 10);

    return () => clearInterval(interval);
  }, [isRunning]);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setCurrentSlot(0);
    setProgress(0);
  }, []);

  return (
    <div className="not-prose my-8 relative">
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

      <div className="bg-card border border-border p-6 space-y-6">
        {/* Timing Info */}
        <div className="flex flex-wrap gap-4 text-xs font-mono text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-400/20 border border-amber-400/40" />
            <span>{t.slotDuration}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-cyan-400/20 border border-cyan-400/40" />
            <span>{t.epochDuration}</span>
          </div>
        </div>

        {/* Slot Grid */}
        <div className="relative">
          {/* Epoch boundary markers */}
          <div className="absolute -left-2 top-0 bottom-0 w-0.5 bg-cyan-400/30" />
          <div className="absolute -right-2 top-0 bottom-0 w-0.5 bg-cyan-400/30" />

          <div className="grid grid-cols-8 gap-1">
            {Array.from({ length: TOTAL_SLOTS }).map((_, index) => {
              const isPast = index < currentSlot;
              const isCurrent = index === currentSlot;
              const isFuture = index > currentSlot;

              return (
                <motion.div
                  key={index}
                  className={`
                    relative aspect-square flex items-center justify-center
                    font-mono text-[10px] transition-colors duration-300
                    ${isPast ? 'bg-emerald-400/20 border border-emerald-400/30 text-emerald-400' : ''}
                    ${isCurrent ? 'bg-amber-400/20 border-2 border-amber-400 text-amber-400' : ''}
                    ${isFuture ? 'bg-muted/50 border border-border text-muted-foreground/60' : ''}
                  `}
                  initial={false}
                  animate={
                    isCurrent
                      ? {
                          scale: [1, 1.02, 1],
                          transition: { duration: 0.5, repeat: Infinity },
                        }
                      : {}
                  }
                >
                  {index + 1}
                  {/* Progress bar for current slot */}
                  {isCurrent && (
                    <motion.div
                      className="absolute bottom-0 left-0 h-0.5 bg-amber-400"
                      style={{ width: `${progress}%` }}
                    />
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Epoch label */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-mono text-cyan-400/50 tracking-wider">
            1 EPOCH
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4">
          <div className="bg-muted/50 p-3 border border-border">
            <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider mb-1">
              {t.currentSlot}
            </div>
            <div className="font-mono text-lg text-foreground">
              {currentSlot + 1}
              <span className="text-muted-foreground/60 text-sm">/32</span>
            </div>
          </div>

          <div className="bg-muted/50 p-3 border border-border">
            <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider mb-1">
              {t.timeRemaining}
            </div>
            <div className="font-mono text-lg text-foreground">
              {((TOTAL_SLOTS - currentSlot) * 12).toFixed(0)}
              <span className="text-muted-foreground/60 text-sm">
                {' '}
                {t.seconds}
              </span>
            </div>
          </div>

          <div className="bg-muted/50 p-3 border border-border">
            <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider mb-1">
              {t.totalTime}
            </div>
            <div className="font-mono text-lg text-foreground">
              6.4
              <span className="text-muted-foreground/60 text-sm">
                {' '}
                {t.minutes}
              </span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            disabled={currentSlot >= TOTAL_SLOTS - 1 && progress >= 100}
            className={`
              px-4 py-2 font-mono text-[10px] uppercase tracking-wider transition-colors
              ${
                isRunning
                  ? 'bg-amber-500 text-background hover:bg-amber-400'
                  : 'bg-cyan-500 text-background hover:bg-cyan-400'
              }
              disabled:bg-muted disabled:text-muted-foreground
            `}
          >
            {isRunning ? t.pause : t.play}
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 font-mono text-[10px] uppercase tracking-wider
                     border border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground transition-colors"
          >
            {t.reset}
          </button>
        </div>
      </div>
    </div>
  );
}
