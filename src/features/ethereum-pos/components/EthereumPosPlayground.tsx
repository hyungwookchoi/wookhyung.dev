'use client';

import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

import { useLocale } from '@/i18n/context';

import { STAKING_RANGE } from '../constants/ethereum';
import { getTranslations } from '../constants/translations';
import { useEventLog } from '../hooks/useEventLog';
import { useRewardCalculation } from '../hooks/useRewardCalculation';
import { useSlotTimer } from '../hooks/useSlotTimer';
import { useStakingCalculations } from '../hooks/useStakingCalculations';
import { EventLogPanel } from './EventLogPanel';
import { MetricsCards } from './MetricsCards';
import { RandaoDisplay } from './RandaoDisplay';
import { RewardSettlement } from './RewardSettlement';
import { SimulationControls } from './SimulationControls';
import { SlotEpochGrid } from './SlotEpochGrid';
import { StakingSlider } from './StakingSlider';

export function EthereumPosPlayground() {
  const locale = useLocale();
  const t = getTranslations(locale);
  const [stakedAmount, setStakedAmount] = useState<number>(
    STAKING_RANGE.default,
  );
  const calculations = useStakingCalculations(stakedAmount);
  const slotTimer = useSlotTimer();
  const { logs, addLog, clearLogs } = useEventLog();
  const rewards = useRewardCalculation(stakedAmount);

  // 이전 슬롯/에포크 추적
  const prevSlotRef = useRef(slotTimer.currentSlot);
  const prevEpochRef = useRef(slotTimer.currentEpoch);

  // 슬롯 변경 시 이벤트 로그 추가
  useEffect(() => {
    if (slotTimer.currentSlot !== prevSlotRef.current) {
      // 새 슬롯이 제안될 때마다 로그 추가 (매 슬롯은 너무 많으므로 8번째마다)
      if (slotTimer.currentSlot % 8 === 0 || slotTimer.currentSlot === 31) {
        addLog('slot_proposed', {
          ko: `슬롯 ${slotTimer.currentSlot + 1}: 블록 제안됨`,
          en: `Slot ${slotTimer.currentSlot + 1}: Block Proposed`,
        });
      }
      prevSlotRef.current = slotTimer.currentSlot;
    }
  }, [slotTimer.currentSlot, addLog]);

  // 에포크 전환 이벤트 로그
  useEffect(() => {
    if (
      slotTimer.currentEpoch !== prevEpochRef.current &&
      slotTimer.currentEpoch > 0
    ) {
      // 체크포인트 생성
      if (slotTimer.transition.isCheckpointing) {
        addLog('epoch_checkpoint', {
          ko: `에포크 ${slotTimer.currentEpoch}: 체크포인트 생성`,
          en: `Epoch ${slotTimer.currentEpoch}: Checkpoint Created`,
        });
      }
      prevEpochRef.current = slotTimer.currentEpoch;
    }
  }, [slotTimer.currentEpoch, slotTimer.transition.isCheckpointing, addLog]);

  // Justified 이벤트
  useEffect(() => {
    if (slotTimer.transition.isJustifying && slotTimer.previousEpoch >= 0) {
      addLog('epoch_justified', {
        ko: `에포크 ${slotTimer.previousEpoch}: 정당화 완료`,
        en: `Epoch ${slotTimer.previousEpoch}: Justified`,
      });
    }
  }, [slotTimer.transition.isJustifying, slotTimer.previousEpoch, addLog]);

  // Finalized 이벤트
  useEffect(() => {
    if (slotTimer.transition.isFinalizing && slotTimer.previousEpoch >= 0) {
      addLog('epoch_finalized', {
        ko: `에포크 ${slotTimer.previousEpoch}: 최종 확정!`,
        en: `Epoch ${slotTimer.previousEpoch}: Finalized!`,
      });

      // RANDAO 업데이트 로그
      addLog('randao_updated', {
        ko: '새 에포크 시드 생성됨',
        en: 'New Epoch Seed Generated',
      });
    }
  }, [slotTimer.transition.isFinalizing, slotTimer.previousEpoch, addLog]);

  // 정산 완료 이벤트
  useEffect(() => {
    if (
      slotTimer.transition.isSettling &&
      slotTimer.currentEpoch > 0 &&
      !rewards.isSettling
    ) {
      rewards.settleReward().then((reward) => {
        addLog('reward_distributed', {
          ko: `보상 분배: +${reward.toFixed(6)} ETH`,
          en: `Rewards: +${reward.toFixed(6)} ETH`,
        });
      });
    }
  }, [
    slotTimer.transition.isSettling,
    slotTimer.currentEpoch,
    rewards,
    addLog,
  ]);

  // 리셋 시 보상도 리셋
  const handleReset = () => {
    slotTimer.reset();
    rewards.resetRewards();
    clearLogs();
  };

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
            {t.playground.subtitle}
          </p>
        </header>

        <StakingSlider value={stakedAmount} onChange={setStakedAmount} />

        <MetricsCards
          apr={calculations.aprFormatted}
          haltCost={calculations.haltAttackCostFormatted}
          manipulateCost={calculations.manipulateAttackCostFormatted}
          translations={t.metrics}
        />

        <div className="h-px bg-neutral-800" />

        {/* Main Grid + Event Log Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Slot/Epoch Grid - 2/3 width */}
          <div className="lg:col-span-2">
            <SlotEpochGrid
              currentSlot={slotTimer.currentSlot}
              currentEpoch={slotTimer.currentEpoch}
              previousEpoch={slotTimer.previousEpoch}
              progress={slotTimer.progress}
              isRunning={slotTimer.isRunning}
              speed={slotTimer.speed}
              slots={slotTimer.slots}
              epochStatus={slotTimer.epochStatus}
              transition={slotTimer.transition}
              onStart={slotTimer.start}
              onPause={slotTimer.pause}
              onReset={handleReset}
              onSetSpeed={slotTimer.setSpeed}
              onSkipSlots={slotTimer.skipSlots}
            />
          </div>

          {/* Event Log Panel - 1/3 width */}
          <div className="lg:col-span-1">
            <EventLogPanel logs={logs} onClear={clearLogs} />
          </div>
        </div>

        {/* RANDAO Display */}
        <div className="h-px bg-neutral-800" />
        <RandaoDisplay
          seed={slotTimer.randaoSeed}
          isUpdating={slotTimer.transition.isFinalizing}
        />

        {/* Reward Settlement */}
        <RewardSettlement
          isSettling={rewards.isSettling}
          epochReward={rewards.epochReward}
          cumulativeReward={rewards.cumulativeReward}
          currentEpoch={slotTimer.currentEpoch}
        />

        <div className="h-px bg-neutral-800" />

        <SimulationControls
          haltCost={calculations.haltAttackCostFormatted}
          stakedAmount={stakedAmount}
          translations={t.simulation}
        />

        {/* Footer */}
        <footer className="pt-4 border-t border-neutral-800/50">
          <p className="font-mono text-[10px] text-neutral-600 tracking-wide">
            ETH = $2,500 USD &nbsp;·&nbsp; APR = 166 / √n &nbsp;·&nbsp;{' '}
            {locale === 'ko' ? '누적 보상' : 'Rewards'}:{' '}
            {rewards.cumulativeRewardFormatted}
          </p>
        </footer>
      </div>
    </motion.div>
  );
}
