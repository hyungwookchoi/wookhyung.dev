'use client';

import { motion } from 'motion/react';
import { useState } from 'react';

import { STAKING_RANGE } from '../constants/ethereum';
import { useSlotTimer } from '../hooks/useSlotTimer';
import { useStakingCalculations } from '../hooks/useStakingCalculations';
import { MetricsCards } from './MetricsCards';
import { SimulationControls } from './SimulationControls';
import { SlotEpochGrid } from './SlotEpochGrid';
import { StakingSlider } from './StakingSlider';

export function EthereumPosPlayground() {
  const [stakedAmount, setStakedAmount] = useState<number>(
    STAKING_RANGE.default,
  );
  const calculations = useStakingCalculations(stakedAmount);
  const slotTimer = useSlotTimer();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="not-prose my-12 relative"
    >
      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative space-y-8 bg-[#0a0a0b] p-6 sm:p-8 border border-neutral-800">
        {/* Header */}
        <header className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-emerald-400" />
            <span className="font-mono text-[10px] tracking-[0.2em] text-neutral-500 uppercase">
              Interactive Simulator
            </span>
          </div>
          <h2 className="font-mono text-2xl sm:text-3xl font-light text-neutral-100 tracking-tight">
            Ethereum PoS
          </h2>
          <p className="font-mono text-xs text-neutral-500 max-w-md leading-relaxed">
            전체 예치량을 조절하여 네트워크 보안과 수익률의 변화를 확인하세요
          </p>
        </header>

        <StakingSlider value={stakedAmount} onChange={setStakedAmount} />

        <MetricsCards
          apr={calculations.aprFormatted}
          haltCost={calculations.haltAttackCostFormatted}
          manipulateCost={calculations.manipulateAttackCostFormatted}
        />

        <div className="h-px bg-neutral-800" />

        <SlotEpochGrid
          currentSlot={slotTimer.currentSlot}
          currentEpoch={slotTimer.currentEpoch}
          isFinalized={slotTimer.isFinalized}
          progress={slotTimer.progress}
          isRunning={slotTimer.isRunning}
          speed={slotTimer.speed}
          onStart={slotTimer.start}
          onPause={slotTimer.pause}
          onReset={slotTimer.reset}
          onSetSpeed={slotTimer.setSpeed}
          onSkipSlots={slotTimer.skipSlots}
        />

        <div className="h-px bg-neutral-800" />

        <SimulationControls
          haltCost={calculations.haltAttackCostFormatted}
          stakedAmount={stakedAmount}
        />

        {/* Footer */}
        <footer className="pt-4 border-t border-neutral-800/50">
          <p className="font-mono text-[10px] text-neutral-600 tracking-wide">
            ETH = $2,500 USD &nbsp;·&nbsp; APR = 166 / √n
          </p>
        </footer>
      </div>
    </motion.div>
  );
}
