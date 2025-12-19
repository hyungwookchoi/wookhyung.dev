'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';

import { useLocale } from '@/i18n/context';

interface RandaoDisplayProps {
  seed: string;
  isUpdating: boolean;
}

export function RandaoDisplay({ seed, isUpdating }: RandaoDisplayProps) {
  const locale = useLocale();
  const [displaySeed, setDisplaySeed] = useState(seed);
  const [isScrambling, setIsScrambling] = useState(false);

  // 스크램블 애니메이션
  useEffect(() => {
    if (isUpdating) {
      setIsScrambling(true);
      let iteration = 0;
      const maxIterations = 10;
      const chars = '0123456789abcdef';

      const interval = setInterval(() => {
        if (iteration >= maxIterations) {
          setDisplaySeed(seed);
          setIsScrambling(false);
          clearInterval(interval);
          return;
        }

        // 점진적으로 실제 값으로 변환
        const scrambled =
          '0x' +
          seed
            .slice(2)
            .split('')
            .map((char, idx) => {
              if (idx < iteration * 6) {
                return char;
              }
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('');

        setDisplaySeed(scrambled);
        iteration++;
      }, 80);

      return () => clearInterval(interval);
    }
  }, [seed, isUpdating]);

  // 시드가 변경되면 업데이트
  useEffect(() => {
    if (!isUpdating) {
      setDisplaySeed(seed);
    }
  }, [seed, isUpdating]);

  // 시드를 보기 좋게 나누기 (0x + 16자씩 4줄)
  const formatSeed = (s: string) => {
    const hex = s.slice(2);
    return [
      hex.slice(0, 16),
      hex.slice(16, 32),
      hex.slice(32, 48),
      hex.slice(48, 64),
    ];
  };

  const seedParts = formatSeed(displaySeed);

  return (
    <div className="space-y-3">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-purple-400">⚡</span>
          <span className="font-mono text-[10px] tracking-[0.15em] text-neutral-500 uppercase">
            RANDAO Seed
          </span>
        </div>
        <AnimatePresence>
          {isScrambling && (
            <motion.span
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="font-mono text-[9px] text-purple-400 uppercase tracking-wider"
            >
              {locale === 'ko' ? '새 시드 생성 중...' : 'Generating...'}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* 시드 표시 */}
      <div className="p-3 bg-neutral-900/50 border border-neutral-800">
        <div className="font-mono text-[9px] text-neutral-600 mb-1">0x</div>
        <div className="space-y-0.5">
          {seedParts.map((part, idx) => (
            <motion.div
              key={idx}
              className={`font-mono text-[10px] tracking-wider ${
                isScrambling ? 'text-purple-400' : 'text-neutral-400'
              }`}
              animate={{
                opacity: isScrambling ? [0.5, 1, 0.5] : 1,
              }}
              transition={{
                duration: 0.3,
                repeat: isScrambling ? Infinity : 0,
                delay: idx * 0.05,
              }}
            >
              {part}
            </motion.div>
          ))}
        </div>
      </div>

      {/* 설명 */}
      <p className="font-mono text-[9px] text-neutral-600 leading-relaxed">
        {locale === 'ko'
          ? '각 에포크마다 검증인들의 입력으로 새로운 시드가 생성됩니다.'
          : 'A new seed is generated each epoch from validator inputs.'}
      </p>
    </div>
  );
}
