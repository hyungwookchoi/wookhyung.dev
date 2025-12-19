'use client';

import { motion } from 'motion/react';

import type { SlotData } from '../types/slot';

interface SlotCellProps {
  slot: SlotData;
  isCurrent: boolean;
  progress: number;
  isEpochJustified: boolean;
  isEpochFinalized: boolean;
}

export function SlotCell({
  slot,
  isCurrent,
  progress,
  isEpochJustified,
  isEpochFinalized,
}: SlotCellProps) {
  const isPending = slot.status === 'pending';
  const isProposed = slot.status === 'proposed';

  // 상태에 따른 스타일 결정
  const getStatusStyles = () => {
    if (isEpochFinalized && isProposed) {
      return 'bg-emerald-400/30 border-emerald-400/50';
    }
    if (isEpochJustified && isProposed) {
      return 'bg-cyan-400/20 border-cyan-400/40';
    }
    if (isProposed) {
      return 'bg-emerald-400/20 border-emerald-400/30';
    }
    if (isCurrent) {
      return 'border-emerald-400';
    }
    return 'bg-neutral-900/30 border-neutral-800';
  };

  // 상태 텍스트
  const getStatusText = () => {
    if (isEpochFinalized && isProposed) return 'F';
    if (isEpochJustified && isProposed) return 'J';
    if (isProposed) return '✓';
    if (isCurrent) return '→';
    return '';
  };

  return (
    <div
      className={`
        relative aspect-square border transition-all duration-150
        ${getStatusStyles()}
        ${isEpochFinalized && isProposed ? 'animate-pulse' : ''}
      `}
    >
      {/* 슬롯 번호 */}
      <span className="absolute top-0.5 left-1 font-mono text-[8px] text-neutral-600">
        {slot.index + 1}
      </span>

      {/* 상태 표시 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className={`font-mono text-[10px] ${
            isEpochFinalized && isProposed
              ? 'text-emerald-300'
              : isEpochJustified && isProposed
                ? 'text-cyan-300'
                : isProposed
                  ? 'text-emerald-400/70'
                  : isPending
                    ? 'text-neutral-700'
                    : 'text-emerald-400'
          }`}
        >
          {getStatusText()}
        </span>
      </div>

      {/* 현재 슬롯 진행 바 */}
      {isCurrent && (
        <motion.div
          className="absolute inset-0 bg-emerald-400/20"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: progress }}
          style={{ transformOrigin: 'bottom' }}
          transition={{ duration: 0.1 }}
        />
      )}
    </div>
  );
}
