'use client';

import { useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { useLocale } from '@/i18n/context';

const translations = {
  ko: {
    title: '스테이킹 수익률 계산기',
    subtitle: 'APR(%) = 166 / √n 공식으로 수익률을 계산합니다',
    totalStaked: '전체 스테이킹량',
    yourStake: '당신의 스테이킹량',
    annualReward: '연간 예상 보상',
    monthlyReward: '월간 예상 보상',
    apr: '연간 수익률 (APR)',
    ethPrice: 'ETH 가격 (참고용)',
    million: 'M',
    networkSecurity: '네트워크 보안',
    validatorCount: '검증인 수 (추정)',
    formula: '수익률 공식',
    lowStake: '낮은 스테이킹',
    highStake: '높은 스테이킹',
    highYield: '높은 수익률',
    lowYield: '낮은 수익률',
    incentiveNote:
      '스테이킹량이 적을 때 높은 수익률로 참여를 유도하고, 많아지면 인플레이션을 억제합니다.',
  },
  en: {
    title: 'Staking Reward Calculator',
    subtitle: 'Calculate rewards using APR(%) = 166 / √n formula',
    totalStaked: 'Total Staked',
    yourStake: 'Your Stake',
    annualReward: 'Annual Reward Est.',
    monthlyReward: 'Monthly Reward Est.',
    apr: 'Annual Percentage Rate',
    ethPrice: 'ETH Price (Reference)',
    million: 'M',
    networkSecurity: 'Network Security',
    validatorCount: 'Validator Count (Est.)',
    formula: 'Yield Formula',
    lowStake: 'Low Stake',
    highStake: 'High Stake',
    highYield: 'High Yield',
    lowYield: 'Low Yield',
    incentiveNote:
      'High yields incentivize participation when staking is low, suppressing inflation when high.',
  },
};

export function RewardCalculator() {
  const locale = useLocale();
  const t = translations[locale];

  const [totalStakedM, setTotalStakedM] = useState(30); // in millions
  const [yourStake, setYourStake] = useState(32); // in ETH

  const calculations = useMemo(() => {
    const totalStaked = totalStakedM * 1_000_000;
    const apr = 166 / Math.sqrt(totalStakedM);
    const annualReward = yourStake * (apr / 100);
    const monthlyReward = annualReward / 12;
    const validatorCount = Math.floor(totalStaked / 32);

    return {
      apr: apr.toFixed(2),
      annualReward: annualReward.toFixed(4),
      monthlyReward: monthlyReward.toFixed(4),
      validatorCount: validatorCount.toLocaleString(),
    };
  }, [totalStakedM, yourStake]);

  // Generate curve points for visualization
  const curvePoints = useMemo(() => {
    const points: { x: number; y: number }[] = [];
    for (let n = 5; n <= 100; n += 5) {
      points.push({
        x: n,
        y: 166 / Math.sqrt(n),
      });
    }
    return points;
  }, []);

  const currentY = 166 / Math.sqrt(totalStakedM);

  // Add current position to curve data for reference dot
  const chartData = useMemo(() => {
    const data = curvePoints.map((p) => ({
      staked: p.x,
      apr: Number(p.y.toFixed(2)),
    }));

    // Add current position if not already in data
    if (!data.some((d) => d.staked === totalStakedM)) {
      data.push({
        staked: totalStakedM,
        apr: Number(currentY.toFixed(2)),
      });
      data.sort((a, b) => a.staked - b.staked);
    }

    return data;
  }, [curvePoints, totalStakedM, currentY]);

  return (
    <div className="not-prose my-8 relative">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-2 h-6 bg-emerald-400" />
        <div>
          <h3 className="text-sm font-mono uppercase tracking-wider text-foreground">
            {t.title}
          </h3>
          <p className="text-xs text-muted-foreground">{t.subtitle}</p>
        </div>
      </div>

      <div className="bg-card border border-border p-6 space-y-6">
        {/* Sliders */}
        <div className="grid sm:grid-cols-2 gap-6">
          {/* Total Staked */}
          <div className="space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                {t.totalStaked}
              </span>
              <span className="font-mono text-lg text-foreground">
                {totalStakedM}
                <span className="text-muted-foreground text-sm">
                  {t.million} ETH
                </span>
              </span>
            </div>
            <input
              type="range"
              min={5}
              max={100}
              step={1}
              value={totalStakedM}
              onChange={(e) => setTotalStakedM(Number(e.target.value))}
              className="w-full h-2 bg-border appearance-none cursor-pointer
                       [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4
                       [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-emerald-400
                       [&::-webkit-slider-thumb]:cursor-pointer"
            />
            <div className="flex justify-between text-[9px] font-mono text-muted-foreground/60">
              <span>5M</span>
              <span>100M</span>
            </div>
          </div>

          {/* Your Stake */}
          <div className="space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                {t.yourStake}
              </span>
              <span className="font-mono text-lg text-foreground">
                {yourStake}
                <span className="text-muted-foreground text-sm"> ETH</span>
              </span>
            </div>
            <input
              type="range"
              min={32}
              max={3200}
              step={32}
              value={yourStake}
              onChange={(e) => setYourStake(Number(e.target.value))}
              className="w-full h-2 bg-border appearance-none cursor-pointer
                       [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4
                       [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-cyan-400
                       [&::-webkit-slider-thumb]:cursor-pointer"
            />
            <div className="flex justify-between text-[9px] font-mono text-muted-foreground/60">
              <span>32 ETH (1 validator)</span>
              <span>3,200 ETH (100 validators)</span>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 bg-emerald-400/10 border border-emerald-400/30">
            <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider mb-1">
              {t.apr}
            </div>
            <div className="font-mono text-2xl text-emerald-400">
              {calculations.apr}%
            </div>
          </div>

          <div className="p-4 bg-muted/50 border border-border">
            <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider mb-1">
              {t.annualReward}
            </div>
            <div className="font-mono text-lg text-foreground">
              {calculations.annualReward}
              <span className="text-muted-foreground text-sm"> ETH</span>
            </div>
          </div>

          <div className="p-4 bg-muted/50 border border-border">
            <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider mb-1">
              {t.monthlyReward}
            </div>
            <div className="font-mono text-lg text-foreground">
              {calculations.monthlyReward}
              <span className="text-muted-foreground text-sm"> ETH</span>
            </div>
          </div>

          <div className="p-4 bg-muted/50 border border-border">
            <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider mb-1">
              {t.validatorCount}
            </div>
            <div className="font-mono text-lg text-foreground">
              {calculations.validatorCount}
            </div>
          </div>
        </div>

        {/* Curve Visualization */}
        <div className="space-y-3">
          <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
            {t.formula}: APR(%) = 166 / SQRT(N)
          </div>

          <div className="h-48 bg-muted/30 border border-border p-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="aprGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="staked"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 9,
                    fill: '#525252',
                    fontFamily: 'monospace',
                  }}
                  tickFormatter={(value) => `${value}M`}
                  interval="preserveStartEnd"
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 9,
                    fill: '#525252',
                    fontFamily: 'monospace',
                  }}
                  tickFormatter={(value) => `${value}%`}
                  width={35}
                  domain={[0, 'auto']}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#171717',
                    border: '1px solid #404040',
                    borderRadius: 0,
                    fontFamily: 'monospace',
                    fontSize: 10,
                  }}
                  labelFormatter={(value) => `${value}M ETH Staked`}
                  formatter={(value) => [`${Number(value).toFixed(2)}%`, 'APR']}
                />
                <Area
                  type="monotone"
                  dataKey="apr"
                  stroke="#34d399"
                  strokeWidth={2}
                  fill="url(#aprGradient)"
                />
                <ReferenceDot
                  x={totalStakedM}
                  y={Number(currentY.toFixed(2))}
                  r={6}
                  fill="#fbbf24"
                  stroke="#fbbf24"
                  strokeWidth={2}
                  strokeOpacity={0.4}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-between text-[9px] font-mono text-muted-foreground/60">
            <span>{t.lowStake}</span>
            <span className="px-2 py-0.5 bg-amber-400 text-background">
              {totalStakedM}M: {currentY.toFixed(1)}%
            </span>
            <span>{t.highStake}</span>
          </div>

          {/* Explanation */}
          <p className="text-[10px] font-mono text-muted-foreground leading-relaxed">
            {t.incentiveNote}
          </p>
        </div>
      </div>
    </div>
  );
}
