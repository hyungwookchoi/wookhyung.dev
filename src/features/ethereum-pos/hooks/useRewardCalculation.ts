import { useCallback, useMemo, useState } from 'react';

interface RewardCalculation {
  epochReward: number;
  epochRewardFormatted: string;
  cumulativeReward: number;
  cumulativeRewardFormatted: string;
  isSettling: boolean;
  settleReward: () => Promise<number>;
  resetRewards: () => void;
}

export function useRewardCalculation(
  stakedMillions: number,
): RewardCalculation {
  const [cumulativeReward, setCumulativeReward] = useState(0);
  const [isSettling, setIsSettling] = useState(false);

  // APR 기반 에포크당 보상 계산
  // APR = 166 / sqrt(stakedMillions)
  // 에포크 = 6.4분 = 약 82,125 에포크/년
  // 연간 보상 = 32 ETH * APR / 100
  // 에포크당 보상 = 연간 보상 / 82,125
  const epochReward = useMemo(() => {
    const apr = 166 / Math.sqrt(stakedMillions);
    const yearlyReward = 32 * (apr / 100);
    const epochsPerYear = (365 * 24 * 60) / 6.4; // 약 82,125
    return yearlyReward / epochsPerYear;
  }, [stakedMillions]);

  const formatReward = useCallback((reward: number): string => {
    if (reward >= 1) {
      return `${reward.toFixed(4)} ETH`;
    }
    return `${reward.toFixed(6)} ETH`;
  }, []);

  const settleReward = useCallback(async (): Promise<number> => {
    setIsSettling(true);

    // 정산 애니메이션을 위한 딜레이
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setCumulativeReward((prev) => prev + epochReward);
    setIsSettling(false);

    return epochReward;
  }, [epochReward]);

  const resetRewards = useCallback(() => {
    setCumulativeReward(0);
    setIsSettling(false);
  }, []);

  return {
    epochReward,
    epochRewardFormatted: formatReward(epochReward),
    cumulativeReward,
    cumulativeRewardFormatted: formatReward(cumulativeReward),
    isSettling,
    settleReward,
    resetRewards,
  };
}
