'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';

import { useLocale } from '@/i18n/context';

import { getTranslations } from '../constants/translations';
import { useFileProcessor } from '../hooks/useFileProcessor';
import { FileDropzone } from './FileDropzone';
import { HashComparison } from './HashComparison';
import { PartCard } from './PartCard';

export function MultipartUploadSimulator() {
  const locale = useLocale();
  const t = getTranslations(locale);
  const [partCount, setPartCount] = useState(3);

  const {
    file,
    parts,
    originalHash,
    reconstructedHash,
    isProcessing,
    handleFile,
    splitFile,
    mergeParts,
    downloadReconstructed,
  } = useFileProcessor();

  return (
    <div className="not-prose my-12 relative">
      {/* Scanline texture overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 255, 200, 0.03) 2px,
            rgba(0, 255, 200, 0.03) 4px
          )`,
        }}
      />

      {/* Header */}
      <header className="mb-12 relative">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-4"
        >
          <div className="w-2 h-8 bg-cyan-400" />
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-cyan-400">
            Interactive Simulator
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-4xl font-light tracking-[-0.03em] text-foreground mb-3"
          style={{ fontFamily: 'var(--font-sans, system-ui)' }}
        >
          {t.title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-sm text-muted-foreground font-mono max-w-xl"
        >
          {t.subtitle}
        </motion.p>
      </header>

      {/* File Dropzone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <FileDropzone
          file={file}
          onFileSelect={handleFile}
          disabled={isProcessing}
          t={t.dropzone}
        />
      </motion.div>

      {/* Controls */}
      <AnimatePresence>
        {file && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8 overflow-hidden"
          >
            <div className="p-6 bg-muted/80 border border-border relative">
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-cyan-500/50" />
              <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-cyan-500/50" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-cyan-500/50" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-cyan-500/50" />

              <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-6">
                <div className="flex-1">
                  <div className="flex items-baseline justify-between mb-3">
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
                      {t.controls.partCount}
                    </span>
                    <span className="text-2xl font-mono text-cyan-400 tabular-nums">
                      {String(partCount).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Custom range slider */}
                  <div className="relative h-8 flex items-center">
                    <div className="absolute inset-x-0 h-[2px] bg-border" />
                    <div
                      className="absolute left-0 h-[2px] bg-gradient-to-r from-cyan-500 to-cyan-400"
                      style={{ width: `${((partCount - 2) / 8) * 100}%` }}
                    />
                    <input
                      type="range"
                      min="2"
                      max="10"
                      value={partCount}
                      onChange={(e) => setPartCount(parseInt(e.target.value))}
                      disabled={isProcessing}
                      className="absolute inset-0 w-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    />
                    {/* Tick marks */}
                    <div className="absolute inset-x-0 flex justify-between px-0">
                      {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                        <div
                          key={n}
                          className={`w-[2px] h-2 ${
                            n <= partCount ? 'bg-cyan-500' : 'bg-muted'
                          }`}
                        />
                      ))}
                    </div>
                    {/* Thumb indicator */}
                    <div
                      className="absolute w-4 h-4 bg-cyan-400 border-2 border-card transition-all pointer-events-none"
                      style={{
                        left: `calc(${((partCount - 2) / 8) * 100}% - 8px)`,
                      }}
                    />
                  </div>
                </div>

                <button
                  onClick={() => splitFile(partCount)}
                  disabled={isProcessing}
                  className="group relative px-8 py-3 bg-cyan-500 text-background font-mono text-sm uppercase tracking-wider
                           hover:bg-cyan-400 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed
                           transition-all duration-200"
                >
                  <span className="relative z-10">
                    {isProcessing
                      ? t.controls.processing
                      : t.controls.splitFile}
                  </span>
                  {!isProcessing && (
                    <motion.div
                      className="absolute inset-0 bg-cyan-300"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                      style={{ originX: 0 }}
                    />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Original Hash Display */}
      <AnimatePresence>
        {originalHash && !reconstructedHash && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="mb-8 p-6 bg-muted/60 border border-border"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 bg-amber-400 animate-pulse" />
              <h3 className="text-[11px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
                {t.hash.originalTitle}
              </h3>
            </div>
            <div className="font-mono text-[10px] sm:text-xs text-cyan-400 break-all leading-relaxed bg-card/50 p-4 border border-border">
              <span className="text-muted-foreground/60 select-none">
                sha256://
              </span>
              {originalHash}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Parts Grid */}
      <AnimatePresence>
        {parts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mb-8"
          >
            <div className="flex items-baseline gap-4 mb-6">
              <h3 className="text-xl font-light tracking-tight text-foreground">
                {t.parts.title}
              </h3>
              <span className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-wider">
                [{parts.length} {locale === 'ko' ? '파트' : 'parts'}]
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {parts.map((part, index) => (
                <motion.div
                  key={part.partNumber}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.08,
                    ease: [0.25, 0.25, 0.25, 0.75],
                  }}
                >
                  <PartCard {...part} t={t.parts} index={index} />
                </motion.div>
              ))}
            </div>

            {/* Merge Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: parts.length * 0.08 + 0.2 }}
              className="mt-10 flex justify-center"
            >
              <button
                onClick={mergeParts}
                disabled={isProcessing}
                className="group relative px-12 py-4 bg-transparent border-2 border-amber-500/50 text-amber-400
                         font-mono text-sm uppercase tracking-[0.15em]
                         hover:border-amber-400 hover:text-amber-300 hover:bg-amber-500/5
                         disabled:border-border disabled:text-muted-foreground/60 disabled:cursor-not-allowed
                         transition-all duration-300"
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
                  {isProcessing ? t.merge.merging : t.merge.button}
                </span>
                {!isProcessing && (
                  <motion.div
                    className="absolute inset-0 border-2 border-amber-400"
                    initial={{ opacity: 0, scale: 1.1 }}
                    whileHover={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hash Comparison */}
      <AnimatePresence>
        {reconstructedHash && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <HashComparison
              originalHash={originalHash}
              reconstructedHash={reconstructedHash}
              onDownload={downloadReconstructed}
              t={{
                ...t.hash,
                ...t.result,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
