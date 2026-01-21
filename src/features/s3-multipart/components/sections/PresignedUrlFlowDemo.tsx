'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useState } from 'react';

type Stage = 0 | 1 | 2 | 3 | 4;

const t = {
  title: 'Presigned URL 업로드 플로우',
  subtitle: '프론트엔드에서 S3에 직접 업로드하는 과정',
  frontend: '프론트엔드',
  backend: '백엔드',
  stage1: 'URL 요청',
  stage2: 'URL 생성',
  stage3: 'S3 업로드',
  stage4: '완료',
  clickToStart: '클릭하여 시작',
  responseUrl: 'Presigned URL 응답',
  directUpload: '백엔드를 거치지 않고 S3에 직접 업로드',
  uploadComplete: '업로드 완료!',
  benefit1Title: '트래픽 절감',
  benefit1Desc: '파일이 백엔드를 거치지 않음',
  benefit2Title: '서버 부하 감소',
  benefit2Desc: '백엔드는 URL 생성만 담당',
  restart: '다시 보기',
} as const;

export function PresignedUrlFlowDemo() {
  const [stage, setStage] = useState<Stage>(0);

  const runFullSimulation = useCallback(async () => {
    setStage(0);
    await new Promise((r) => setTimeout(r, 1500));
    setStage(1);
    await new Promise((r) => setTimeout(r, 2000));
    setStage(2);
    await new Promise((r) => setTimeout(r, 2000));
    setStage(3);
    await new Promise((r) => setTimeout(r, 2000));
    setStage(4);
  }, []);

  const handleStart = useCallback(() => {
    runFullSimulation();
  }, [runFullSimulation]);

  return (
    <div className="not-prose my-8 relative">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-2 h-6 bg-violet-400" />
        <div>
          <h3 className="text-sm font-mono uppercase tracking-wider text-foreground">
            {t.title}
          </h3>
          <p className="text-xs text-muted-foreground">{t.subtitle}</p>
        </div>
      </div>

      {/* Main visualization */}
      <div className="bg-card border border-border overflow-hidden">
        {/* Stage indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-border">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`py-2 px-3 text-center transition-colors ${
                stage >= s
                  ? 'bg-violet-500/10 border-b-2 border-violet-400'
                  : 'bg-muted/50'
              }`}
            >
              <div
                className={`text-[9px] font-mono ${
                  stage >= s ? 'text-violet-400' : 'text-muted-foreground/60'
                }`}
              >
                {s === 1 && t.stage1}
                {s === 2 && t.stage2}
                {s === 3 && t.stage3}
                {s === 4 && t.stage4}
              </div>
            </div>
          ))}
        </div>

        {/* Visualization area */}
        <div className="p-6 min-h-[320px] relative">
          {/* Entities */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-8">
            {/* Frontend */}
            <div className="text-center">
              <div
                className={`w-20 h-20 border flex items-center justify-center mb-2 transition-colors ${
                  stage >= 1
                    ? 'bg-cyan-500/10 border-cyan-500/50'
                    : 'bg-muted border-border'
                }`}
              >
                <svg
                  className={`w-8 h-8 transition-colors ${
                    stage >= 1 ? 'text-cyan-400' : 'text-muted-foreground'
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="text-[10px] text-muted-foreground">
                {t.frontend}
              </div>
            </div>

            {/* Backend */}
            <div className="text-center">
              <div
                className={`w-20 h-20 border flex items-center justify-center mb-2 transition-colors ${
                  stage >= 2
                    ? 'bg-violet-500/10 border-violet-500/50'
                    : 'bg-muted border-border'
                }`}
              >
                <svg
                  className={`w-8 h-8 transition-colors ${
                    stage >= 2 ? 'text-violet-400' : 'text-muted-foreground'
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
                  />
                </svg>
              </div>
              <div className="text-[10px] text-muted-foreground">
                {t.backend}
              </div>
            </div>

            {/* S3 */}
            <div className="text-center">
              <div
                className={`w-20 h-20 border flex items-center justify-center mb-2 transition-colors ${
                  stage >= 3
                    ? 'bg-amber-500/10 border-amber-500/50'
                    : 'bg-muted border-border'
                }`}
              >
                <span
                  className={`font-mono text-lg font-bold transition-colors ${
                    stage >= 3 ? 'text-amber-400' : 'text-muted-foreground'
                  }`}
                >
                  S3
                </span>
              </div>
              <div className="text-[10px] text-muted-foreground">AWS S3</div>
            </div>
          </div>

          {/* Flow animations */}
          <AnimatePresence mode="wait">
            {/* Stage 0: Initial */}
            {stage === 0 && (
              <motion.div
                key="stage0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center"
              >
                <button
                  onClick={handleStart}
                  className="px-6 py-2 bg-violet-500 text-background font-mono text-sm uppercase tracking-wider
                           hover:bg-violet-400 transition-colors"
                >
                  {t.clickToStart}
                </button>
              </motion.div>
            )}

            {/* Stage 1: Request Presigned URL */}
            {stage === 1 && (
              <motion.div
                key="stage1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-4"
              >
                <motion.div
                  initial={{ x: -60, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="flex items-center gap-2"
                >
                  <motion.div
                    animate={{ x: [0, 40, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-3 h-3 bg-cyan-400 rounded-full"
                  />
                  <span className="text-[10px] font-mono text-cyan-400">
                    POST /api/get-upload-url
                  </span>
                </motion.div>
                <div className="bg-muted/50 border border-border p-3 text-[10px] font-mono">
                  <div className="text-muted-foreground">
                    {`{ filename: "photo.jpg", contentType: "image/jpeg" }`}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Stage 2: Backend generates Presigned URL */}
            {stage === 2 && (
              <motion.div
                key="stage2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-4"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center gap-2"
                >
                  <span className="text-[10px] font-mono text-violet-400">
                    getSignedUrl(s3Client, command)
                  </span>
                </motion.div>
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-violet-500/10 border border-violet-500/30 p-3 max-w-full overflow-hidden"
                >
                  <div className="text-[9px] font-mono text-violet-400 truncate">
                    https://bucket.s3.amazonaws.com/photo.jpg?
                    <span className="text-muted-foreground">
                      X-Amz-Signature=abc123...
                    </span>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ x: 60, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center gap-2"
                >
                  <motion.div
                    animate={{ x: [0, -40, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-3 h-3 bg-violet-400 rounded-full"
                  />
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {t.responseUrl}
                  </span>
                </motion.div>
              </motion.div>
            )}

            {/* Stage 3: Direct upload to S3 */}
            {stage === 3 && (
              <motion.div
                key="stage3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-4"
              >
                <motion.div
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="flex items-center gap-3"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-8 bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
                      <span className="text-[9px] text-cyan-400 font-mono">
                        FILE
                      </span>
                    </div>
                    <motion.div
                      animate={{ x: [0, 60, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="flex items-center gap-1"
                    >
                      <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                      <div className="w-2 h-2 bg-cyan-400/60 rounded-full" />
                      <div className="w-2 h-2 bg-cyan-400/30 rounded-full" />
                    </motion.div>
                  </div>
                </motion.div>
                <div className="text-[10px] font-mono text-amber-400">
                  PUT presignedUrl + File body
                </div>
                <div className="text-[9px] text-muted-foreground">
                  {t.directUpload}
                </div>
              </motion.div>
            )}

            {/* Stage 4: Complete */}
            {stage === 4 && (
              <motion.div
                key="stage4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="w-16 h-16 bg-emerald-500/20 border-2 border-emerald-500/50 rounded-full flex items-center justify-center"
                >
                  <svg
                    className="w-8 h-8 text-emerald-400"
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
                <div className="text-xs text-emerald-400 font-mono">
                  {t.uploadComplete}
                </div>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-[10px]">
                  <div className="bg-emerald-500/10 border border-emerald-500/30 p-3">
                    <div className="text-emerald-400 font-mono mb-1">
                      {t.benefit1Title}
                    </div>
                    <div className="text-muted-foreground">
                      {t.benefit1Desc}
                    </div>
                  </div>
                  <div className="bg-emerald-500/10 border border-emerald-500/30 p-3">
                    <div className="text-emerald-400 font-mono mb-1">
                      {t.benefit2Title}
                    </div>
                    <div className="text-muted-foreground">
                      {t.benefit2Desc}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Control button */}
        {stage === 4 && (
          <div className="border-t border-border p-4 flex justify-center">
            <button
              onClick={handleStart}
              className="px-6 py-2 bg-violet-500 text-background font-mono text-sm uppercase tracking-wider
                       hover:bg-violet-400 transition-colors"
            >
              {t.restart}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
