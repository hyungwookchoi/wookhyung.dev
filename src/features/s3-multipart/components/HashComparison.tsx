'use client';

import { motion } from 'motion/react';

interface HashComparisonProps {
  originalHash: string;
  reconstructedHash: string;
  onDownload: () => void;
  t: {
    originalTitle: string;
    reconstructedTitle: string;
    sha256: string;
    successTitle: string;
    successMessage: string;
    failTitle: string;
    failMessage: string;
    download: string;
  };
}

export function HashComparison({
  originalHash,
  reconstructedHash,
  onDownload,
  t,
}: HashComparisonProps) {
  const isMatch = originalHash === reconstructedHash;

  return (
    <div className="space-y-6">
      {/* Hash Display Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Original Hash */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="relative bg-card border border-border overflow-hidden"
        >
          <div className="h-1 bg-muted" />
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-muted-foreground/60" />
              <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
                {t.originalTitle}
              </h3>
            </div>
            <div className="bg-muted border border-border p-3">
              <div className="font-mono text-[9px] sm:text-[10px] text-muted-foreground break-all leading-relaxed">
                <span className="text-muted-foreground/40 select-none">
                  sha256://
                </span>
                {originalHash}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Reconstructed Hash */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className={`relative bg-card border overflow-hidden ${
            isMatch ? 'border-emerald-800/50' : 'border-red-800/50'
          }`}
        >
          <div className={`h-1 ${isMatch ? 'bg-emerald-500' : 'bg-red-500'}`} />
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div
                className={`w-2 h-2 ${isMatch ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`}
              />
              <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
                {t.reconstructedTitle}
              </h3>
            </div>
            <div
              className={`bg-muted border p-3 ${
                isMatch ? 'border-emerald-900/50' : 'border-red-900/50'
              }`}
            >
              <div
                className={`font-mono text-[9px] sm:text-[10px] break-all leading-relaxed ${
                  isMatch ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                <span className="text-muted-foreground/40 select-none">
                  sha256://
                </span>
                {reconstructedHash}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Verification Result */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className={`relative overflow-hidden ${
          isMatch
            ? 'bg-emerald-950/30 border border-emerald-800/30'
            : 'bg-red-950/30 border border-red-800/30'
        }`}
      >
        {/* Decorative corners */}
        <div
          className={`absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 ${
            isMatch ? 'border-emerald-500/50' : 'border-red-500/50'
          }`}
        />
        <div
          className={`absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 ${
            isMatch ? 'border-emerald-500/50' : 'border-red-500/50'
          }`}
        />
        <div
          className={`absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 ${
            isMatch ? 'border-emerald-500/50' : 'border-red-500/50'
          }`}
        />
        <div
          className={`absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 ${
            isMatch ? 'border-emerald-500/50' : 'border-red-500/50'
          }`}
        />

        <div className="p-8 text-center relative">
          {/* Status icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3, type: 'spring' }}
            className="inline-flex mb-4"
          >
            {isMatch ? (
              <div className="w-16 h-16 border-2 border-emerald-500 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-emerald-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="square"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            ) : (
              <div className="w-16 h-16 border-2 border-red-500 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="square"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            )}
          </motion.div>

          {/* Status text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h3
              className={`text-xl font-light tracking-tight mb-2 ${
                isMatch ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {isMatch ? t.successTitle : t.failTitle}
            </h3>
            <p
              className={`text-sm font-mono ${
                isMatch ? 'text-emerald-500/70' : 'text-red-500/70'
              }`}
            >
              {isMatch ? t.successMessage : t.failMessage}
            </p>
          </motion.div>

          {/* Binary comparison visualization */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 flex justify-center gap-1"
          >
            {Array.from({ length: 32 }).map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-3 ${
                  isMatch
                    ? 'bg-emerald-500/30'
                    : i < 16
                      ? 'bg-emerald-500/30'
                      : 'bg-red-500/30'
                }`}
                style={{
                  animationDelay: `${i * 30}ms`,
                }}
              />
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Download Button */}
      {isMatch && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center"
        >
          <button
            onClick={onDownload}
            className="group relative px-10 py-4 bg-emerald-500 text-background font-mono text-sm uppercase tracking-wider
                     hover:bg-emerald-400 transition-all duration-200"
          >
            <span className="relative z-10 flex items-center gap-3">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="square"
                  strokeWidth={2}
                  d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V3"
                />
              </svg>
              {t.download}
            </span>
          </button>
        </motion.div>
      )}
    </div>
  );
}
