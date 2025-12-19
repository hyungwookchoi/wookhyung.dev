'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';

type SimulationMode = 'none' | 'attack' | 'offline';

interface SimulationControlsProps {
  haltCost: string;
  stakedAmount: number;
}

export function SimulationControls({
  haltCost,
  stakedAmount,
}: SimulationControlsProps) {
  const [activeSimulation, setActiveSimulation] =
    useState<SimulationMode>('none');

  const requiredETH = Math.floor(stakedAmount * 0.33 * 1_000_000);

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <span className="font-mono text-[10px] tracking-[0.15em] text-neutral-500 uppercase block">
          Simulation
        </span>
        <span className="font-mono text-[10px] text-neutral-600">
          공격 시나리오와 페널티를 시뮬레이션합니다
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() =>
            setActiveSimulation(
              activeSimulation === 'attack' ? 'none' : 'attack',
            )
          }
          className={`font-mono text-[10px] tracking-[0.1em] uppercase px-4 py-2.5 border transition-colors ${
            activeSimulation === 'attack'
              ? 'border-red-500/50 text-red-400 bg-red-500/5'
              : 'border-neutral-700 text-neutral-400 hover:text-neutral-100 hover:border-neutral-500'
          }`}
        >
          Attack
        </button>
        <button
          onClick={() =>
            setActiveSimulation(
              activeSimulation === 'offline' ? 'none' : 'offline',
            )
          }
          className={`font-mono text-[10px] tracking-[0.1em] uppercase px-4 py-2.5 border transition-colors ${
            activeSimulation === 'offline'
              ? 'border-amber-500/50 text-amber-400 bg-amber-500/5'
              : 'border-neutral-700 text-neutral-400 hover:text-neutral-100 hover:border-neutral-500'
          }`}
        >
          Offline
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeSimulation === 'attack' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 border border-red-500/20 bg-red-500/5 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-red-500 animate-pulse" />
                <span className="font-mono text-xs text-red-400">
                  33% Attack Scenario
                </span>
              </div>

              <p className="font-mono text-[11px] text-neutral-400 leading-relaxed">
                공격자가 예치된 ETH의 33% 이상을 확보하면 최종화를 방해하여{' '}
                <span className="text-red-400">네트워크를 정지</span>시킬 수
                있습니다.
              </p>

              <div className="grid grid-cols-2 gap-px bg-neutral-800">
                <div className="p-3 bg-[#0a0a0b]">
                  <span className="font-mono text-[9px] text-neutral-600 uppercase tracking-wider block mb-1">
                    Required
                  </span>
                  <span className="font-mono text-sm text-neutral-100">
                    {requiredETH.toLocaleString()} ETH
                  </span>
                </div>
                <div className="p-3 bg-[#0a0a0b]">
                  <span className="font-mono text-[9px] text-neutral-600 uppercase tracking-wider block mb-1">
                    Cost
                  </span>
                  <span className="font-mono text-sm text-red-400">
                    {haltCost}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 2, ease: 'easeOut' }}
                  className="h-px bg-red-500 origin-left"
                />
                <p className="font-mono text-[9px] text-neutral-600 text-center tracking-wider">
                  NETWORK HALTED
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {activeSimulation === 'offline' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 border border-amber-500/20 bg-amber-500/5 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-amber-500 animate-pulse" />
                <span className="font-mono text-xs text-amber-400">
                  Offline Penalty
                </span>
              </div>

              <p className="font-mono text-[11px] text-neutral-400 leading-relaxed">
                검증인이 오프라인 상태가 되면 얻을 수 있었던 보상과 거의 같은
                비율로 페널티를 받습니다.{' '}
                <span className="text-amber-400">비활성 누출 페널티</span>가
                적용됩니다.
              </p>

              <div className="space-y-2">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-neutral-500">Validator Balance</span>
                  <motion.span
                    initial={{ opacity: 1 }}
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-amber-400 tabular-nums"
                  >
                    32.00 → 31.97 ETH
                  </motion.span>
                </div>
                <div className="h-1 bg-neutral-800">
                  <motion.div
                    initial={{ width: '100%' }}
                    animate={{ width: '94%' }}
                    transition={{ duration: 3, ease: 'linear' }}
                    className="h-full bg-amber-500/50"
                  />
                </div>
              </div>

              <p className="font-mono text-[9px] text-neutral-600 leading-relaxed">
                잔고가 16 ETH 미만이 되면 강제 퇴장됩니다
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
