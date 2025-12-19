import { useCallback, useState } from 'react';

import type { EventLog, EventType } from '../types/slot';

interface UseEventLogReturn {
  logs: EventLog[];
  addLog: (
    type: EventType,
    message: { ko: string; en: string },
    data?: EventLog['data'],
  ) => void;
  clearLogs: () => void;
}

export function useEventLog(maxEntries: number = 50): UseEventLogReturn {
  const [logs, setLogs] = useState<EventLog[]>([]);

  const addLog = useCallback(
    (
      type: EventType,
      message: { ko: string; en: string },
      data?: EventLog['data'],
    ) => {
      const newLog: EventLog = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        type,
        message,
        data,
      };

      setLogs((prev) => [newLog, ...prev].slice(0, maxEntries));
    },
    [maxEntries],
  );

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  return { logs, addLog, clearLogs };
}
