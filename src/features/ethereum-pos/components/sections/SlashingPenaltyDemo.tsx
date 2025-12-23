'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import { useLocale } from '@/i18n/context';

const translations = {
  ko: {
    title: '페널티 & 슬래싱 시뮬레이터',
    subtitle: '검증인 위반 행위에 대한 제재를 시각화합니다',
    scenario: '시나리오 선택',
    scenarios: {
      inactivity: {
        name: '비활성 누출',
        desc: '검증인이 오프라인 상태가 되면 점진적으로 지분이 삭감됩니다',
      },
      slashing: {
        name: '슬래싱',
        desc: '이중 투표 등 악의적 행위 시 즉시 대량의 지분이 삭감됩니다',
      },
    },
    balance: '검증인 잔액',
    initial: '초기',
    penalty: '페널티',
    ejectionThreshold: '강제 퇴장 임계값',
    ejected: '강제 퇴장됨',
    day: '일',
    epoch: '에포크',
    correlation: '상관관계 페널티',
    correlationDesc: '동시에 슬래싱된 검증인이 많을수록 페널티가 증가합니다',
    slashedValidators: '동시 슬래싱 검증인 수',
    minPenalty: '최소 페널티',
    maxPenalty: '최대 페널티',
    exitQueue: '퇴장 큐',
    exitQueueDesc: '슬래싱된 검증인은 36일에 걸쳐 강제 퇴장됩니다',
    simulate: '시뮬레이션',
    reset: '초기화',
    simulating: '진행 중...',
    replay: '다시 보기',
  },
  en: {
    title: 'Penalty & Slashing Simulator',
    subtitle: 'Visualize sanctions for validator violations',
    scenario: 'Select Scenario',
    scenarios: {
      inactivity: {
        name: 'Inactivity Leak',
        desc: 'Stake is gradually reduced when validator goes offline',
      },
      slashing: {
        name: 'Slashing',
        desc: 'Large stake is immediately slashed for malicious behavior like double voting',
      },
    },
    balance: 'Validator Balance',
    initial: 'Initial',
    penalty: 'Penalty',
    ejectionThreshold: 'Ejection Threshold',
    ejected: 'Ejected',
    day: 'Day',
    epoch: 'Epoch',
    correlation: 'Correlation Penalty',
    correlationDesc:
      'Penalty increases with more validators slashed simultaneously',
    slashedValidators: 'Simultaneous Slashed Validators',
    minPenalty: 'Min Penalty',
    maxPenalty: 'Max Penalty',
    exitQueue: 'Exit Queue',
    exitQueueDesc: 'Slashed validators are forcibly exited over 36 days',
    simulate: 'Simulate',
    reset: 'Reset',
    simulating: 'Running...',
    replay: 'Replay',
  },
};

type ScenarioType = 'inactivity' | 'slashing';

export function SlashingPenaltyDemo() {
  const locale = useLocale();
  const t = translations[locale];

  const [scenario, setScenario] = useState<ScenarioType>('inactivity');
  const [balance, setBalance] = useState(32);
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentDay, setCurrentDay] = useState(0);
  const [slashedCount, setSlashedCount] = useState(1);
  const [isEjected, setIsEjected] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const hasAutoStarted = useRef(false);

  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const EJECTION_THRESHOLD = 16;
  const INITIAL_BALANCE = 32;

  // Calculate correlation penalty for slashing (1% to 100% based on network percentage)
  const getCorrelationPenalty = useCallback((count: number) => {
    // Simplified: assume total validators = 500,000
    const totalValidators = 500000;
    const percentage = (count / totalValidators) * 100;
    // Penalty is proportional to percentage (min 1%, max 100%)
    return Math.min(100, Math.max(1, percentage * 3));
  }, []);

  const simulateInactivity = useCallback(async () => {
    setIsSimulating(true);
    setIsComplete(false);
    setBalance(INITIAL_BALANCE);
    setCurrentDay(0);
    setIsEjected(false);

    let currentBalance = INITIAL_BALANCE;

    // Simulate 30 days of inactivity
    for (let day = 1; day <= 30; day++) {
      await new Promise((r) => setTimeout(r, 150));
      // Inactivity leak: ~0.5% per day (simplified)
      const penalty = currentBalance * 0.015;
      currentBalance -= penalty;
      setBalance(currentBalance);
      setCurrentDay(day);

      if (currentBalance <= EJECTION_THRESHOLD) {
        setIsEjected(true);
        break;
      }
    }

    setIsSimulating(false);
    setIsComplete(true);
  }, []);

  const simulateSlashing = useCallback(async () => {
    setIsSimulating(true);
    setIsComplete(false);
    setBalance(INITIAL_BALANCE);
    setCurrentDay(0);
    setIsEjected(false);

    await new Promise((r) => setTimeout(r, 300));

    // Initial slashing penalty (1/32 of stake = ~1 ETH)
    const initialPenalty = INITIAL_BALANCE / 32;
    let currentBalance = INITIAL_BALANCE - initialPenalty;
    setBalance(currentBalance);

    await new Promise((r) => setTimeout(r, 500));

    // Correlation penalty (applied at day 18)
    const correlationPenalty =
      (currentBalance * getCorrelationPenalty(slashedCount)) / 100;
    currentBalance -= correlationPenalty;
    setBalance(currentBalance);
    setCurrentDay(18);

    await new Promise((r) => setTimeout(r, 500));

    // Final exit at day 36
    setCurrentDay(36);
    setIsEjected(true);

    setIsSimulating(false);
    setIsComplete(true);
  }, [slashedCount, getCorrelationPenalty]);

  const handleSimulate = useCallback(() => {
    if (scenario === 'inactivity') {
      simulateInactivity();
    } else {
      simulateSlashing();
    }
  }, [scenario, simulateInactivity, simulateSlashing]);

  const handleReset = useCallback(() => {
    setBalance(INITIAL_BALANCE);
    setCurrentDay(0);
    setIsEjected(false);
    setIsSimulating(false);
    setIsComplete(false);
  }, []);

  // 뷰포트 진입 시 자동 시작 (inactivity 시나리오만)
  useEffect(() => {
    if (inView && !hasAutoStarted.current && scenario === 'inactivity') {
      hasAutoStarted.current = true;
      simulateInactivity();
    }
  }, [inView, scenario, simulateInactivity]);

  // 시나리오 변경 시 리셋
  useEffect(() => {
    handleReset();
  }, [scenario, handleReset]);

  const balancePercentage = (balance / INITIAL_BALANCE) * 100;
  const ejectionPercentage = (EJECTION_THRESHOLD / INITIAL_BALANCE) * 100;

  return (
    <div ref={ref} className="not-prose my-8 relative">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-2 h-6 bg-red-400" />
        <div>
          <h3 className="text-sm font-mono uppercase tracking-wider text-foreground">
            {t.title}
          </h3>
          <p className="text-xs text-muted-foreground">{t.subtitle}</p>
        </div>
      </div>

      <div className="bg-card border border-border p-6 space-y-6">
        {/* Scenario Selection */}
        <div className="space-y-3">
          <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
            {t.scenario}
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {(['inactivity', 'slashing'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setScenario(s)}
                disabled={isSimulating}
                className={`
                  p-4 text-left transition-colors
                  ${
                    scenario === s
                      ? s === 'inactivity'
                        ? 'bg-amber-400/10 border-2 border-amber-400/50'
                        : 'bg-red-400/10 border-2 border-red-400/50'
                      : 'bg-muted/50 border border-border hover:border-border'
                  }
                  disabled:opacity-50
                `}
              >
                <div
                  className={`text-sm font-mono ${
                    scenario === s
                      ? s === 'inactivity'
                        ? 'text-amber-400'
                        : 'text-red-400'
                      : 'text-muted-foreground'
                  }`}
                >
                  {t.scenarios[s].name}
                </div>
                <div className="text-[10px] text-muted-foreground mt-1">
                  {t.scenarios[s].desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Slashing-specific controls */}
        <AnimatePresence>
          {scenario === 'slashing' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 bg-red-400/5 border border-red-400/20 space-y-4">
                <div className="text-[10px] font-mono text-muted-foreground">
                  {t.correlationDesc}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-muted-foreground">
                      {t.slashedValidators}
                    </span>
                    <span className="text-red-400">
                      {slashedCount.toLocaleString()}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={100000}
                    step={1000}
                    value={slashedCount}
                    onChange={(e) => setSlashedCount(Number(e.target.value))}
                    disabled={isSimulating}
                    className="w-full h-2 bg-border appearance-none cursor-pointer
                             [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4
                             [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-red-400
                             [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-muted-foreground/60">
                    <span>1 ({t.minPenalty}: 1%)</span>
                    <span>100k+ ({t.maxPenalty}: 100%)</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Balance Visualization */}
        <div className="space-y-3">
          <div className="flex justify-between items-baseline">
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
              {t.balance}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-2xl text-foreground">
                {balance.toFixed(2)}
              </span>
              <span className="font-mono text-sm text-muted-foreground">
                ETH
              </span>
              {currentDay > 0 && (
                <span className="font-mono text-xs text-muted-foreground/60">
                  ({t.day} {currentDay})
                </span>
              )}
            </div>
          </div>

          {/* Balance Bar */}
          <div className="relative h-8 bg-muted border border-border">
            {/* Current balance */}
            <motion.div
              className={`absolute left-0 top-0 bottom-0 ${
                balance <= EJECTION_THRESHOLD
                  ? 'bg-red-400'
                  : scenario === 'inactivity'
                    ? 'bg-amber-400'
                    : 'bg-cyan-400'
              }`}
              animate={{ width: `${balancePercentage}%` }}
              transition={{ duration: 0.3 }}
            />

            {/* Ejection threshold marker */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-red-500"
              style={{ left: `${ejectionPercentage}%` }}
            />
            <div
              className="absolute -bottom-5 text-[8px] font-mono text-red-500"
              style={{
                left: `${ejectionPercentage}%`,
                transform: 'translateX(-50%)',
              }}
            >
              {t.ejectionThreshold} (16 ETH)
            </div>

            {/* Initial marker */}
            <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-muted-foreground/60" />
          </div>

          {/* Labels */}
          <div className="flex justify-between text-[9px] font-mono text-muted-foreground/60 pt-4">
            <span>0 ETH</span>
            <span>
              {INITIAL_BALANCE} ETH ({t.initial})
            </span>
          </div>
        </div>

        {/* Penalty Summary */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-muted/50 border border-border">
            <div className="text-[9px] font-mono text-muted-foreground uppercase">
              {t.initial}
            </div>
            <div className="font-mono text-lg text-muted-foreground">
              32 ETH
            </div>
          </div>
          <div className="p-3 bg-red-400/10 border border-red-400/30">
            <div className="text-[9px] font-mono text-muted-foreground uppercase">
              {t.penalty}
            </div>
            <div className="font-mono text-lg text-red-400">
              -{(INITIAL_BALANCE - balance).toFixed(2)} ETH
            </div>
          </div>
          <div
            className={`p-3 border ${
              isEjected
                ? 'bg-red-400/20 border-red-400/50'
                : 'bg-muted/50 border-border'
            }`}
          >
            <div className="text-[9px] font-mono text-muted-foreground uppercase">
              Status
            </div>
            <div
              className={`font-mono text-sm ${isEjected ? 'text-red-400' : 'text-muted-foreground'}`}
            >
              {isEjected ? t.ejected : 'Active'}
            </div>
          </div>
        </div>

        {/* Exit Queue Info (for slashing) */}
        <AnimatePresence>
          {scenario === 'slashing' && isEjected && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-400/10 border border-red-400/30"
            >
              <div className="text-[10px] font-mono text-muted-foreground mb-2">
                {t.exitQueue}
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1 h-2 bg-border relative">
                  <motion.div
                    className="h-full bg-red-400"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1 }}
                  />
                  {/* Day markers */}
                  {[0, 18, 36].map((day) => (
                    <div
                      key={day}
                      className="absolute top-3 text-[8px] font-mono text-muted-foreground/60"
                      style={{
                        left: `${(day / 36) * 100}%`,
                        transform: 'translateX(-50%)',
                      }}
                    >
                      Day {day}
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-[9px] font-mono text-muted-foreground mt-4">
                {t.exitQueueDesc}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls */}
        {/* inactivity: 완료 후 다시 보기 버튼만 표시 */}
        {scenario === 'inactivity' && isComplete && (
          <div className="flex items-center justify-center pt-2">
            <button
              onClick={simulateInactivity}
              className="px-4 py-2 font-mono text-[10px] uppercase tracking-wider transition-colors
                       bg-amber-500 hover:bg-amber-400 text-background"
            >
              {t.replay}
            </button>
          </div>
        )}
        {/* slashing: 시작 전 또는 완료 후 버튼 표시 */}
        {scenario === 'slashing' && !isSimulating && (
          <div className="flex items-center justify-center pt-2">
            <button
              onClick={simulateSlashing}
              className="px-4 py-2 font-mono text-[10px] uppercase tracking-wider transition-colors
                       bg-red-500 hover:bg-red-400 text-background"
            >
              {isComplete ? t.replay : t.simulate}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
