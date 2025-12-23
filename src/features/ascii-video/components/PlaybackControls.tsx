'use client';

import { motion } from 'motion/react';

interface PlaybackControlsProps {
  isPlaying: boolean;
  isRecording: boolean;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onRecord: () => void;
  onStopRecord: () => void;
  t: {
    play: string;
    pause: string;
    reset: string;
    record: string;
    stopRecord: string;
    recording: string;
  };
}

function MobileButton({
  onClick,
  disabled,
  variant = 'default',
  icon,
  label,
}: {
  onClick: () => void;
  disabled?: boolean;
  variant?: 'default' | 'danger';
  icon: string;
  label: string;
}) {
  const variantClasses =
    variant === 'danger'
      ? 'border-red-400/50 text-red-400'
      : 'border-[#00ff41]/50 text-[#00ff41]/70';

  return (
    <motion.button
      whileTap={disabled ? {} : { scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center gap-2 px-4 py-2 border rounded font-mono text-xs
        transition-all duration-200
        ${variantClasses}
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer active:bg-[#00ff41]/10'}
      `}
    >
      <span className="text-sm">{icon}</span>
      <span>{label}</span>
    </motion.button>
  );
}

function DesktopButton({
  onClick,
  disabled,
  variant = 'default',
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  variant?: 'default' | 'danger';
  children: React.ReactNode;
}) {
  const variantClasses =
    variant === 'danger'
      ? 'text-red-400 hover:text-red-300'
      : 'text-[#00ff41]/70 hover:text-[#00ff41]';

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        relative font-mono text-xs transition-all duration-200
        ${variantClasses}
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <pre className="leading-none select-none">{children}</pre>
    </motion.button>
  );
}

export function PlaybackControls({
  isPlaying,
  isRecording,
  onPlay,
  onPause,
  onReset,
  onRecord,
  onStopRecord,
  t,
}: PlaybackControlsProps) {
  return (
    <div className="space-y-4">
      {/* Command Line Style Header */}
      <div className="flex items-center gap-2 text-[#00ff41]/50 text-[10px] sm:text-xs font-mono">
        <span>$</span>
        <span>./control.sh</span>
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.6, repeat: Infinity }}
        >
          _
        </motion.span>
      </div>

      {/* Mobile Button Panel */}
      <div className="flex sm:hidden flex-wrap items-center justify-center gap-2">
        <MobileButton
          onClick={isPlaying ? onPause : onPlay}
          disabled={isRecording}
          icon={isPlaying ? '▐▐' : '▶'}
          label={isPlaying ? t.pause : t.play}
        />
        <MobileButton
          onClick={onReset}
          disabled={isRecording}
          icon="↺"
          label={t.reset}
        />
        <MobileButton
          onClick={isRecording ? onStopRecord : onRecord}
          variant={isRecording ? 'danger' : 'default'}
          icon={isRecording ? '■' : '●'}
          label={isRecording ? t.stopRecord : t.record}
        />
      </div>

      {/* Desktop ASCII Button Panel */}
      <div className="hidden sm:flex flex-wrap items-center justify-center gap-4">
        <DesktopButton
          onClick={isPlaying ? onPause : onPlay}
          disabled={isRecording}
        >
          {isPlaying
            ? `┌──────────┐
│ ▐▐ ${t.pause.padEnd(4)} │
└──────────┘`
            : `┌──────────┐
│ ▶  ${t.play.padEnd(4)} │
└──────────┘`}
        </DesktopButton>

        <DesktopButton onClick={onReset} disabled={isRecording}>
          {`┌──────────┐
│ ↺  ${t.reset.padEnd(4)} │
└──────────┘`}
        </DesktopButton>

        <DesktopButton
          onClick={isRecording ? onStopRecord : onRecord}
          variant={isRecording ? 'danger' : 'default'}
        >
          {isRecording
            ? `┌──────────┐
│ ■  ${t.stopRecord.padEnd(4)} │
└──────────┘`
            : `┌──────────┐
│ ●  ${t.record.padEnd(4)} │
└──────────┘`}
        </DesktopButton>
      </div>

      {/* Recording Status Indicator */}
      {isRecording && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2"
        >
          <motion.span
            animate={{ opacity: [1, 0.3] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="text-red-500 text-base sm:text-lg"
          >
            ●
          </motion.span>
          <span className="text-red-400 text-[10px] sm:text-xs font-mono uppercase tracking-wider">
            {t.recording}
          </span>
        </motion.div>
      )}
    </div>
  );
}
