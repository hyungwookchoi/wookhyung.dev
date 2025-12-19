'use client';

import { motion } from 'motion/react';

interface MetricsCardsProps {
  apr: string;
  haltCost: string;
  manipulateCost: string;
}

interface MetricCardProps {
  label: string;
  value: string;
  sublabel: string;
  delay?: number;
}

function MetricCard({ label, value, sublabel, delay = 0 }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay }}
      className="p-4 bg-neutral-900/50 border border-neutral-800"
    >
      <div className="space-y-3">
        <span className="font-mono text-[10px] tracking-[0.15em] text-neutral-500 uppercase block">
          {label}
        </span>
        <motion.div
          key={value}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          className="font-mono text-2xl font-light text-neutral-100 tabular-nums"
        >
          {value}
        </motion.div>
        <span className="font-mono text-[10px] text-neutral-600 block">
          {sublabel}
        </span>
      </div>
    </motion.div>
  );
}

export function MetricsCards({
  apr,
  haltCost,
  manipulateCost,
}: MetricsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-neutral-800">
      <MetricCard label="APR" value={apr} sublabel="연간 수익률" delay={0} />
      <MetricCard
        label="33% Attack"
        value={haltCost}
        sublabel="네트워크 정지 비용"
        delay={0.05}
      />
      <MetricCard
        label="67% Attack"
        value={manipulateCost}
        sublabel="기록 조작 비용"
        delay={0.1}
      />
    </div>
  );
}
