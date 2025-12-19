import { useCallback, useEffect, useRef, useState } from 'react';

import { SLOT_CONFIG } from '../constants/ethereum';

interface SlotTimerState {
  currentSlot: number;
  currentEpoch: number;
  isFinalized: boolean;
  progress: number;
  isRunning: boolean;
  speed: number;
}

interface SlotTimerControls {
  start: () => void;
  pause: () => void;
  reset: () => void;
  setSpeed: (speed: number) => void;
  skipSlots: (count: number) => void;
}

export function useSlotTimer(): SlotTimerState & SlotTimerControls {
  const [state, setState] = useState<SlotTimerState>({
    currentSlot: 0,
    currentEpoch: 0,
    isFinalized: false,
    progress: 0,
    isRunning: true,
    speed: 1,
  });

  const startTimeRef = useRef<number>(performance.now());
  const pausedAtRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number>();
  const speedRef = useRef<number>(1);
  const virtualTimeRef = useRef<number>(0);
  const lastUpdateRef = useRef<number>(performance.now());

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

    const wasFinalized =
      currentSlot === 0 && totalSlots > 0 && slotProgress < 0.1;

    setState((prev) => ({
      ...prev,
      currentSlot,
      currentEpoch,
      isFinalized: wasFinalized,
      progress: slotProgress,
    }));

    animationFrameRef.current = requestAnimationFrame(updateTimer);
  }, []);

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
    setState((prev) => ({
      currentSlot: 0,
      currentEpoch: 0,
      isFinalized: false,
      progress: 0,
      isRunning: true,
      speed: prev.speed,
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
    };
  }, [updateTimer]);

  return { ...state, start, pause, reset, setSpeed, skipSlots };
}
