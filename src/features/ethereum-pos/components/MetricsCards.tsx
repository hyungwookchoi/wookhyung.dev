'use client';

import { motion } from 'motion/react';

interface MetricsTranslations {
  apr: string;
  haltCost: string;
  manipulateCost: string;
}

interface MetricsCardsProps {
  apr: string;
  haltCost: string;
  manipulateCost: string;
  translations: MetricsTranslations;
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
      className="p-4 bg-muted/50 border border-border"
    >
      <div className="space-y-3">
        <span className="font-mono text-[10px] tracking-[0.15em] text-muted-foreground uppercase block">
          {label}
        </span>
        <motion.div
          key={value}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          className="font-mono text-2xl font-light text-foreground tabular-nums"
        >
          {value}
        </motion.div>
        <span className="font-mono text-[10px] text-muted-foreground/60 block">
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
  translations,
}: MetricsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-border">
      <MetricCard
        label="APR"
        value={apr}
        sublabel={translations.apr}
        delay={0}
      />
      <MetricCard
        label="33% Attack"
        value={haltCost}
        sublabel={translations.haltCost}
        delay={0.05}
      />
      <MetricCard
        label="67% Attack"
        value={manipulateCost}
        sublabel={translations.manipulateCost}
        delay={0.1}
      />
    </div>
  );
}
