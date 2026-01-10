import { AnimatePresence,motion } from 'motion/react';

import type { FlowStep as FlowStepType } from '../types';
import { ScriptTag } from './ScriptTag';

interface FlowStepProps {
  step: FlowStepType;
  isActive: boolean;
  isCompleted: boolean;
  onClick: () => void;
  locale: 'ko' | 'en';
  scriptLabels: Record<string, string>;
  stepStatus: {
    complete: string;
    active: string;
    pending: string;
  };
  sectionHeaders: {
    processDescription: string;
    scriptStatus: string;
  };
  scriptDetails: {
    notYetInDOM: string;
    cannotExecute: string;
    executedSuccessfully: string;
    duplicateDetected: string;
  };
  stepNumber: number;
  isPlaying: boolean;
}

export function FlowStep({
  step,
  isActive,
  isCompleted,
  onClick,
  locale,
  scriptLabels,
  stepStatus,
  sectionHeaders,
  scriptDetails,
  stepNumber,
  isPlaying,
}: FlowStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: stepNumber * 0.1 }}
      className="relative"
    >
      {/* Step Container */}
      <div className="relative">
        {/* Glow effect when active */}
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 -m-1 bg-primary/10 blur-xl"
          />
        )}

        {/* Step Header Button */}
        <motion.button
          onClick={onClick}
          whileHover={{ scale: 1.005 }}
          whileTap={{ scale: 0.995 }}
          className={`
            relative w-full text-left overflow-hidden group
            transition-all duration-300
            ${isActive ? 'shadow-lg' : 'shadow-sm hover:shadow-md'}
          `}
        >
          {/* Background layers */}
          <div
            className={`
            absolute inset-0 transition-all duration-300
            ${isActive ? 'bg-primary/5 border-2 border-primary/40' : 'bg-card/60 border-2 border-border/40'}
            ${!isActive ? 'group-hover:border-primary/30 group-hover:bg-card/80' : ''}
            ${isCompleted ? 'opacity-70' : ''}
          `}
          />

          {/* Animated accent line */}
          <motion.div
            className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary/60 to-transparent"
            initial={{ scaleY: 0 }}
            animate={{
              scaleY: isActive ? 1 : isCompleted ? 1 : 0,
              opacity: isActive ? 1 : isCompleted ? 0.5 : 0,
            }}
            transition={{ duration: 0.3 }}
            style={{ transformOrigin: 'top' }}
          />

          {/* Content */}
          <div className="relative px-6 py-5 flex items-center gap-4">
            {/* Step number indicator */}
            <div className="relative flex-shrink-0">
              <motion.div
                className={`
                  w-12 h-12 rounded-full border-2 flex items-center justify-center
                  font-mono text-lg font-bold relative overflow-hidden
                  transition-all duration-300
                  ${
                    isActive
                      ? 'border-primary bg-primary/10 text-primary shadow-lg shadow-primary/20'
                      : isCompleted
                        ? 'border-primary/50 bg-primary/5 text-primary/70'
                        : 'border-border/50 bg-background/50 text-muted-foreground group-hover:border-primary/30'
                  }
                `}
                animate={{
                  scale: isActive ? [1, 1.05, 1] : 1,
                }}
                transition={{
                  duration: 2,
                  repeat: isActive ? Infinity : 0,
                  ease: 'easeInOut',
                }}
              >
                {/* Rotating background gradient */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                )}

                <span className="relative z-10">
                  {isCompleted ? (
                    <motion.span
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        type: 'spring',
                        stiffness: 200,
                        damping: 15,
                      }}
                    >
                      ✓
                    </motion.span>
                  ) : (
                    stepNumber
                  )}
                </span>
              </motion.div>

              {/* Pulse ring when playing */}
              {isActive && isPlaying && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-primary"
                  initial={{ scale: 1, opacity: 0.5 }}
                  animate={{ scale: 1.3, opacity: 0 }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeOut',
                  }}
                />
              )}
            </div>

            {/* Title and meta info */}
            <div className="flex-1 min-w-0">
              <h3
                className={`
                font-mono text-base font-semibold tracking-tight
                transition-colors duration-300
                ${isActive ? 'text-foreground' : 'text-foreground/80 group-hover:text-foreground'}
              `}
              >
                {step.title[locale]}
              </h3>

              {/* Status badge */}
              <div className="flex items-center gap-2 mt-1.5">
                <div
                  className={`
                  flex items-center gap-1.5 px-2 py-0.5 rounded-sm
                  font-mono text-[10px] tracking-wider uppercase
                  transition-colors duration-300
                  ${
                    isActive
                      ? 'bg-primary/15 text-primary border border-primary/30'
                      : isCompleted
                        ? 'bg-primary/10 text-primary/60 border border-primary/20'
                        : 'bg-background/50 text-muted-foreground/60 border border-border/40'
                  }
                `}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      isActive
                        ? 'bg-primary animate-pulse'
                        : isCompleted
                          ? 'bg-primary/50'
                          : 'bg-muted-foreground/40'
                    }`}
                  />
                  {isCompleted
                    ? stepStatus.complete
                    : isActive
                      ? stepStatus.active
                      : stepStatus.pending}
                </div>
              </div>
            </div>

            {/* Expand indicator */}
            <motion.div
              animate={{ rotate: isActive ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className={`
                flex-shrink-0 transition-colors duration-300
                ${isActive ? 'text-primary' : 'text-muted-foreground/40 group-hover:text-muted-foreground'}
              `}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M4 6l4 4 4-4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
          </div>
        </motion.button>

        {/* Expanded Content */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="relative border-2 border-t-0 border-border/40 bg-card/40 backdrop-blur-sm">
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

                <div className="relative p-6 space-y-6">
                  {/* Description */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-primary/60" />
                      <span className="font-mono text-[10px] tracking-wider uppercase text-muted-foreground/60 font-medium">
                        {sectionHeaders.processDescription}
                      </span>
                    </div>

                    {step.description[locale].map((desc, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.08, duration: 0.3 }}
                        className="flex items-start gap-3 group/desc"
                      >
                        {/* Bullet point */}
                        <div className="flex-shrink-0 mt-2">
                          {desc.startsWith('→') ? (
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 12 12"
                              className="text-primary"
                            >
                              <path
                                d="M0 6h8M6 2l4 4-4 4"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          ) : (
                            <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30 group-hover/desc:bg-muted-foreground/50 transition-colors" />
                          )}
                        </div>

                        <p
                          className={`
                          font-mono text-sm leading-relaxed transition-colors
                          ${
                            desc.startsWith('→')
                              ? 'text-primary font-medium'
                              : 'text-muted-foreground/90 group-hover/desc:text-foreground'
                          }
                        `}
                        >
                          {desc.replace('→ ', '')}
                        </p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="relative h-px">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-border/60 to-transparent" />
                  </div>

                  {/* Script Status Visualization */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        className="text-primary/60"
                      >
                        <rect
                          x="1"
                          y="1"
                          width="12"
                          height="12"
                          rx="1"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          fill="none"
                        />
                        <path
                          d="M4 7l2 2 4-4"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="font-mono text-[10px] tracking-wider uppercase text-muted-foreground/60 font-medium">
                        {sectionHeaders.scriptStatus}
                      </span>
                    </div>

                    <div className="grid gap-3">
                      {step.scriptStatus.map((status, idx) => (
                        <ScriptTag
                          key={`${status}-${idx}`}
                          status={status}
                          label={scriptLabels[status]}
                          scriptDetails={scriptDetails}
                          index={idx}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
