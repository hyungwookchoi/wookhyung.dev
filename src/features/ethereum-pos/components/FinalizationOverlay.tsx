'use client';

import { AnimatePresence, motion } from 'motion/react';

import { useLocale } from '@/i18n/context';

import type { EpochTransitionState } from '../types/slot';

interface FinalizationOverlayProps {
  transition: EpochTransitionState;
  currentEpoch: number;
  previousEpoch: number;
}

export function FinalizationOverlay({
  transition,
  currentEpoch,
  previousEpoch,
}: FinalizationOverlayProps) {
  const locale = useLocale();

  const isActive =
    transition.isCheckpointing ||
    transition.isJustifying ||
    transition.isFinalizing;

  const getMessage = () => {
    if (transition.isCheckpointing) {
      return locale === 'ko'
        ? `에포크 ${currentEpoch} 체크포인트 생성 중...`
        : `Creating Epoch ${currentEpoch} Checkpoint...`;
    }
    if (transition.isJustifying) {
      return locale === 'ko'
        ? `에포크 ${previousEpoch} 정당화 완료`
        : `Epoch ${previousEpoch} Justified`;
    }
    if (transition.isFinalizing) {
      return locale === 'ko'
        ? `에포크 ${previousEpoch} 최종 확정!`
        : `Epoch ${previousEpoch} Finalized!`;
    }
    return '';
  };

  const getStatusColor = () => {
    if (transition.isCheckpointing) return 'text-amber-400';
    if (transition.isJustifying) return 'text-cyan-400';
    if (transition.isFinalizing) return 'text-emerald-400';
    return 'text-muted-foreground';
  };

  const getBorderColor = () => {
    if (transition.isCheckpointing) return 'border-amber-400/50';
    if (transition.isJustifying) return 'border-cyan-400/50';
    if (transition.isFinalizing) return 'border-emerald-400/50';
    return 'border-muted-foreground/50';
  };

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10"
        >
          {/* Glow 효과 */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`
              px-6 py-4 border-2 ${getBorderColor()} bg-muted/90
              ${transition.isFinalizing ? 'shadow-lg shadow-emerald-400/20' : ''}
            `}
          >
            <div className="flex flex-col items-center gap-2">
              {/* 아이콘 */}
              <motion.div
                animate={{
                  scale: transition.isFinalizing ? [1, 1.2, 1] : 1,
                  rotate: transition.isCheckpointing ? [0, 360] : 0,
                }}
                transition={{
                  duration: transition.isFinalizing ? 0.5 : 1,
                  repeat: transition.isCheckpointing ? Infinity : 0,
                  ease: 'linear',
                }}
                className={`text-2xl ${getStatusColor()}`}
              >
                {transition.isCheckpointing && '◈'}
                {transition.isJustifying && '◇'}
                {transition.isFinalizing && '◆'}
              </motion.div>

              {/* 상태 텍스트 */}
              <span
                className={`font-mono text-sm tracking-[0.15em] uppercase ${getStatusColor()}`}
              >
                {getMessage()}
              </span>

              {/* 프로그레스 바 */}
              {transition.isCheckpointing && (
                <motion.div
                  className="w-32 h-0.5 bg-border overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div
                    className="h-full bg-amber-400"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                </motion.div>
              )}

              {/* Finalized 반짝임 효과 */}
              {transition.isFinalizing && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.3, 0] }}
                  transition={{ duration: 0.8, repeat: 2 }}
                  style={{
                    background:
                      'radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%)',
                  }}
                />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
