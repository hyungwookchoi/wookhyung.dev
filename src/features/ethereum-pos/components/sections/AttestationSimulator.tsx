'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useState } from 'react';

import { useLocale } from '@/i18n/context';

const translations = {
  ko: {
    title: '위원회 & 증명 시뮬레이터',
    subtitle: '검증인들의 투표 과정을 시각화합니다',
    validators: '전체 검증인',
    committee: '위원회',
    proposer: '제안자',
    attesters: '증명인',
    block: '블록',
    attestation: '증명',
    status: {
      idle: '대기 중',
      waiting: '대기 중',
      proposed: '블록 제안됨',
      attesting: '증명 수집 중',
      justified: '정당화됨',
    },
    votes: '투표',
    threshold: '임계값 (2/3)',
    shuffleCommittee: '위원회 셔플',
    proposeBlock: '블록 제안',
    collectAttestations: '증명 수집',
    reset: '초기화',
  },
  en: {
    title: 'Committee & Attestation Simulator',
    subtitle: 'Visualize the validator voting process',
    validators: 'All Validators',
    committee: 'Committee',
    proposer: 'Proposer',
    attesters: 'Attesters',
    block: 'Block',
    attestation: 'Attestation',
    status: {
      idle: 'Waiting',
      waiting: 'Waiting',
      proposed: 'Block Proposed',
      attesting: 'Collecting Attestations',
      justified: 'Justified',
    },
    votes: 'Votes',
    threshold: 'Threshold (2/3)',
    shuffleCommittee: 'Shuffle Committee',
    proposeBlock: 'Propose Block',
    collectAttestations: 'Collect Attestations',
    reset: 'Reset',
  },
};

interface Validator {
  id: number;
  isProposer: boolean;
  isCommitteeMember: boolean;
  hasAttested: boolean;
}

export function AttestationSimulator() {
  const locale = useLocale();
  const t = translations[locale];

  const TOTAL_VALIDATORS = 16;
  const COMMITTEE_SIZE = 8;
  const THRESHOLD = Math.ceil((COMMITTEE_SIZE * 2) / 3);

  const [validators, setValidators] = useState<Validator[]>(() =>
    Array.from({ length: TOTAL_VALIDATORS }, (_, i) => ({
      id: i + 1,
      isProposer: false,
      isCommitteeMember: false,
      hasAttested: false,
    })),
  );
  const [phase, setPhase] = useState<
    'idle' | 'shuffled' | 'proposed' | 'attesting' | 'justified'
  >('idle');
  const [attestationCount, setAttestationCount] = useState(0);

  const shuffleCommittee = useCallback(() => {
    const shuffled = [...Array(TOTAL_VALIDATORS).keys()].sort(
      () => Math.random() - 0.5,
    );
    const committeeIds = shuffled.slice(0, COMMITTEE_SIZE);
    const proposerId = committeeIds[0];

    setValidators(
      Array.from({ length: TOTAL_VALIDATORS }, (_, i) => ({
        id: i + 1,
        isProposer: i + 1 === proposerId + 1,
        isCommitteeMember: committeeIds.includes(i),
        hasAttested: false,
      })),
    );
    setPhase('shuffled');
    setAttestationCount(0);
  }, []);

  const proposeBlock = useCallback(() => {
    setPhase('proposed');
  }, []);

  const collectAttestations = useCallback(async () => {
    setPhase('attesting');
    const committeeMembers = validators.filter(
      (v) => v.isCommitteeMember && !v.isProposer,
    );

    for (let i = 0; i < committeeMembers.length; i++) {
      await new Promise((r) => setTimeout(r, 300));
      setValidators((prev) =>
        prev.map((v) =>
          v.id === committeeMembers[i].id ? { ...v, hasAttested: true } : v,
        ),
      );
      setAttestationCount((c) => c + 1);
    }

    await new Promise((r) => setTimeout(r, 500));
    setPhase('justified');
  }, [validators]);

  const reset = useCallback(() => {
    setValidators(
      Array.from({ length: TOTAL_VALIDATORS }, (_, i) => ({
        id: i + 1,
        isProposer: false,
        isCommitteeMember: false,
        hasAttested: false,
      })),
    );
    setPhase('idle');
    setAttestationCount(0);
  }, []);

  const committee = validators.filter((v) => v.isCommitteeMember);
  const proposer = validators.find((v) => v.isProposer);

  return (
    <div className="not-prose my-8 relative">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-2 h-6 bg-amber-400" />
        <div>
          <h3 className="text-sm font-mono uppercase tracking-wider text-foreground">
            {t.title}
          </h3>
          <p className="text-xs text-muted-foreground">{t.subtitle}</p>
        </div>
      </div>

      <div className="bg-card border border-border p-6 space-y-6">
        {/* Status Bar */}
        <div className="flex items-center justify-between p-3 bg-muted/50 border border-border">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                phase === 'justified'
                  ? 'bg-emerald-400'
                  : phase === 'attesting'
                    ? 'bg-amber-400 animate-pulse'
                    : 'bg-muted-foreground/60'
              }`}
            />
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              {t.status[phase === 'shuffled' ? 'waiting' : phase]}
            </span>
          </div>
          {phase !== 'idle' && (
            <div className="text-[10px] font-mono text-muted-foreground">
              {t.votes}: {attestationCount}/{COMMITTEE_SIZE - 1} ({t.threshold}:{' '}
              {THRESHOLD - 1})
            </div>
          )}
        </div>

        {/* Validator Grid */}
        <div className="space-y-4">
          <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
            {t.validators} ({TOTAL_VALIDATORS})
          </div>
          <div className="grid grid-cols-8 gap-2">
            {validators.map((v) => (
              <motion.div
                key={v.id}
                className={`
                  aspect-square flex items-center justify-center
                  font-mono text-xs transition-all duration-300
                  ${
                    v.isProposer
                      ? 'bg-amber-400/20 border-2 border-amber-400 text-amber-400'
                      : v.hasAttested
                        ? 'bg-emerald-400/20 border border-emerald-400/50 text-emerald-400'
                        : v.isCommitteeMember
                          ? 'bg-cyan-400/10 border border-cyan-400/30 text-cyan-400'
                          : 'bg-muted/50 border border-border text-muted-foreground/60'
                  }
                `}
                animate={
                  v.isProposer && phase === 'proposed'
                    ? { scale: [1, 1.1, 1] }
                    : v.hasAttested
                      ? { scale: [1.2, 1] }
                      : {}
                }
                transition={{ duration: 0.3 }}
              >
                {v.id}
              </motion.div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 text-[9px] font-mono text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-amber-400/20 border-2 border-amber-400" />
              <span>{t.proposer}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-cyan-400/10 border border-cyan-400/30" />
              <span>{t.committee}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-emerald-400/20 border border-emerald-400/50" />
              <span>{t.attestation}</span>
            </div>
          </div>
        </div>

        {/* Committee Panel */}
        <AnimatePresence>
          {phase !== 'idle' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 bg-muted/30 border border-border space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                    {t.committee} ({committee.length})
                  </span>
                  {proposer && (
                    <span className="text-[10px] font-mono text-amber-400">
                      {t.proposer}: V{proposer.id}
                    </span>
                  )}
                </div>

                {/* Block Proposal Visualization */}
                {phase !== 'shuffled' && (
                  <div className="flex items-center gap-4">
                    {/* Proposer */}
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-10 h-10 bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center">
                        <span className="font-mono text-sm text-amber-400">
                          V{proposer?.id}
                        </span>
                      </div>
                      <span className="text-[8px] font-mono text-muted-foreground">
                        {t.proposer}
                      </span>
                    </div>

                    {/* Arrow */}
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: 40 }}
                      className="h-0.5 bg-gradient-to-r from-amber-400 to-cyan-400"
                    />

                    {/* Block */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex flex-col items-center gap-1"
                    >
                      <div className="w-12 h-10 bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center">
                        <span className="font-mono text-[10px] text-cyan-400">
                          {t.block}
                        </span>
                      </div>
                    </motion.div>

                    {/* Attesters */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="flex items-center gap-1"
                    >
                      {committee
                        .filter((v) => !v.isProposer)
                        .map((v) => (
                          <motion.div
                            key={v.id}
                            className={`w-6 h-6 flex items-center justify-center font-mono text-[9px] transition-colors ${
                              v.hasAttested
                                ? 'bg-emerald-400/20 border border-emerald-400/50 text-emerald-400'
                                : 'bg-border border border-border text-muted-foreground'
                            }`}
                          >
                            {v.id}
                          </motion.div>
                        ))}
                    </motion.div>
                  </div>
                )}

                {/* Progress Bar */}
                {phase === 'attesting' || phase === 'justified' ? (
                  <div className="space-y-2">
                    <div className="flex justify-between text-[9px] font-mono text-muted-foreground">
                      <span>{t.attestation}</span>
                      <span>
                        {attestationCount}/{COMMITTEE_SIZE - 1}
                      </span>
                    </div>
                    <div className="h-2 bg-border relative overflow-hidden">
                      <motion.div
                        className="h-full bg-emerald-400"
                        initial={{ width: 0 }}
                        animate={{
                          width: `${(attestationCount / (COMMITTEE_SIZE - 1)) * 100}%`,
                        }}
                      />
                      {/* Threshold marker */}
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-amber-400"
                        style={{
                          left: `${((THRESHOLD - 1) / (COMMITTEE_SIZE - 1)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ) : null}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Justified Result */}
        <AnimatePresence>
          {phase === 'justified' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-emerald-400/10 border border-emerald-400/30 text-center"
            >
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="w-5 h-5 text-emerald-400"
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
                <span className="font-mono text-sm text-emerald-400 uppercase tracking-wider">
                  {t.status.justified}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <button
            onClick={shuffleCommittee}
            disabled={phase === 'attesting'}
            className="px-4 py-2 font-mono text-[10px] uppercase tracking-wider
                     bg-cyan-500 text-background hover:bg-cyan-400
                     disabled:bg-muted disabled:text-muted-foreground transition-colors"
          >
            {t.shuffleCommittee}
          </button>
          <button
            onClick={proposeBlock}
            disabled={phase !== 'shuffled'}
            className="px-4 py-2 font-mono text-[10px] uppercase tracking-wider
                     bg-amber-500 text-background hover:bg-amber-400
                     disabled:bg-muted disabled:text-muted-foreground transition-colors"
          >
            {t.proposeBlock}
          </button>
          <button
            onClick={collectAttestations}
            disabled={phase !== 'proposed'}
            className="px-4 py-2 font-mono text-[10px] uppercase tracking-wider
                     bg-emerald-500 text-background hover:bg-emerald-400
                     disabled:bg-muted disabled:text-muted-foreground transition-colors"
          >
            {t.collectAttestations}
          </button>
          <button
            onClick={reset}
            className="px-4 py-2 font-mono text-[10px] uppercase tracking-wider
                     border border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground transition-colors"
          >
            {t.reset}
          </button>
        </div>
      </div>
    </div>
  );
}
