'use client';

import { AnimatePresence, motion } from 'motion/react';

import { SLOT_CONFIG } from '../constants/ethereum';

interface SlotEpochGridProps {
  currentSlot: number;
  currentEpoch: number;
  isFinalized: boolean;
  progress: number;
  isRunning: boolean;
  speed: number;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSetSpeed: (speed: number) => void;
  onSkipSlots: (count: number) => void;
}

const SPEED_OPTIONS = [1, 2, 4, 10];

export function SlotEpochGrid({
  currentSlot,
  currentEpoch,
  isFinalized,
  progress,
  isRunning,
  speed,
  onStart,
  onPause,
  onReset,
  onSetSpeed,
  onSkipSlots,
}: SlotEpochGridProps) {
  const slots = Array.from({ length: SLOT_CONFIG.slotsPerEpoch }, (_, i) => i);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-baseline justify-between">
        <div className="space-y-1">
          <span className="font-mono text-[10px] tracking-[0.15em] text-neutral-500 uppercase block">
            Slot & Epoch
          </span>
          <span className="font-mono text-[10px] text-neutral-600">
            32 slots = 1 epoch
          </span>
        </div>
        <div className="font-mono text-sm text-neutral-400 flex items-center gap-4">
          <span>
            E<span className="text-neutral-100 ml-1">{currentEpoch}</span>
          </span>
          <span className="text-neutral-700">·</span>
          <span>
            S<span className="text-neutral-100 ml-1">{currentSlot + 1}</span>
            <span className="text-neutral-600">/32</span>
          </span>
        </div>
      </div>

      {/* Grid */}
      <div className="relative">
        <div className="grid grid-cols-8 gap-1">
          {slots.map((slotIndex) => {
            const isFilled = slotIndex < currentSlot;
            const isCurrent = slotIndex === currentSlot;

            return (
              <div
                key={slotIndex}
                className={`
                  relative aspect-square border transition-colors duration-150
                  ${isFilled ? 'bg-emerald-400/20 border-emerald-400/30' : ''}
                  ${isCurrent ? 'border-emerald-400' : 'border-neutral-800'}
                  ${!isFilled && !isCurrent ? 'bg-neutral-900/30' : ''}
                `}
              >
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
          })}
        </div>

        {/* Finalized overlay */}
        <AnimatePresence>
          {isFinalized && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-[#0a0a0b]/80 backdrop-blur-sm"
            >
              <span className="font-mono text-sm text-emerald-400 tracking-[0.2em] uppercase">
                Finalized
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={isRunning ? onPause : onStart}
          className="font-mono text-[10px] tracking-[0.1em] uppercase px-3 py-2 border border-neutral-700 text-neutral-400 hover:text-neutral-100 hover:border-neutral-500 transition-colors"
        >
          {isRunning ? 'Pause' : 'Play'}
        </button>
        <button
          onClick={onReset}
          className="font-mono text-[10px] tracking-[0.1em] uppercase px-3 py-2 border border-neutral-700 text-neutral-400 hover:text-neutral-100 hover:border-neutral-500 transition-colors"
        >
          Reset
        </button>

        <div className="w-px h-4 bg-neutral-800 mx-2" />

        <div className="flex items-center border border-neutral-800">
          {SPEED_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => onSetSpeed(s)}
              className={`font-mono text-[10px] px-3 py-2 transition-colors ${
                speed === s
                  ? 'bg-neutral-800 text-neutral-100'
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              {s}×
            </button>
          ))}
        </div>

        <div className="w-px h-4 bg-neutral-800 mx-2" />

        <button
          onClick={() => onSkipSlots(1)}
          className="font-mono text-[10px] px-3 py-2 border border-neutral-700 text-neutral-400 hover:text-neutral-100 hover:border-neutral-500 transition-colors"
          title="+1 slot"
        >
          +1
        </button>
        <button
          onClick={() => onSkipSlots(8)}
          className="font-mono text-[10px] px-3 py-2 border border-neutral-700 text-neutral-400 hover:text-neutral-100 hover:border-neutral-500 transition-colors"
          title="+8 slots"
        >
          +8
        </button>
      </div>
    </div>
  );
}
