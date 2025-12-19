import { Locale } from '@/i18n/config';

export const translations = {
  ko: {
    playground: {
      subtitle:
        '전체 예치량을 조절하여 네트워크 보안과 수익률의 변화를 확인하세요',
    },
    metrics: {
      apr: '연간 수익률',
      haltCost: '네트워크 정지 비용',
      manipulateCost: '기록 조작 비용',
    },
    simulation: {
      description: '공격 시나리오와 페널티를 시뮬레이션합니다',
      attack: {
        title: '33% Attack Scenario',
        description:
          '공격자가 예치된 ETH의 33% 이상을 확보하면 최종화를 방해하여',
        highlight: '네트워크를 정지',
        suffix: '시킬 수 있습니다.',
        networkHalted: 'NETWORK HALTED',
      },
      offline: {
        title: 'Offline Penalty',
        description:
          '검증인이 오프라인 상태가 되면 얻을 수 있었던 보상과 거의 같은 비율로 페널티를 받습니다.',
        highlight: '비활성 누출 페널티',
        suffix: '가 적용됩니다.',
        validatorBalance: 'Validator Balance',
        ejectionWarning: '잔고가 16 ETH 미만이 되면 강제 퇴장됩니다',
      },
    },
    epochSimulator: {
      slotStatus: {
        pending: '대기중',
        proposed: '제안됨',
        justified: '정당화됨',
        finalized: '최종확정',
      },
      events: {
        slotProposed: '슬롯 {slot}: 블록 제안됨',
        epochCheckpoint: '에포크 {epoch}: 체크포인트 생성',
        epochJustified: '에포크 {epoch}: 정당화 완료',
        epochFinalized: '에포크 {epoch}: 최종 확정',
        rewardDistributed: '보상 분배: +{amount} ETH',
        randaoUpdated: '새 에포크 시드 생성됨',
      },
      settlement: {
        calculating: '검증인 수익 정산 중...',
        completed: '정산 완료',
        expectedReward: '예상 보상',
        cumulative: '누적 보상',
      },
      randao: {
        title: 'RANDAO 시드',
        newSeed: '새 에포크 시드 생성됨',
        description:
          '각 에포크마다 검증인들의 입력으로 새로운 시드가 생성됩니다.',
      },
    },
  },
  en: {
    playground: {
      subtitle:
        'Adjust total staked amount to observe changes in network security and yield',
    },
    metrics: {
      apr: 'Annual Yield',
      haltCost: 'Network Halt Cost',
      manipulateCost: 'Manipulation Cost',
    },
    simulation: {
      description: 'Simulate attack scenarios and penalties',
      attack: {
        title: '33% Attack Scenario',
        description:
          'If an attacker acquires more than 33% of staked ETH, they can prevent finalization and',
        highlight: 'halt the network',
        suffix: '.',
        networkHalted: 'NETWORK HALTED',
      },
      offline: {
        title: 'Offline Penalty',
        description:
          'When a validator goes offline, they receive penalties at roughly the same rate as the rewards they would have earned.',
        highlight: 'Inactivity leak penalty',
        suffix: ' is applied.',
        validatorBalance: 'Validator Balance',
        ejectionWarning:
          'Forced ejection occurs when balance falls below 16 ETH',
      },
    },
    epochSimulator: {
      slotStatus: {
        pending: 'Pending',
        proposed: 'Proposed',
        justified: 'Justified',
        finalized: 'Finalized',
      },
      events: {
        slotProposed: 'Slot {slot}: Block Proposed',
        epochCheckpoint: 'Epoch {epoch}: Checkpoint Created',
        epochJustified: 'Epoch {epoch}: Justified',
        epochFinalized: 'Epoch {epoch}: Finalized',
        rewardDistributed: 'Rewards: +{amount} ETH',
        randaoUpdated: 'New Epoch Seed Generated',
      },
      settlement: {
        calculating: 'Calculating validator rewards...',
        completed: 'Settlement Complete',
        expectedReward: 'Expected Reward',
        cumulative: 'Cumulative',
      },
      randao: {
        title: 'RANDAO Seed',
        newSeed: 'New Epoch Seed Generated',
        description:
          'A new seed is generated each epoch from validator inputs.',
      },
    },
  },
} as const;

export type Translations = typeof translations;

export function getTranslations(locale: Locale) {
  return translations[locale];
}
