import { useCallback, useEffect, useRef, useState } from 'react';

import { SLOT_CONFIG } from '../constants/ethereum';
import type {
  EpochStatus,
  EpochTransitionState,
  SlotData,
  SlotStatus,
} from '../types/slot';

interface SlotTimerState {
  currentSlot: number;
  currentEpoch: number;
  previousEpoch: number;
  progress: number;
  isRunning: boolean;
  speed: number;
  slots: SlotData[];
  epochStatus: EpochStatus;
  previousEpochStatus: EpochStatus;
  randaoSeed: string;
  transition: EpochTransitionState;
}

interface SlotTimerControls {
  start: () => void;
  pause: () => void;
  reset: () => void;
  setSpeed: (speed: number) => void;
  skipSlots: (count: number) => void;
}

function generateRandaoSeed(): string {
  return (
    '0x' +
    Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16),
    ).join('')
  );
}

function createInitialSlots(): SlotData[] {
  return Array.from({ length: SLOT_CONFIG.slotsPerEpoch }, (_, i) => ({
    index: i,
    status: 'pending' as SlotStatus,
  }));
}

export function useSlotTimer(): SlotTimerState & SlotTimerControls {
  const [state, setState] = useState<SlotTimerState>({
    currentSlot: 0,
    currentEpoch: 0,
    previousEpoch: -1,
    progress: 0,
    isRunning: true,
    speed: 1,
    slots: createInitialSlots(),
    epochStatus: 'active',
    previousEpochStatus: 'active',
    randaoSeed: generateRandaoSeed(),
    transition: {
      isCheckpointing: false,
      isJustifying: false,
      isFinalizing: false,
      isSettling: false,
    },
  });

  const pausedAtRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const speedRef = useRef<number>(1);
  const virtualTimeRef = useRef<number>(0);
  const lastUpdateRef = useRef<number>(performance.now());
  const lastEpochRef = useRef<number>(-1);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const triggerEpochTransition = useCallback((newEpoch: number) => {
    // 이전 타임아웃 클리어
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }

    // 1. Checkpoint 생성 (0ms)
    setState((prev) => ({
      ...prev,
      transition: {
        ...prev.transition,
        isCheckpointing: true,
      },
    }));

    // 2. Justified (500ms 후)
    transitionTimeoutRef.current = setTimeout(() => {
      setState((prev) => ({
        ...prev,
        transition: {
          ...prev.transition,
          isCheckpointing: false,
          isJustifying: true,
        },
        previousEpochStatus: 'finalized',
        epochStatus: 'justified',
      }));

      // 3. Finalized (1000ms 후)
      transitionTimeoutRef.current = setTimeout(() => {
        setState((prev) => ({
          ...prev,
          transition: {
            ...prev.transition,
            isJustifying: false,
            isFinalizing: true,
          },
          randaoSeed: generateRandaoSeed(),
        }));

        // 4. 정산 시작 (1500ms 후)
        transitionTimeoutRef.current = setTimeout(() => {
          setState((prev) => ({
            ...prev,
            transition: {
              ...prev.transition,
              isFinalizing: false,
              isSettling: true,
            },
          }));

          // 5. 정산 완료 (3000ms 후) - epochStatus를 active로 리셋
          transitionTimeoutRef.current = setTimeout(() => {
            setState((prev) => ({
              ...prev,
              epochStatus: 'active',
              transition: {
                isCheckpointing: false,
                isJustifying: false,
                isFinalizing: false,
                isSettling: false,
              },
            }));
          }, 1500);
        }, 500);
      }, 500);
    }, 500);
  }, []);

  const updateTimer = useCallback(() => {
    if (pausedAtRef.current !== null) return;

    const now = performance.now();
    const deltaTime = now - lastUpdateRef.current;
    lastUpdateRef.current = now;

    virtualTimeRef.current += deltaTime * speedRef.current;

    const elapsed = virtualTimeRef.current;
    const totalSlots = Math.floor(elapsed / SLOT_CONFIG.durationMs);
    const currentSlot = totalSlots % SLOT_CONFIG.slotsPerEpoch;
    const currentEpoch = Math.floor(totalSlots / SLOT_CONFIG.slotsPerEpoch);
    const slotProgress =
      (elapsed % SLOT_CONFIG.durationMs) / SLOT_CONFIG.durationMs;

    // 에포크 전환 감지
    const epochChanged = currentEpoch > lastEpochRef.current;
    if (epochChanged && lastEpochRef.current >= 0) {
      triggerEpochTransition(currentEpoch);
    }
    lastEpochRef.current = currentEpoch;

    // 슬롯 상태 업데이트
    const newSlots = Array.from(
      { length: SLOT_CONFIG.slotsPerEpoch },
      (_, i) => ({
        index: i,
        status: (i < currentSlot
          ? 'proposed'
          : i === currentSlot
            ? 'proposed'
            : 'pending') as SlotStatus,
        timestamp: i <= currentSlot ? Date.now() : undefined,
      }),
    );

    setState((prev) => ({
      ...prev,
      currentSlot,
      currentEpoch,
      previousEpoch: currentEpoch > 0 ? currentEpoch - 1 : -1,
      progress: slotProgress,
      slots: newSlots,
    }));

    animationFrameRef.current = requestAnimationFrame(updateTimer);
  }, [triggerEpochTransition]);

  const start = useCallback(() => {
    if (pausedAtRef.current !== null) {
      lastUpdateRef.current = performance.now();
      pausedAtRef.current = null;
    }
    setState((prev) => ({ ...prev, isRunning: true }));
    animationFrameRef.current = requestAnimationFrame(updateTimer);
  }, [updateTimer]);

  const pause = useCallback(() => {
    pausedAtRef.current = performance.now();
    setState((prev) => ({ ...prev, isRunning: false }));
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, []);

  const reset = useCallback(() => {
    virtualTimeRef.current = 0;
    lastUpdateRef.current = performance.now();
    pausedAtRef.current = null;
    lastEpochRef.current = -1;

    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }

    setState((prev) => ({
      currentSlot: 0,
      currentEpoch: 0,
      previousEpoch: -1,
      progress: 0,
      isRunning: true,
      speed: prev.speed,
      slots: createInitialSlots(),
      epochStatus: 'active',
      previousEpochStatus: 'active',
      randaoSeed: generateRandaoSeed(),
      transition: {
        isCheckpointing: false,
        isJustifying: false,
        isFinalizing: false,
        isSettling: false,
      },
    }));
  }, []);

  const setSpeed = useCallback((speed: number) => {
    speedRef.current = speed;
    setState((prev) => ({ ...prev, speed }));
  }, []);

  const skipSlots = useCallback((count: number) => {
    virtualTimeRef.current += count * SLOT_CONFIG.durationMs;
  }, []);

  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(updateTimer);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, [updateTimer]);

  return { ...state, start, pause, reset, setSpeed, skipSlots };
}
