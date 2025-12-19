'use client';

import type {
  EpochStatus,
  EpochTransitionState,
  SlotData,
} from '../types/slot';
import { FinalizationOverlay } from './FinalizationOverlay';
import { SlotCell } from './SlotCell';

interface SlotEpochGridProps {
  currentSlot: number;
  currentEpoch: number;
  previousEpoch: number;
  progress: number;
  isRunning: boolean;
  speed: number;
  slots: SlotData[];
  epochStatus: EpochStatus;
  transition: EpochTransitionState;
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
  previousEpoch,
  progress,
  isRunning,
  speed,
  slots,
  epochStatus,
  transition,
  onStart,
  onPause,
  onReset,
  onSetSpeed,
  onSkipSlots,
}: SlotEpochGridProps) {
  const isEpochJustified = epochStatus === 'justified';
  const isEpochFinalized = epochStatus === 'finalized';

  // 에포크 상태 뱃지
  const getEpochBadge = () => {
    if (isEpochFinalized) {
      return (
        <span className="px-2 py-0.5 bg-emerald-400/20 border border-emerald-400/30 text-emerald-400 text-[9px] font-mono uppercase">
          Finalized
        </span>
      );
    }
    if (isEpochJustified) {
      return (
        <span className="px-2 py-0.5 bg-cyan-400/20 border border-cyan-400/30 text-cyan-400 text-[9px] font-mono uppercase">
          Justified
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 bg-neutral-800 border border-neutral-700 text-neutral-500 text-[9px] font-mono uppercase">
        Active
      </span>
    );
  };

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
          <div className="flex items-center gap-2">
            <span>
              E<span className="text-neutral-100 ml-1">{currentEpoch}</span>
            </span>
            {getEpochBadge()}
          </div>
          <span className="text-neutral-700">·</span>
          <span>
            S<span className="text-neutral-100 ml-1">{currentSlot + 1}</span>
            <span className="text-neutral-600">/32</span>
          </span>
        </div>
      </div>

      {/* Grid */}
      <div className="relative">
        <div
          className={`
            grid grid-cols-8 gap-1 transition-all duration-300
            ${transition.isCheckpointing ? 'ring-2 ring-amber-400/50' : ''}
            ${transition.isFinalizing ? 'ring-2 ring-emerald-400/50' : ''}
          `}
        >
          {slots.map((slot) => (
            <SlotCell
              key={slot.index}
              slot={slot}
              isCurrent={slot.index === currentSlot}
              progress={slot.index === currentSlot ? progress : 0}
              isEpochJustified={isEpochJustified}
              isEpochFinalized={isEpochFinalized}
            />
          ))}
        </div>

        {/* Finalization Overlay */}
        <FinalizationOverlay
          transition={transition}
          currentEpoch={currentEpoch}
          previousEpoch={previousEpoch}
        />
      </div>

      {/* Slot Legend */}
      <div className="flex items-center gap-4 text-[9px] font-mono text-neutral-600">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-neutral-900/30 border border-neutral-800" />
          <span>Pending</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-emerald-400/20 border border-emerald-400/30" />
          <span>Proposed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-cyan-400/20 border border-cyan-400/40" />
          <span>Justified</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-emerald-400/30 border border-emerald-400/50" />
          <span>Finalized</span>
        </div>
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
        <button
          onClick={() => onSkipSlots(32)}
          className="font-mono text-[10px] px-3 py-2 border border-amber-700/50 text-amber-500 hover:text-amber-400 hover:border-amber-600 transition-colors"
          title="Skip to next epoch"
        >
          +Epoch
        </button>
      </div>
    </div>
  );
}
