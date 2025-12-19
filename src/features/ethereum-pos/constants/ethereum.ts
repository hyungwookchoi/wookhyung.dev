export const ETHEREUM_COLORS = {
  primary: {
    purple: '#8B5CF6',
    blue: '#3B82F6',
    indigo: '#6366F1',
  },
  dark: {
    bg: '#0F0D1A',
    card: '#1A1625',
    border: 'rgba(139, 92, 246, 0.3)',
  },
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
} as const;

export const ETH_PRICE_USD = 2500;

export const STAKING_RANGE = {
  min: 1,
  max: 100,
  default: 32,
} as const;

export const SLOT_CONFIG = {
  durationMs: 12000,
  slotsPerEpoch: 32,
} as const;

export const ATTACK_THRESHOLDS = {
  halt: 0.33,
  manipulate: 0.67,
} as const;
