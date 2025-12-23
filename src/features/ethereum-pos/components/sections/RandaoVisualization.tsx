'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useState } from 'react';

import { useLocale } from '@/i18n/context';

const translations = {
  ko: {
    title: 'RANDAO 메커니즘',
    subtitle: 'Commit-Reveal 방식으로 공정한 난수 생성',
    step1Title: 'Commit Phase',
    step1Desc: '검증인들이 비밀 값의 해시를 제출합니다',
    step2Title: 'Reveal Phase',
    step2Desc: '검증인들이 실제 비밀 값을 공개합니다',
    step3Title: 'Mix Phase',
    step3Desc: '모든 값을 XOR 연산으로 혼합합니다',
    resultTitle: '최종 난수',
    resultDesc: '다음 블록 제안자 선정에 사용됩니다',
    validator: '검증인',
    secret: '비밀 값',
    hash: '해시',
    run: '실행',
    reset: '초기화',
    running: '실행 중...',
  },
  en: {
    title: 'RANDAO Mechanism',
    subtitle: 'Fair randomness through Commit-Reveal scheme',
    step1Title: 'Commit Phase',
    step1Desc: 'Validators submit hash of their secret values',
    step2Title: 'Reveal Phase',
    step2Desc: 'Validators reveal their actual secret values',
    step3Title: 'Mix Phase',
    step3Desc: 'All values are mixed using XOR operation',
    resultTitle: 'Final Random',
    resultDesc: 'Used to select next block proposer',
    validator: 'Validator',
    secret: 'Secret',
    hash: 'Hash',
    run: 'Run',
    reset: 'Reset',
    running: 'Running...',
  },
};

interface ValidatorData {
  id: number;
  secret: string;
  hash: string;
  revealed: boolean;
  committed: boolean;
}

function generateHex(length: number): string {
  const chars = '0123456789abcdef';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

function xorHex(a: string, b: string): string {
  let result = '';
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    const xor = parseInt(a[i], 16) ^ parseInt(b[i], 16);
    result += xor.toString(16);
  }
  return result;
}

export function RandaoVisualization() {
  const locale = useLocale();
  const t = translations[locale];

  const [phase, setPhase] = useState<
    'idle' | 'commit' | 'reveal' | 'mix' | 'done'
  >('idle');
  const [validators, setValidators] = useState<ValidatorData[]>(() =>
    Array.from({ length: 4 }, (_, i) => ({
      id: i + 1,
      secret: generateHex(8),
      hash: generateHex(16),
      revealed: false,
      committed: false,
    })),
  );
  const [finalRandom, setFinalRandom] = useState<string>('');

  const runSimulation = useCallback(async () => {
    // Reset
    setPhase('idle');
    setFinalRandom('');
    const newValidators = Array.from({ length: 4 }, (_, i) => ({
      id: i + 1,
      secret: generateHex(8),
      hash: generateHex(16),
      revealed: false,
      committed: false,
    }));
    setValidators(newValidators);

    await new Promise((r) => setTimeout(r, 300));

    // Commit phase
    setPhase('commit');
    for (let i = 0; i < 4; i++) {
      await new Promise((r) => setTimeout(r, 400));
      setValidators((prev) =>
        prev.map((v, idx) => (idx === i ? { ...v, committed: true } : v)),
      );
    }

    await new Promise((r) => setTimeout(r, 500));

    // Reveal phase
    setPhase('reveal');
    for (let i = 0; i < 4; i++) {
      await new Promise((r) => setTimeout(r, 400));
      setValidators((prev) =>
        prev.map((v, idx) => (idx === i ? { ...v, revealed: true } : v)),
      );
    }

    await new Promise((r) => setTimeout(r, 500));

    // Mix phase
    setPhase('mix');
    await new Promise((r) => setTimeout(r, 800));

    // Calculate final random
    let result = newValidators[0].secret;
    for (let i = 1; i < newValidators.length; i++) {
      result = xorHex(result, newValidators[i].secret);
    }
    setFinalRandom(result + generateHex(8));

    setPhase('done');
  }, []);

  const handleReset = useCallback(() => {
    setPhase('idle');
    setFinalRandom('');
    setValidators(
      Array.from({ length: 4 }, (_, i) => ({
        id: i + 1,
        secret: generateHex(8),
        hash: generateHex(16),
        revealed: false,
        committed: false,
      })),
    );
  }, []);

  const getPhaseColor = (targetPhase: string) => {
    const phases = ['commit', 'reveal', 'mix', 'done'];
    const currentIndex = phases.indexOf(phase);
    const targetIndex = phases.indexOf(targetPhase);

    if (phase === 'idle') return 'text-neutral-600 border-neutral-800';
    if (targetIndex < currentIndex)
      return 'text-emerald-400 border-emerald-400/30';
    if (targetIndex === currentIndex)
      return 'text-amber-400 border-amber-400/50';
    return 'text-neutral-600 border-neutral-800';
  };

  return (
    <div className="not-prose my-8 relative">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-2 h-6 bg-purple-400" />
        <div>
          <h3 className="text-sm font-mono uppercase tracking-wider text-neutral-300">
            {t.title}
          </h3>
          <p className="text-xs text-neutral-500">{t.subtitle}</p>
        </div>
      </div>

      <div className="bg-neutral-950 border border-neutral-800 p-6 space-y-6">
        {/* Phase Indicators */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { key: 'commit', title: t.step1Title, desc: t.step1Desc },
            { key: 'reveal', title: t.step2Title, desc: t.step2Desc },
            { key: 'mix', title: t.step3Title, desc: t.step3Desc },
            { key: 'done', title: t.resultTitle, desc: t.resultDesc },
          ].map((step, idx) => (
            <div
              key={step.key}
              className={`p-3 border transition-colors ${getPhaseColor(step.key)}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="w-5 h-5 flex items-center justify-center bg-neutral-900 text-[10px] font-mono">
                  {idx + 1}
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider">
                  {step.title}
                </span>
              </div>
              <p className="text-[9px] text-neutral-500 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Validators */}
        <div className="space-y-2">
          {validators.map((v) => (
            <motion.div
              key={v.id}
              className="flex items-center gap-4 p-3 bg-neutral-900/50 border border-neutral-800"
              animate={{
                borderColor:
                  (phase === 'commit' && v.committed && !v.revealed) ||
                  (phase === 'reveal' && v.revealed)
                    ? 'rgba(251, 191, 36, 0.5)'
                    : 'rgba(38, 38, 38, 1)',
              }}
            >
              {/* Validator ID */}
              <div className="w-20 flex items-center gap-2">
                <div className="w-6 h-6 bg-purple-400/20 border border-purple-400/30 flex items-center justify-center">
                  <span className="text-[10px] font-mono text-purple-400">
                    V{v.id}
                  </span>
                </div>
                <span className="text-[9px] font-mono text-neutral-500">
                  {t.validator} {v.id}
                </span>
              </div>

              {/* Secret */}
              <div className="flex-1 flex items-center gap-2">
                <span className="text-[9px] font-mono text-neutral-600 w-12">
                  {t.secret}:
                </span>
                <AnimatePresence mode="wait">
                  {v.revealed ? (
                    <motion.span
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="font-mono text-xs text-emerald-400"
                    >
                      0x{v.secret}
                    </motion.span>
                  ) : (
                    <motion.span
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="font-mono text-xs text-neutral-600"
                    >
                      ????????
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              {/* Hash/Commit Status */}
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono text-neutral-600">
                  {t.hash}:
                </span>
                <span
                  className={`font-mono text-[10px] ${v.committed ? 'text-cyan-400' : 'text-neutral-700'}`}
                >
                  {v.committed ? `0x${v.hash.slice(0, 8)}...` : '––––––––'}
                </span>
                {v.committed && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-4 h-4 bg-emerald-400/20 border border-emerald-400/30 flex items-center justify-center"
                  >
                    <svg
                      className="w-2.5 h-2.5 text-emerald-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* XOR Mixing Visualization */}
        <AnimatePresence>
          {(phase === 'mix' || phase === 'done') && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 bg-purple-400/5 border border-purple-400/20">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex items-center gap-2 flex-wrap justify-center">
                    {validators.map((v, idx) => (
                      <div key={v.id} className="flex items-center gap-1">
                        <span className="font-mono text-[10px] text-purple-400">
                          0x{v.secret}
                        </span>
                        {idx < validators.length - 1 && (
                          <span className="text-amber-400 font-mono">XOR</span>
                        )}
                      </div>
                    ))}
                  </div>
                  <span className="text-neutral-600">=</span>
                  <motion.div
                    className="px-4 py-2 bg-emerald-400/10 border border-emerald-400/30"
                    animate={phase === 'mix' ? { opacity: [0.5, 1] } : {}}
                    transition={{
                      duration: 0.3,
                      repeat: phase === 'mix' ? Infinity : 0,
                    }}
                  >
                    <span className="font-mono text-sm text-emerald-400">
                      {phase === 'done' ? `0x${finalRandom}` : '0x????????'}
                    </span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Final Result */}
        <AnimatePresence>
          {phase === 'done' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-emerald-400/10 border border-emerald-400/30 text-center"
            >
              <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider mb-2">
                {t.resultTitle}
              </div>
              <div className="font-mono text-lg text-emerald-400">
                0x{finalRandom}
              </div>
              <p className="text-[10px] text-neutral-500 mt-2">
                {t.resultDesc}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls */}
        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={runSimulation}
            disabled={phase !== 'idle' && phase !== 'done'}
            className="px-4 py-2 font-mono text-[10px] uppercase tracking-wider
                     bg-purple-500 text-neutral-950 hover:bg-purple-400
                     disabled:bg-neutral-700 disabled:text-neutral-500 transition-colors"
          >
            {phase !== 'idle' && phase !== 'done' ? t.running : t.run}
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 font-mono text-[10px] uppercase tracking-wider
                     border border-neutral-700 text-neutral-400 hover:text-neutral-100 hover:border-neutral-500 transition-colors"
          >
            {t.reset}
          </button>
        </div>
      </div>
    </div>
  );
}
