'use client';

import { motion } from 'motion/react';

import { STAKING_RANGE } from '../constants/ethereum';

interface StakingSliderProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function StakingSlider({
  value,
  onChange,
  disabled = false,
}: StakingSliderProps) {
  const percentage =
    ((value - STAKING_RANGE.min) / (STAKING_RANGE.max - STAKING_RANGE.min)) *
    100;

  return (
    <div className="space-y-4">
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-[10px] tracking-[0.15em] text-neutral-500 uppercase">
          Total Staked
        </span>
        <div className="flex items-baseline gap-1">
          <motion.span
            key={value}
            initial={{ opacity: 0.5, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-mono text-3xl font-light text-neutral-100 tabular-nums"
          >
            {value}
          </motion.span>
          <span className="font-mono text-sm text-neutral-500">M ETH</span>
        </div>
      </div>

      <div className="relative h-8 flex items-center">
        {/* Track background */}
        <div className="absolute inset-x-0 h-[2px] bg-neutral-800" />

        {/* Active track */}
        <motion.div
          className="absolute h-[2px] bg-emerald-400"
          style={{ width: `${percentage}%` }}
          transition={{ duration: 0.1 }}
        />

        {/* Tick marks */}
        <div className="absolute inset-x-0 flex justify-between px-0">
          {[0, 25, 50, 75, 100].map((tick) => (
            <div
              key={tick}
              className={`w-px h-2 ${
                percentage >= tick ? 'bg-emerald-400/50' : 'bg-neutral-700'
              }`}
            />
          ))}
        </div>

        <input
          type="range"
          min={STAKING_RANGE.min}
          max={STAKING_RANGE.max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
          className="relative w-full h-8 bg-transparent appearance-none cursor-pointer disabled:cursor-not-allowed
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:bg-emerald-400
            [&::-webkit-slider-thumb]:border-0
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:transition-transform
            [&::-webkit-slider-thumb]:hover:scale-125
            [&::-moz-range-thumb]:w-4
            [&::-moz-range-thumb]:h-4
            [&::-moz-range-thumb]:bg-emerald-400
            [&::-moz-range-thumb]:border-0
            [&::-moz-range-thumb]:cursor-pointer"
        />
      </div>

      <div className="flex justify-between font-mono text-[10px] text-neutral-600">
        <span>{STAKING_RANGE.min}M</span>
        <span>{STAKING_RANGE.max}M</span>
      </div>
    </div>
  );
}
