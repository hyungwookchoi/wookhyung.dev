import { useMemo } from 'react';

import { ATTACK_THRESHOLDS, ETH_PRICE_USD } from '../constants/ethereum';

interface StakingCalculations {
  apr: number;
  aprFormatted: string;
  haltAttackCost: number;
  haltAttackCostFormatted: string;
  manipulateAttackCost: number;
  manipulateAttackCostFormatted: string;
}

function formatUSD(value: number): string {
  if (value >= 1_000_000_000_000) {
    return `$${(value / 1_000_000_000_000).toFixed(1)}T`;
  }
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(1)}B`;
  }
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }
  return `$${value.toLocaleString()}`;
}

export function useStakingCalculations(
  stakedMillions: number,
): StakingCalculations {
  return useMemo(() => {
    const apr = 166 / Math.sqrt(stakedMillions);
    const totalStakedETH = stakedMillions * 1_000_000;

    const haltAttackCost =
      totalStakedETH * ATTACK_THRESHOLDS.halt * ETH_PRICE_USD;
    const manipulateAttackCost =
      totalStakedETH * ATTACK_THRESHOLDS.manipulate * ETH_PRICE_USD;

    return {
      apr,
      aprFormatted: `${apr.toFixed(2)}%`,
      haltAttackCost,
      haltAttackCostFormatted: formatUSD(haltAttackCost),
      manipulateAttackCost,
      manipulateAttackCostFormatted: formatUSD(manipulateAttackCost),
    };
  }, [stakedMillions]);
}
