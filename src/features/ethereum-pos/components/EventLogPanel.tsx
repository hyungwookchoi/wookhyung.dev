'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef } from 'react';

import type { EventLog } from '../types/slot';

interface EventLogPanelProps {
  logs: EventLog[];
  onClear: () => void;
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function getEventColor(type: EventLog['type']): string {
  switch (type) {
    case 'slot_proposed':
      return 'text-muted-foreground';
    case 'epoch_checkpoint':
      return 'text-amber-400';
    case 'epoch_justified':
      return 'text-cyan-400';
    case 'epoch_finalized':
      return 'text-emerald-400';
    case 'reward_distributed':
      return 'text-emerald-300';
    case 'randao_updated':
      return 'text-purple-400';
    default:
      return 'text-muted-foreground';
  }
}

function getEventIcon(type: EventLog['type']): string {
  switch (type) {
    case 'slot_proposed':
      return '□';
    case 'epoch_checkpoint':
      return '◈';
    case 'epoch_justified':
      return '◇';
    case 'epoch_finalized':
      return '◆';
    case 'reward_distributed':
      return '◎';
    case 'randao_updated':
      return '⚡';
    default:
      return '·';
  }
}

export function EventLogPanel({ logs, onClear }: EventLogPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // 새 로그가 추가될 때 스크롤
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [logs.length]);

  return (
    <div className="flex flex-col h-full border border-border bg-muted/50">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="text-primary font-mono text-xs">{'>'}</span>
          <span className="font-mono text-[10px] tracking-[0.15em] text-muted-foreground uppercase">
            Event Log
          </span>
        </div>
        <button
          onClick={onClear}
          className="font-mono text-[9px] text-muted-foreground/60 hover:text-muted-foreground transition-colors uppercase tracking-wider"
        >
          Clear
        </button>
      </div>

      {/* 로그 목록 */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto min-h-[200px] max-h-[300px]"
      >
        {logs.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <span className="font-mono text-[10px] text-muted-foreground/40">
              이벤트 대기 중...
            </span>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {logs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-start gap-2 px-3 py-1.5 border-b border-border/50 hover:bg-muted/30"
              >
                <span className="font-mono text-[9px] text-muted-foreground/60 shrink-0">
                  {formatTime(log.timestamp)}
                </span>
                <span
                  className={`font-mono text-[10px] ${getEventColor(log.type)}`}
                >
                  {getEventIcon(log.type)}
                </span>
                <span
                  className={`font-mono text-[10px] ${getEventColor(log.type)}`}
                >
                  {log.message}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* 푸터 */}
      <div className="px-3 py-1.5 border-t border-border bg-muted/80">
        <span className="font-mono text-[9px] text-muted-foreground/60">
          {logs.length} 개 이벤트
        </span>
      </div>
    </div>
  );
}
