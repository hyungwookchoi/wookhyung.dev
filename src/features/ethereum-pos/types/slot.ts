export type SlotStatus = 'pending' | 'proposed' | 'justified' | 'finalized';

export type EpochStatus = 'active' | 'justified' | 'finalized';

export interface SlotData {
  index: number;
  status: SlotStatus;
  timestamp?: number;
}

export interface EpochData {
  number: number;
  status: EpochStatus;
  checkpoint: boolean;
  randaoSeed: string;
  slots: SlotData[];
}

export type EventType =
  | 'slot_proposed'
  | 'epoch_checkpoint'
  | 'epoch_justified'
  | 'epoch_finalized'
  | 'reward_distributed'
  | 'randao_updated';

export interface EventLog {
  id: string;
  timestamp: number;
  type: EventType;
  message: {
    ko: string;
    en: string;
  };
  data?: {
    slot?: number;
    epoch?: number;
    reward?: number;
    randaoSeed?: string;
  };
}

export interface EpochTransitionState {
  isCheckpointing: boolean;
  isJustifying: boolean;
  isFinalizing: boolean;
  isSettling: boolean;
}
