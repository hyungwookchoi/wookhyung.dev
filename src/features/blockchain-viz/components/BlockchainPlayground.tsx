'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useLocale } from '@/i18n/context';

import { getTranslations } from '../constants/translations';

// ============================================================================
// Types
// ============================================================================

type LessonStep = 0 | 1 | 2 | 3 | 4 | 5;

interface BlockData {
  index: number;
  timestamp: number;
  data: string;
  previousHash: string;
  hash: string;
}

interface NodeData {
  id: string;
  name: string;
  blocks: BlockData[];
  isTampered: boolean;
  isRejected: boolean;
}

// ============================================================================
// Crypto Utilities
// ============================================================================

function simpleHash(str: string): string {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  const hex = (hash >>> 0).toString(16);
  return hex.padStart(8, '0').repeat(8);
}

async function calculateHash(
  index: number,
  timestamp: number,
  data: string,
  previousHash: string,
): Promise<string> {
  const content = `${index}${timestamp}${data}${previousHash}`;

  if (typeof window !== 'undefined' && window.crypto?.subtle) {
    try {
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(content);
      const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    } catch {
      return simpleHash(content);
    }
  }

  return simpleHash(content);
}

// ============================================================================
// Block Class
// ============================================================================

class Block {
  index: number;
  timestamp: number;
  data: string;
  previousHash: string;
  hash: string;

  constructor(index: number, data: string, previousHash: string, hash: string) {
    this.index = index;
    this.timestamp = Date.now();
    this.data = data;
    this.previousHash = previousHash;
    this.hash = hash;
  }

  static async create(
    index: number,
    data: string,
    previousHash: string,
  ): Promise<Block> {
    const timestamp = Date.now();
    const hash = await calculateHash(index, timestamp, data, previousHash);
    const block = new Block(index, data, previousHash, hash);
    block.timestamp = timestamp;
    return block;
  }

  toData(): BlockData {
    return {
      index: this.index,
      timestamp: this.timestamp,
      data: this.data,
      previousHash: this.previousHash,
      hash: this.hash,
    };
  }
}

// ============================================================================
// Styled Sub-components
// ============================================================================

function NoiseOverlay() {
  return (
    <div
      className="fixed inset-0 pointer-events-none opacity-[0.03] z-0"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }}
    />
  );
}

function LessonProgress({ currentStep }: { currentStep: LessonStep }) {
  if (currentStep === 0 || currentStep === 5) return null;

  return (
    <div className="flex items-center justify-center gap-1 mb-8">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="flex items-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: step * 0.05 }}
            className={`
              w-10 h-10 flex items-center justify-center text-sm font-mono
              transition-all duration-300
              ${
                currentStep > step
                  ? 'bg-emerald-500 text-black'
                  : currentStep === step
                    ? 'bg-white text-black'
                    : 'bg-zinc-800/50 text-zinc-600'
              }
            `}
          >
            {currentStep > step ? '✓' : step}
          </motion.div>
          {step < 4 && (
            <div
              className={`w-8 h-[1px] transition-colors duration-300 ${
                currentStep > step ? 'bg-emerald-500' : 'bg-zinc-800'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function IntroScreen({
  t,
  onStart,
}: {
  t: ReturnType<typeof getTranslations>;
  onStart: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-[70vh] flex flex-col items-center justify-center relative"
    >
      {/* Decorative grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(to right, white 1px, transparent 1px),
              linear-gradient(to bottom, white 1px, transparent 1px)
            `,
            backgroundSize: '64px 64px',
          }}
        />
      </div>

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="relative mb-8"
      >
        <div className="text-[120px] leading-none font-mono opacity-10 absolute -top-8 -left-8">
          #
        </div>
        <div className="w-24 h-24 border-2 border-white flex items-center justify-center">
          <div className="w-12 h-12 bg-emerald-500" />
        </div>
      </motion.div>

      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-4xl md:text-6xl font-bold tracking-tight mb-4 text-center"
        style={{ fontFamily: 'JetBrains Mono, monospace' }}
      >
        {t.title}
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-zinc-500 mb-12 font-mono text-sm tracking-widest uppercase"
      >
        {t.subtitle}
      </motion.p>

      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.02, backgroundColor: 'rgb(255,255,255)' }}
        whileTap={{ scale: 0.98 }}
        onClick={onStart}
        className="group px-8 py-4 bg-white text-black font-mono text-sm tracking-wider
          transition-all duration-200 flex items-center gap-3"
      >
        {t.navigation.start}
        <motion.span
          animate={{ x: [0, 4, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          →
        </motion.span>
      </motion.button>
    </motion.div>
  );
}

function LessonHeader({
  lessonNumber,
  title,
  question,
  explanation,
}: {
  lessonNumber: number;
  title: string;
  question: string;
  explanation: string;
}) {
  const parseExplanation = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <span key={i} className="text-emerald-400 font-semibold">
            {part.slice(2, -2)}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="font-mono text-xs tracking-widest text-zinc-500 uppercase">
          {lessonNumber}/4
        </span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      <h2 className="text-3xl font-bold tracking-tight mb-3 font-mono">
        {title}
      </h2>

      <p className="text-lg text-emerald-400 mb-4 font-light">{question}</p>

      <p className="text-zinc-400 max-w-2xl whitespace-pre-line leading-relaxed text-sm">
        {parseExplanation(explanation)}
      </p>
    </motion.div>
  );
}

function MissionBox({ mission, hint }: { mission: string; hint?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="border-l-2 border-amber-500 bg-amber-500/5 pl-4 py-3 mb-6"
    >
      <div className="flex items-center gap-2 mb-1">
        <div className="w-2 h-2 bg-amber-500 animate-pulse" />
        <span className="font-mono text-xs tracking-widest text-amber-500 uppercase">
          Mission
        </span>
      </div>
      <p className="text-zinc-300 text-sm">{mission}</p>
      {hint && <p className="text-zinc-500 text-xs mt-2 font-mono">→ {hint}</p>}
    </motion.div>
  );
}

function SuccessMessage({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="border-l-2 border-emerald-500 bg-emerald-500/5 pl-4 py-3 mb-6"
    >
      <div className="flex items-center gap-2 mb-1">
        <div className="w-2 h-2 bg-emerald-500" />
        <span className="font-mono text-xs tracking-widest text-emerald-500 uppercase">
          Complete
        </span>
      </div>
      <p className="text-emerald-400 text-sm">{message}</p>
    </motion.div>
  );
}

function BlockCard({
  block,
  label,
  showHash = false,
  showPrevHash = false,
  isEditing = false,
  editValue = '',
  onEditChange,
  onSave,
  onCancel,
  onStartEdit,
  canEdit = false,
  isTampered = false,
  hasInvalidPrevHash = false,
  isGenesis = false,
  t,
}: {
  block: BlockData;
  label: string;
  showHash?: boolean;
  showPrevHash?: boolean;
  isEditing?: boolean;
  editValue?: string;
  onEditChange?: (value: string) => void;
  onSave?: () => void;
  onCancel?: () => void;
  onStartEdit?: () => void;
  canEdit?: boolean;
  isTampered?: boolean;
  hasInvalidPrevHash?: boolean;
  isGenesis?: boolean;
  t: ReturnType<typeof getTranslations>;
}) {
  const hasIssue = isTampered || hasInvalidPrevHash;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        relative border transition-all duration-300
        ${hasIssue ? 'border-red-500/50 bg-red-500/5' : 'border-zinc-800 bg-zinc-900/30'}
        ${isGenesis ? 'opacity-50' : ''}
      `}
    >
      {/* Block number indicator */}
      <div
        className={`
          absolute -left-px -top-px px-2 py-0.5 text-[10px] font-mono
          ${hasIssue ? 'bg-red-500 text-white' : 'bg-white text-black'}
        `}
      >
        #{block.index}
      </div>

      <div className="p-4 pt-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-2 gap-2">
          <span className="font-mono text-xs text-zinc-400 truncate">
            {label}
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            {isTampered && (
              <span className="text-[10px] font-mono text-red-400 px-1.5 py-0.5 bg-red-500/10">
                {t.lesson3.tampered}
              </span>
            )}
            {hasInvalidPrevHash && !isTampered && (
              <span className="text-[10px] font-mono text-amber-400 px-1.5 py-0.5 bg-amber-500/10">
                ✕
              </span>
            )}
            {canEdit && !isEditing && (
              <button
                onClick={onStartEdit}
                className="text-[10px] font-mono px-2 py-1 border border-amber-500/50 text-amber-500
                  hover:bg-amber-500/10 transition-colors"
              >
                {t.lesson3.editButton}
              </button>
            )}
          </div>
        </div>

        {/* Data */}
        <div className={showHash || showPrevHash ? 'mb-3' : ''}>
          <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-wider mb-1">
            {t.block.data}
          </div>
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={editValue}
                onChange={(e) => onEditChange?.(e.target.value)}
                className="w-full bg-black border border-amber-500/50 px-2.5 py-2 font-mono text-xs
                  focus:border-amber-500 outline-none"
                autoFocus
              />
              <div className="flex gap-1.5">
                <button
                  onClick={onSave}
                  className="px-3 py-1.5 bg-amber-500 text-black font-mono text-[10px]
                    hover:bg-amber-400 transition-colors"
                >
                  {t.lesson3.saveButton}
                </button>
                <button
                  onClick={onCancel}
                  className="px-3 py-1.5 border border-zinc-700 font-mono text-[10px]
                    hover:bg-zinc-800 transition-colors"
                >
                  {t.lesson3.cancelButton}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-black/50 px-2.5 py-2 font-mono text-xs text-zinc-300 truncate">
              {block.data}
            </div>
          )}
        </div>

        {/* Hash */}
        {showHash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={showPrevHash && block.index > 0 ? 'mb-2' : ''}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-wider">
                {t.block.hash}
              </div>
              <div
                className={`text-[8px] font-mono px-1 py-0.5 ${
                  isTampered
                    ? 'bg-red-500/10 text-red-400'
                    : 'bg-emerald-500/10 text-emerald-400'
                }`}
              >
                ●
              </div>
            </div>
            <div
              className={`font-mono text-[10px] break-all px-2 py-1.5 ${
                isTampered
                  ? 'bg-red-500/10 text-red-400'
                  : 'bg-emerald-500/10 text-emerald-400'
              }`}
            >
              {block.hash.slice(0, 16)}...
            </div>
          </motion.div>
        )}

        {/* Prev Hash */}
        {showPrevHash && block.index > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center gap-1.5 mb-1">
              <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-wider">
                {t.block.prevHash}
              </div>
              <div
                className={`text-[8px] font-mono px-1 py-0.5 ${
                  hasInvalidPrevHash
                    ? 'bg-red-500/10 text-red-400'
                    : 'bg-purple-500/10 text-purple-400'
                }`}
              >
                {hasInvalidPrevHash ? '✕' : '↑'}
              </div>
            </div>
            <div
              className={`font-mono text-[10px] break-all px-2 py-1.5 ${
                hasInvalidPrevHash
                  ? 'bg-red-500/10 text-red-400'
                  : 'bg-purple-500/10 text-purple-400'
              }`}
            >
              {block.previousHash.slice(0, 16)}...
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

function ChainArrow({ isConnected }: { isConnected: boolean }) {
  return (
    <div className="flex flex-col items-center py-4 relative">
      <motion.div
        animate={{
          backgroundColor: isConnected ? 'rgb(16 185 129)' : 'rgb(239 68 68)',
          scaleY: isConnected ? 1 : 0.3,
        }}
        className="w-[2px] h-12"
      />
      {!isConnected && (
        <motion.div
          initial={{ scale: 0, rotate: 0 }}
          animate={{ scale: 1, rotate: 45 }}
          className="absolute top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center
            bg-red-500 text-white text-xs font-bold"
        >
          ✕
        </motion.div>
      )}
      <motion.div
        animate={{
          borderTopColor: isConnected ? 'rgb(16 185 129)' : 'rgb(239 68 68)',
        }}
        className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[10px]
          border-l-transparent border-r-transparent"
      />
    </div>
  );
}

function BrokenChainWarning({ t }: { t: ReturnType<typeof getTranslations> }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-red-500/10 border border-red-500/30 p-6 mb-8"
    >
      <div className="flex items-start gap-4">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="w-10 h-10 bg-red-500 flex items-center justify-center text-white font-bold"
        >
          !
        </motion.div>
        <div>
          <p className="font-mono text-red-400 font-bold mb-2">
            {t.lesson3.warningTitle}
          </p>
          <p className="text-sm text-red-300/70 whitespace-pre-line">
            {t.lesson3.warningText}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function NetworkNode({
  node,
  isYours = false,
  onTamper,
  t,
}: {
  node: NodeData;
  isYours?: boolean;
  onTamper?: () => void;
  t: ReturnType<typeof getTranslations>;
}) {
  const statusColor = node.isRejected
    ? 'border-red-500/50 bg-red-500/5'
    : node.isTampered
      ? 'border-amber-500/50 bg-amber-500/5'
      : 'border-emerald-500/50 bg-emerald-500/5';

  const statusText = node.isRejected
    ? t.lesson4.rejected
    : node.isTampered
      ? t.lesson3.tampered
      : t.lesson4.synced;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`border p-4 min-w-[200px] ${statusColor}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 flex items-center justify-center text-xs font-mono
              ${isYours ? 'bg-white text-black' : 'bg-zinc-800 text-white'}`}
          >
            {isYours ? 'YOU' : '💻'}
          </div>
          <span className="font-mono text-sm">{node.name}</span>
        </div>
        <span
          className={`text-[10px] font-mono ${
            node.isRejected
              ? 'text-red-400'
              : node.isTampered
                ? 'text-amber-400'
                : 'text-emerald-400'
          }`}
        >
          {statusText}
        </span>
      </div>

      <div className="space-y-1">
        {node.blocks.slice(0, 3).map((block, i) => (
          <div
            key={i}
            className={`text-[10px] font-mono px-2 py-1 truncate ${
              node.isTampered && i === 1
                ? 'bg-red-500/20 text-red-400'
                : 'bg-black/30 text-zinc-500'
            }`}
          >
            #{block.index}: {block.data.slice(0, 12)}...
          </div>
        ))}
      </div>

      {onTamper && !node.isTampered && (
        <button
          onClick={onTamper}
          className="mt-3 w-full text-xs font-mono px-3 py-2 border border-amber-500/50
            text-amber-500 hover:bg-amber-500/10 transition-colors"
        >
          TAMPER DATA
        </button>
      )}
    </motion.div>
  );
}

function NavigationButtons({
  currentStep,
  canProceed,
  onPrevious,
  onNext,
  t,
}: {
  currentStep: LessonStep;
  canProceed: boolean;
  onPrevious: () => void;
  onNext: () => void;
  t: ReturnType<typeof getTranslations>;
}) {
  if (currentStep === 0 || currentStep === 5) return null;

  return (
    <div className="flex justify-between items-center mt-12 pt-8 border-t border-zinc-800">
      <button
        onClick={onPrevious}
        disabled={currentStep === 1}
        className="px-6 py-3 border border-zinc-800 font-mono text-sm tracking-wider
          hover:bg-zinc-900 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
      >
        ← {t.navigation.previous}
      </button>

      <motion.button
        whileHover={canProceed ? { scale: 1.02 } : {}}
        whileTap={canProceed ? { scale: 0.98 } : {}}
        onClick={onNext}
        disabled={!canProceed}
        className={`px-6 py-3 font-mono text-sm tracking-wider transition-all ${
          canProceed
            ? 'bg-white text-black hover:bg-zinc-200'
            : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
        }`}
      >
        {t.navigation.next} →
      </motion.button>
    </div>
  );
}

function CompletionScreen({
  t,
  onRestart,
}: {
  t: ReturnType<typeof getTranslations>;
  onRestart: () => void;
}) {
  const points = [
    { icon: '□', text: t.completion.point1 },
    { icon: '⟷', text: t.completion.point2 },
    { icon: '✕', text: t.completion.point3 },
    { icon: '◎', text: t.completion.point4 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-[60vh] flex flex-col items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 0.2 }}
        className="w-24 h-24 border-2 border-emerald-500 flex items-center justify-center mb-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4 }}
          className="text-4xl"
        >
          ✓
        </motion.div>
      </motion.div>

      <h2
        className="text-3xl md:text-4xl font-bold tracking-tight mb-8"
        style={{ fontFamily: 'JetBrains Mono, monospace' }}
      >
        {t.completion.title}
      </h2>

      <div className="max-w-md w-full mb-12">
        <p className="font-mono text-xs text-zinc-500 uppercase tracking-widest mb-6 text-center">
          {t.completion.summary}
        </p>
        <div className="space-y-3">
          {points.map((point, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="flex items-center gap-4 p-4 border border-zinc-800 bg-zinc-900/30"
            >
              <span
                className="w-8 h-8 flex items-center justify-center bg-emerald-500/10
                text-emerald-400 font-mono"
              >
                {point.icon}
              </span>
              <span className="text-sm text-zinc-400">{point.text}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onRestart}
        className="px-8 py-4 border border-white font-mono text-sm tracking-wider
          hover:bg-white hover:text-black transition-colors"
      >
        {t.completion.restartButton}
      </motion.button>
    </motion.div>
  );
}

// ============================================================================
// Lesson Components
// ============================================================================

function Lesson1({
  blocks,
  onAddBlock,
  inputValue,
  setInputValue,
  missionComplete,
  isLoading,
  isInitialized,
  t,
}: {
  blocks: BlockData[];
  onAddBlock: () => void;
  inputValue: string;
  setInputValue: (v: string) => void;
  missionComplete: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  t: ReturnType<typeof getTranslations>;
}) {
  const isButtonDisabled = !inputValue.trim() || isLoading || !isInitialized;

  return (
    <div>
      <LessonHeader
        lessonNumber={1}
        title={t.lesson1.title}
        question={t.lesson1.question}
        explanation={t.lesson1.explanation}
      />

      {!missionComplete ? (
        <MissionBox mission={t.lesson1.mission} />
      ) : (
        <SuccessMessage message={t.lesson1.success} />
      )}

      <div className="max-w-xl">
        {!missionComplete && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 mb-8"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) =>
                e.key === 'Enter' && !isButtonDisabled && onAddBlock()
              }
              placeholder={t.lesson1.placeholder}
              className="flex-1 bg-black border border-zinc-800 px-4 py-3 font-mono text-sm
                focus:border-white outline-none transition-colors"
              disabled={isLoading}
            />
            <motion.button
              whileHover={!isButtonDisabled ? { scale: 1.02 } : {}}
              whileTap={!isButtonDisabled ? { scale: 0.98 } : {}}
              onClick={onAddBlock}
              disabled={isButtonDisabled}
              className="px-6 py-3 bg-white text-black font-mono text-sm
                disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
            >
              {isLoading ? '...' : t.lesson1.addRecord}
            </motion.button>
          </motion.div>
        )}

        {!isInitialized && (
          <div className="text-center text-zinc-600 text-sm py-8 font-mono">
            Initializing...
          </div>
        )}

        <AnimatePresence>
          {blocks
            .filter((b) => b.index > 0)
            .map((block) => (
              <motion.div key={block.index}>
                <BlockCard
                  block={block}
                  label={`${t.lesson1.blockLabel}${block.index}`}
                  t={t}
                />
                {missionComplete && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center text-xs text-zinc-500 mt-6 font-mono"
                  >
                    → {t.lesson1.hint}
                  </motion.p>
                )}
              </motion.div>
            ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Lesson2({
  blocks,
  onAddBlock,
  inputValue,
  setInputValue,
  missionComplete,
  isLoading,
  t,
}: {
  blocks: BlockData[];
  onAddBlock: () => void;
  inputValue: string;
  setInputValue: (v: string) => void;
  missionComplete: boolean;
  isLoading: boolean;
  t: ReturnType<typeof getTranslations>;
}) {
  const isButtonDisabled = !inputValue.trim() || isLoading;
  const needsMoreBlocks = blocks.length < 3;

  return (
    <div>
      <LessonHeader
        lessonNumber={2}
        title={t.lesson2.title}
        question={t.lesson2.question}
        explanation={t.lesson2.explanation}
      />

      {!missionComplete ? (
        <MissionBox mission={t.lesson2.mission} hint={t.lesson2.hint} />
      ) : (
        <SuccessMessage message={t.lesson2.success} />
      )}

      <div className="max-w-xl">
        {needsMoreBlocks && !missionComplete && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 mb-8"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) =>
                e.key === 'Enter' && !isButtonDisabled && onAddBlock()
              }
              placeholder={t.lesson1.placeholder}
              className="flex-1 bg-black border border-zinc-800 px-4 py-3 font-mono text-sm
                focus:border-white outline-none transition-colors"
              disabled={isLoading}
            />
            <motion.button
              whileHover={!isButtonDisabled ? { scale: 1.02 } : {}}
              whileTap={!isButtonDisabled ? { scale: 0.98 } : {}}
              onClick={onAddBlock}
              disabled={isButtonDisabled}
              className="px-6 py-3 bg-white text-black font-mono text-sm
                disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
            >
              {isLoading ? '...' : t.lesson1.addRecord}
            </motion.button>
          </motion.div>
        )}

        {/* Legend */}
        <div className="flex gap-6 mb-8 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-emerald-500/20 border border-emerald-500/50" />
            <span className="text-zinc-500">{t.lesson2.hashExplanation}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-purple-500/20 border border-purple-500/50" />
            <span className="text-zinc-500">
              {t.lesson2.prevHashExplanation}
            </span>
          </div>
        </div>

        <AnimatePresence>
          {blocks.map((block, index) => (
            <div key={block.index}>
              {index > 0 && <ChainArrow isConnected={true} />}
              <BlockCard
                block={block}
                label={
                  block.index === 0
                    ? t.block.genesis
                    : `${t.block.block} #${block.index}`
                }
                showHash={true}
                showPrevHash={true}
                isGenesis={block.index === 0}
                t={t}
              />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Lesson3({
  blocks,
  editingIndex,
  editValue,
  setEditValue,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  tamperedBlockIndex,
  missionComplete,
  t,
}: {
  blocks: BlockData[];
  editingIndex: number | null;
  editValue: string;
  setEditValue: (v: string) => void;
  onStartEdit: (index: number) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  tamperedBlockIndex: number | null;
  missionComplete: boolean;
  t: ReturnType<typeof getTranslations>;
}) {
  return (
    <div>
      <LessonHeader
        lessonNumber={3}
        title={t.lesson3.title}
        question={t.lesson3.question}
        explanation={t.lesson3.explanation}
      />

      {!missionComplete ? (
        <MissionBox mission={t.lesson3.mission} hint={t.lesson3.hint} />
      ) : (
        <SuccessMessage message={t.lesson3.success} />
      )}

      <AnimatePresence>
        {tamperedBlockIndex !== null && <BrokenChainWarning t={t} />}
      </AnimatePresence>

      <div className="max-w-xl">
        <AnimatePresence>
          {blocks.map((block, index) => {
            // Check if the connection TO this block is valid
            // Connection is broken if the previous block was tampered (its hash changed)
            const prevBlock = index > 0 ? blocks[index - 1] : null;
            const isConnectionValid = prevBlock
              ? prevBlock.hash === block.previousHash
              : true;

            // Block is "tampered" if it's the one that was edited
            const isThisBlockTampered =
              tamperedBlockIndex !== null && block.index === tamperedBlockIndex;
            // Blocks after the tampered one have invalid prevHash references
            const hasInvalidPrevHash =
              tamperedBlockIndex !== null && block.index > tamperedBlockIndex;

            return (
              <div key={block.index}>
                {index > 0 && <ChainArrow isConnected={isConnectionValid} />}
                <BlockCard
                  block={block}
                  label={
                    block.index === 0
                      ? t.block.genesis
                      : `${t.block.block} #${block.index}`
                  }
                  showHash={true}
                  showPrevHash={true}
                  canEdit={
                    block.index > 0 &&
                    block.index < blocks.length - 1 &&
                    tamperedBlockIndex === null
                  }
                  isEditing={editingIndex === block.index}
                  editValue={editValue}
                  onEditChange={setEditValue}
                  onStartEdit={() => onStartEdit(block.index)}
                  onSave={onSaveEdit}
                  onCancel={onCancelEdit}
                  isTampered={isThisBlockTampered}
                  hasInvalidPrevHash={hasInvalidPrevHash}
                  isGenesis={block.index === 0}
                  t={t}
                />
              </div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Lesson4({
  nodes,
  onTamperNode,
  consensusReached,
  missionComplete,
  isTampering,
  t,
}: {
  nodes: NodeData[];
  onTamperNode: (nodeId: string) => void;
  consensusReached: boolean;
  missionComplete: boolean;
  isTampering: boolean;
  t: ReturnType<typeof getTranslations>;
}) {
  const yourNode = nodes.find((n) => n.id === 'you');
  const networkNodes = nodes.filter((n) => n.id !== 'you');

  return (
    <div>
      <LessonHeader
        lessonNumber={4}
        title={t.lesson4.title}
        question={t.lesson4.question}
        explanation={t.lesson4.explanation}
      />

      {!missionComplete ? (
        <MissionBox mission={t.lesson4.tryTamper} />
      ) : (
        <SuccessMessage message={t.lesson4.success} />
      )}

      <div className="relative">
        {/* Your node */}
        <div className="flex justify-center mb-8">
          <div className="text-center">
            <p className="text-xs font-mono text-zinc-500 mb-2 uppercase tracking-wider">
              {t.lesson4.yourNode}
            </p>
            {yourNode && <NetworkNode node={yourNode} isYours t={t} />}
          </div>
        </div>

        {/* Connection */}
        <div className="flex justify-center mb-8">
          <div className="w-[2px] h-8 bg-linear-to-b from-zinc-600 to-transparent" />
        </div>

        {/* Network nodes */}
        <div className="text-center">
          <p className="text-xs font-mono text-zinc-500 mb-4 uppercase tracking-wider">
            {t.lesson4.networkNodes}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {networkNodes.map((node, i) => (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.1 }}
              >
                <NetworkNode
                  node={node}
                  onTamper={
                    !node.isTampered && !consensusReached && !isTampering
                      ? () => onTamperNode(node.id)
                      : undefined
                  }
                  t={t}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Consensus result */}
        {consensusReached && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 p-4 border border-emerald-500/30 bg-emerald-500/5 text-center"
          >
            <p className="text-emerald-400 font-mono font-bold flex items-center justify-center gap-2 mb-2">
              <span className="w-6 h-6 bg-emerald-500 text-black flex items-center justify-center text-xs">
                ✓
              </span>
              {t.lesson4.consensus}
            </p>
            <p className="text-xs text-zinc-500 whitespace-pre-line max-w-sm mx-auto leading-relaxed">
              {t.lesson4.explanation2}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function BlockchainPlayground() {
  const locale = useLocale();
  const t = useMemo(() => getTranslations(locale), [locale]);

  const [currentStep, setCurrentStep] = useState<LessonStep>(0);
  const [blocks, setBlocks] = useState<BlockData[]>([]);
  const [inputValue, setInputValue] = useState('');

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [tamperedBlockIndex, setTamperedBlockIndex] = useState<number | null>(
    null,
  );

  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [consensusReached, setConsensusReached] = useState(false);
  const [isTampering, setIsTampering] = useState(false);

  const [lesson1Complete, setLesson1Complete] = useState(false);
  const [lesson2Complete, setLesson2Complete] = useState(false);
  const [lesson3Complete, setLesson3Complete] = useState(false);
  const [lesson4Complete, setLesson4Complete] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize genesis block
  useEffect(() => {
    async function init() {
      try {
        const genesis = await Block.create(0, 'Genesis Block', '0');
        setBlocks([genesis.toData()]);
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to create genesis block:', error);
      }
    }
    init();
  }, []);

  // Auto-complete lessons based on state
  // Lesson 2 requires at least 3 blocks (Genesis + 2 user records)
  // so that in Lesson 3, Block #1 is truly a "past" record
  useEffect(() => {
    if (currentStep === 2 && blocks.length >= 3 && !lesson2Complete) {
      setLesson2Complete(true);
    }
  }, [currentStep, blocks.length, lesson2Complete]);

  // Handle adding a new block
  const handleAddBlock = useCallback(async () => {
    if (!inputValue.trim() || blocks.length === 0 || isLoading) return;

    setIsLoading(true);
    try {
      const lastBlock = blocks[blocks.length - 1];
      const newBlock = await Block.create(
        blocks.length,
        inputValue.trim(),
        lastBlock.hash,
      );
      const newBlocks = [...blocks, newBlock.toData()];
      setBlocks(newBlocks);
      setInputValue('');

      if (currentStep === 1 && newBlocks.length >= 2) {
        setLesson1Complete(true);
      }
      if (currentStep === 2 && newBlocks.length >= 3) {
        setLesson2Complete(true);
      }
    } catch (error) {
      console.error('Failed to add block:', error);
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, blocks, currentStep, isLoading]);

  const handleStartEdit = useCallback(
    (index: number) => {
      const block = blocks.find((b) => b.index === index);
      if (block) {
        setEditingIndex(index);
        setEditValue(block.data);
      }
    },
    [blocks],
  );

  const handleSaveEdit = useCallback(async () => {
    if (editingIndex === null) return;

    const tamperedBlocks = await Promise.all(
      blocks.map(async (block) => {
        if (block.index === editingIndex) {
          const newHash = await calculateHash(
            block.index,
            block.timestamp,
            editValue,
            block.previousHash,
          );
          return { ...block, data: editValue, hash: newHash };
        }
        return block;
      }),
    );

    setBlocks(tamperedBlocks);
    setTamperedBlockIndex(editingIndex);
    setEditingIndex(null);
    setLesson3Complete(true);
  }, [blocks, editingIndex, editValue]);

  const handleCancelEdit = useCallback(() => {
    setEditingIndex(null);
    setEditValue('');
  }, []);

  // Initialize Lesson 4 nodes
  useEffect(() => {
    if (currentStep === 4 && blocks.length > 0 && nodes.length === 0) {
      const networkNodes: NodeData[] = [
        {
          id: 'you',
          name: t.lesson4.yourNode,
          blocks: [...blocks],
          isTampered: false,
          isRejected: false,
        },
        {
          id: 'a',
          name: `${t.lesson4.nodeLabel} A`,
          blocks: [...blocks],
          isTampered: false,
          isRejected: false,
        },
        {
          id: 'b',
          name: `${t.lesson4.nodeLabel} B`,
          blocks: [...blocks],
          isTampered: false,
          isRejected: false,
        },
        {
          id: 'c',
          name: `${t.lesson4.nodeLabel} C`,
          blocks: [...blocks],
          isTampered: false,
          isRejected: false,
        },
      ];
      setNodes(networkNodes);
      setConsensusReached(false);
      setIsTampering(false);
    }
  }, [
    currentStep,
    blocks,
    nodes.length,
    t.lesson4.nodeLabel,
    t.lesson4.yourNode,
  ]);

  const handleTamperNode = useCallback((nodeId: string) => {
    // Immediately disable all tamper buttons
    setIsTampering(true);

    setNodes((prev) =>
      prev.map((node) => {
        if (node.id === nodeId) {
          const tamperedBlocks = node.blocks.map((block, i) => {
            if (i === 1) {
              return { ...block, data: '💀 HACKED: $9,999,999' };
            }
            return block;
          });
          return { ...node, blocks: tamperedBlocks, isTampered: true };
        }
        return node;
      }),
    );

    setTimeout(() => {
      setNodes((prev) =>
        prev.map((node) =>
          node.isTampered ? { ...node, isRejected: true } : node,
        ),
      );
      setConsensusReached(true);
      setLesson4Complete(true);
    }, 1500);
  }, []);

  const handlePrevious = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as LessonStep);
    }
  }, [currentStep]);

  const handleNext = useCallback(() => {
    if (currentStep < 5) {
      setCurrentStep((currentStep + 1) as LessonStep);

      if (currentStep === 2) {
        setTamperedBlockIndex(null);
        setEditingIndex(null);
      }
      if (currentStep === 3) {
        setNodes([]);
      }
    }
  }, [currentStep]);

  const handleStart = useCallback(() => {
    setCurrentStep(1);
  }, []);

  const handleRestart = useCallback(async () => {
    const genesis = await Block.create(0, 'Genesis Block', '0');
    setBlocks([genesis.toData()]);
    setInputValue('');
    setCurrentStep(0);
    setEditingIndex(null);
    setEditValue('');
    setTamperedBlockIndex(null);
    setNodes([]);
    setConsensusReached(false);
    setIsTampering(false);
    setLesson1Complete(false);
    setLesson2Complete(false);
    setLesson3Complete(false);
    setLesson4Complete(false);
  }, []);

  const canProceed = useMemo(() => {
    switch (currentStep) {
      case 1:
        return lesson1Complete;
      case 2:
        return lesson2Complete;
      case 3:
        return lesson3Complete;
      case 4:
        return lesson4Complete;
      default:
        return false;
    }
  }, [
    currentStep,
    lesson1Complete,
    lesson2Complete,
    lesson3Complete,
    lesson4Complete,
  ]);

  return (
    <div className="relative min-h-[80vh] py-8">
      <NoiseOverlay />

      <LessonProgress currentStep={currentStep} />

      <div className="max-w-4xl mx-auto relative z-10 px-4">
        <AnimatePresence mode="wait">
          {currentStep === 0 && (
            <IntroScreen key="intro" t={t} onStart={handleStart} />
          )}

          {currentStep === 1 && (
            <motion.div
              key="lesson1"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
            >
              <Lesson1
                blocks={blocks}
                onAddBlock={handleAddBlock}
                inputValue={inputValue}
                setInputValue={setInputValue}
                missionComplete={lesson1Complete}
                isLoading={isLoading}
                isInitialized={isInitialized}
                t={t}
              />
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="lesson2"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
            >
              <Lesson2
                blocks={blocks}
                onAddBlock={handleAddBlock}
                inputValue={inputValue}
                setInputValue={setInputValue}
                missionComplete={lesson2Complete}
                isLoading={isLoading}
                t={t}
              />
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="lesson3"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
            >
              <Lesson3
                blocks={blocks}
                editingIndex={editingIndex}
                editValue={editValue}
                setEditValue={setEditValue}
                onStartEdit={handleStartEdit}
                onSaveEdit={handleSaveEdit}
                onCancelEdit={handleCancelEdit}
                tamperedBlockIndex={tamperedBlockIndex}
                missionComplete={lesson3Complete}
                t={t}
              />
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div
              key="lesson4"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
            >
              <Lesson4
                nodes={nodes}
                onTamperNode={handleTamperNode}
                consensusReached={consensusReached}
                missionComplete={lesson4Complete}
                isTampering={isTampering}
                t={t}
              />
            </motion.div>
          )}

          {currentStep === 5 && (
            <motion.div
              key="completion"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <CompletionScreen t={t} onRestart={handleRestart} />
            </motion.div>
          )}
        </AnimatePresence>

        <NavigationButtons
          currentStep={currentStep}
          canProceed={canProceed}
          onPrevious={handlePrevious}
          onNext={handleNext}
          t={t}
        />
      </div>
    </div>
  );
}
