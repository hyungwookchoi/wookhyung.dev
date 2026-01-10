import { motion } from 'motion/react';

import type { ScriptStatus } from '../types';

interface ScriptTagProps {
  status: ScriptStatus;
  label: string;
  scriptDetails: {
    notYetInDOM: string;
    cannotExecute: string;
    executedSuccessfully: string;
    duplicateDetected: string;
  };
  index?: number;
}

const STATUS_CONFIG: Record<
  ScriptStatus,
  {
    bg: string;
    border: string;
    iconBg: string;
    icon: string;
    pulseColor: string;
  }
> = {
  'not-exist': {
    bg: 'bg-background/30',
    border: 'border-muted-foreground/20',
    iconBg: 'bg-muted-foreground/10',
    icon: '○',
    pulseColor: 'bg-muted-foreground/20',
  },
  'parser-inserted': {
    bg: 'bg-amber-500/5',
    border: 'border-amber-500/30',
    iconBg: 'bg-amber-500/15',
    icon: '⊘',
    pulseColor: 'bg-amber-500/20',
  },
  executable: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/40',
    iconBg: 'bg-emerald-500/20',
    icon: '✓',
    pulseColor: 'bg-emerald-500/20',
  },
  duplicate: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/40',
    iconBg: 'bg-red-500/20',
    icon: '!',
    pulseColor: 'bg-red-500/20',
  },
};

export function ScriptTag({
  status,
  label,
  scriptDetails,
  index = 0,
}: ScriptTagProps) {
  const config = STATUS_CONFIG[status];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        delay: index * 0.1,
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative group"
    >
      {/* Hover glow effect */}
      <motion.div
        className={`absolute inset-0 ${config.pulseColor} blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
        initial={false}
      />

      {/* Main container */}
      <div
        className={`
        relative overflow-hidden
        ${config.bg} ${config.border}
        border-2 backdrop-blur-sm
        transition-all duration-300
        group-hover:border-opacity-60 group-hover:shadow-md
      `}
      >
        {/* Animated shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        />

        <div className="relative flex items-center gap-3 px-4 py-3">
          {/* Icon indicator */}
          <div className="relative flex-shrink-0">
            <motion.div
              className={`
                w-10 h-10 rounded-md flex items-center justify-center
                ${config.iconBg} border ${config.border}
                font-mono text-lg font-bold
                transition-all duration-300
                group-hover:scale-110
              `}
              whileHover={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.3 }}
            >
              {/* Pulsing background for certain states */}
              {(status === 'executable' || status === 'duplicate') && (
                <motion.div
                  className={`absolute inset-0 rounded-md ${config.iconBg}`}
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              )}

              <span className="relative z-10">{config.icon}</span>
            </motion.div>

            {/* Corner accent */}
            <div
              className={`absolute -top-0.5 -right-0.5 w-2 h-2 ${config.iconBg} border ${config.border}`}
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-1">
            {/* Script tag label */}
            <div className="flex items-center gap-2">
              <code className="font-mono text-[10px] text-muted-foreground/50 tracking-wide">
                &lt;script&gt;
              </code>
              <motion.div
                className="h-px flex-1 bg-gradient-to-r from-border/40 to-transparent"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: index * 0.1 + 0.2, duration: 0.4 }}
                style={{ transformOrigin: 'left' }}
              />
            </div>

            {/* Status label */}
            <div className="font-mono text-sm font-medium text-foreground/90 tracking-tight">
              {label}
            </div>

            {/* Additional context based on status */}
            {status === 'not-exist' && (
              <div className="flex items-center gap-1.5 text-muted-foreground/50 text-[10px] font-mono">
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <circle cx="5" cy="5" r="4" strokeDasharray="2 2" />
                </svg>
                <span>{scriptDetails.notYetInDOM}</span>
              </div>
            )}

            {status === 'parser-inserted' && (
              <div className="flex items-center gap-1.5 text-amber-500/70 text-[10px] font-mono">
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="currentColor"
                >
                  <circle
                    cx="5"
                    cy="5"
                    r="4"
                    stroke="currentColor"
                    strokeWidth="1"
                    fill="none"
                  />
                  <path
                    d="M5 3v2M5 7v0.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <span>{scriptDetails.cannotExecute}</span>
              </div>
            )}

            {status === 'executable' && (
              <div className="flex items-center gap-1.5 text-emerald-500/70 text-[10px] font-mono">
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <circle cx="5" cy="5" r="4" />
                  <path
                    d="M3 5l1.5 1.5L7 4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>{scriptDetails.executedSuccessfully}</span>
              </div>
            )}

            {status === 'duplicate' && (
              <div className="flex items-center gap-1.5 text-red-500/70 text-[10px] font-mono">
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="currentColor"
                >
                  <path
                    d="M5 1L9 9H1L5 1z"
                    stroke="currentColor"
                    strokeWidth="1"
                    fill="none"
                  />
                  <path
                    d="M5 4v2M5 7v0.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <span>{scriptDetails.duplicateDetected}</span>
              </div>
            )}
          </div>

          {/* Status indicator dot */}
          <div className="flex-shrink-0">
            <motion.div
              className={`w-2 h-2 rounded-full ${
                status === 'executable'
                  ? 'bg-emerald-500'
                  : status === 'duplicate'
                    ? 'bg-red-500'
                    : status === 'parser-inserted'
                      ? 'bg-amber-500'
                      : 'bg-muted-foreground/30'
              }`}
              animate={
                status === 'executable' || status === 'duplicate'
                  ? {
                      scale: [1, 1.3, 1],
                      opacity: [0.7, 1, 0.7],
                    }
                  : {}
              }
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>
        </div>

        {/* Bottom accent line */}
        <motion.div
          className={`h-0.5 ${config.iconBg}`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
          style={{ transformOrigin: 'left' }}
        />
      </div>
    </motion.div>
  );
}
