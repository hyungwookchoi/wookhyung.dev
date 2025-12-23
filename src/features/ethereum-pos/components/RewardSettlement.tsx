'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';

import { useLocale } from '@/i18n/context';

interface RewardSettlementProps {
  isSettling: boolean;
  epochReward: number;
  cumulativeReward: number;
  currentEpoch: number;
}

export function RewardSettlement({
  isSettling,
  epochReward,
  cumulativeReward,
  currentEpoch,
}: RewardSettlementProps) {
  const locale = useLocale();
  const [showReward, setShowReward] = useState(false);
  const [displayReward, setDisplayReward] = useState(0);

  // 정산 완료 후 보상 표시
  useEffect(() => {
    if (!isSettling && epochReward > 0 && cumulativeReward > 0) {
      setShowReward(true);

      // 카운트업 애니메이션
      const startValue = displayReward;
      const endValue = cumulativeReward;
      const duration = 1000;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic

        setDisplayReward(startValue + (endValue - startValue) * eased);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);

      // 3초 후 숨기기
      const timeout = setTimeout(() => {
        setShowReward(false);
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [isSettling, epochReward, cumulativeReward]);

  const formatReward = (value: number) => {
    if (value >= 1) {
      return `+${value.toFixed(6)} ETH`;
    }
    return `+${value.toFixed(8)} ETH`;
  };

  return (
    <AnimatePresence>
      {(isSettling || showReward) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="border border-border bg-muted/80 p-4"
        >
          {isSettling ? (
            // 정산 중 UI
            <div className="flex items-center gap-4">
              {/* 로딩 스피너 */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-6 h-6 border-2 border-border border-t-emerald-400 rounded-full"
              />

              <div className="flex-1">
                <span className="font-mono text-sm text-foreground">
                  {locale === 'ko'
                    ? '검증인 수익 정산 중...'
                    : 'Calculating validator rewards...'}
                </span>
                <motion.div
                  className="mt-2 h-1 bg-border overflow-hidden rounded-full"
                  initial={{ width: '100%' }}
                >
                  <motion.div
                    className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                </motion.div>
              </div>
            </div>
          ) : (
            // 정산 완료 UI
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-8 h-8 bg-emerald-400/20 border border-emerald-400/30 flex items-center justify-center"
                >
                  <span className="text-emerald-400">◎</span>
                </motion.div>
                <div>
                  <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
                    {locale === 'ko'
                      ? `에포크 ${currentEpoch - 1} 정산 완료`
                      : `Epoch ${currentEpoch - 1} Settlement`}
                  </div>
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-mono text-lg text-emerald-400"
                  >
                    {formatReward(displayReward)}
                  </motion.div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-mono text-[9px] text-muted-foreground/60 uppercase">
                  {locale === 'ko' ? '누적 보상' : 'Cumulative'}
                </div>
                <div className="font-mono text-sm text-muted-foreground">
                  {cumulativeReward.toFixed(6)} ETH
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
