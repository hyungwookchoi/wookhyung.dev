'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useRef, useState } from 'react';

import { useLocale } from '@/i18n/context';

import { getTranslations } from '../../constants/translations';
import { useOptionalSharedFile } from '../../contexts/FileContext';
import { calculateHash, formatBytes } from '../../utils/bytes';

interface VerificationResult {
  originalHash: string;
  reconstructedHash: string;
  isMatch: boolean;
  reconstructedBlob: Blob;
}

export function MultipartVerifier() {
  const locale = useLocale();
  const t = getTranslations(locale).verifier;
  const sharedFile = useOptionalSharedFile();

  const [localFile, setLocalFile] = useState<File | null>(null);
  const [partCount, setPartCount] = useState(3);
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const file = sharedFile?.file ?? localFile;

  const handleFileSelect = useCallback(
    (newFile: File | null) => {
      if (!newFile) return;
      setResult(null);

      if (sharedFile) {
        sharedFile.setFile(newFile);
      } else {
        setLocalFile(newFile);
      }
    },
    [sharedFile],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) {
        handleFileSelect(droppedFile);
      }
    },
    [handleFileSelect],
  );

  const verify = useCallback(async () => {
    if (!file) return;

    setIsVerifying(true);
    setResult(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const fileBytes = new Uint8Array(arrayBuffer);
      const originalHash = await calculateHash(arrayBuffer);

      const partSize = Math.ceil(fileBytes.length / partCount);
      const parts: Uint8Array[] = [];

      for (let i = 0; i < partCount; i++) {
        const start = i * partSize;
        const end = Math.min(start + partSize, fileBytes.length);
        parts.push(fileBytes.slice(start, end));
      }

      await new Promise((resolve) => setTimeout(resolve, 500));

      const totalSize = parts.reduce((sum, part) => sum + part.length, 0);
      const merged = new Uint8Array(totalSize);
      let offset = 0;
      for (const part of parts) {
        merged.set(part, offset);
        offset += part.length;
      }

      const reconstructedHash = await calculateHash(merged.buffer);
      const reconstructedBlob = new Blob([merged], { type: file.type });

      setResult({
        originalHash,
        reconstructedHash,
        isMatch: originalHash === reconstructedHash,
        reconstructedBlob,
      });
    } catch (error) {
      console.error('Verification failed:', error);
    } finally {
      setIsVerifying(false);
    }
  }, [file, partCount]);

  const downloadFile = useCallback(() => {
    if (!result || !file) return;

    const url = URL.createObjectURL(result.reconstructedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reconstructed_${file.name}`;
    a.click();
    URL.revokeObjectURL(url);
  }, [result, file]);

  return (
    <div className="not-prose my-8 relative">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-2 h-6 bg-rose-400" />
        <div>
          <h3 className="text-sm font-mono uppercase tracking-wider text-foreground">
            {t.title}
          </h3>
          <p className="text-xs text-muted-foreground">{t.subtitle}</p>
        </div>
      </div>

      <div className="bg-card border border-border overflow-hidden">
        {/* File selection or info */}
        {!file ? (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onClick={() => fileInputRef.current?.click()}
            className={`p-6 cursor-pointer transition-colors ${
              isDragging ? 'bg-rose-500/10' : 'hover:bg-muted'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFileSelect(f);
              }}
            />
            <div className="flex items-center justify-center gap-4">
              <div
                className={`w-12 h-12 border-2 border-dashed flex items-center justify-center transition-colors ${
                  isDragging ? 'border-rose-400' : 'border-border'
                }`}
              >
                <svg
                  className={`w-6 h-6 ${isDragging ? 'text-rose-400' : 'text-muted-foreground/60'}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="text-sm text-muted-foreground">
                {t.selectFile}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* File info and controls */}
            <div className="p-4 border-b border-border">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* File info */}
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-12 bg-muted border border-border flex items-center justify-center">
                    <span className="text-[8px] font-mono text-muted-foreground uppercase">
                      {file.name.split('.').pop()?.slice(0, 4) || 'FILE'}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm text-foreground font-mono truncate max-w-[200px]">
                      {file.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatBytes(file.size)}
                    </div>
                  </div>
                </div>

                {/* Part count selector */}
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase">
                    {t.partCount}
                  </span>
                  <div className="flex items-center gap-1">
                    {[2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        onClick={() => {
                          setPartCount(n);
                          setResult(null);
                        }}
                        disabled={isVerifying}
                        className={`w-8 h-8 font-mono text-sm transition-colors ${
                          partCount === n
                            ? 'bg-rose-500 text-background'
                            : 'bg-border text-muted-foreground hover:bg-muted'
                        } disabled:opacity-50`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Verify button */}
                <button
                  onClick={verify}
                  disabled={isVerifying}
                  className="px-6 py-2 bg-rose-500 text-background font-mono text-sm uppercase tracking-wider
                           hover:bg-rose-400 disabled:bg-muted disabled:text-muted-foreground transition-colors"
                >
                  {isVerifying ? t.verifying : t.splitAndMerge}
                </button>
              </div>
            </div>

            {/* Result */}
            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 space-y-4">
                    {/* Hash comparison */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      {/* Original hash */}
                      <div className="p-3 bg-muted border border-border">
                        <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-2">
                          {t.originalHash}
                        </div>
                        <div className="font-mono text-[9px] text-cyan-400 break-all">
                          {result.originalHash}
                        </div>
                      </div>

                      {/* Reconstructed hash */}
                      <div
                        className={`p-3 bg-muted border ${
                          result.isMatch
                            ? 'border-emerald-500/50'
                            : 'border-red-500/50'
                        }`}
                      >
                        <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-2">
                          {t.reconstructedHash}
                        </div>
                        <div
                          className={`font-mono text-[9px] break-all ${
                            result.isMatch ? 'text-emerald-400' : 'text-red-400'
                          }`}
                        >
                          {result.reconstructedHash}
                        </div>
                      </div>
                    </div>

                    {/* Result status */}
                    <div
                      className={`p-4 text-center ${
                        result.isMatch
                          ? 'bg-emerald-500/10 border border-emerald-500/30'
                          : 'bg-red-500/10 border border-red-500/30'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-3">
                        {result.isMatch ? (
                          <>
                            <div className="w-8 h-8 border-2 border-emerald-500 flex items-center justify-center">
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
                            </div>
                            <span className="text-emerald-400 font-mono uppercase tracking-wider">
                              {t.match}
                            </span>
                          </>
                        ) : (
                          <>
                            <div className="w-8 h-8 border-2 border-red-500 flex items-center justify-center">
                              <svg
                                className="w-5 h-5 text-red-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </div>
                            <span className="text-red-400 font-mono uppercase tracking-wider">
                              {t.mismatch}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Download button */}
                    {result.isMatch && (
                      <div className="flex justify-center">
                        <button
                          onClick={downloadFile}
                          className="px-6 py-2 bg-emerald-500 text-background font-mono text-sm uppercase tracking-wider
                                   hover:bg-emerald-400 transition-colors flex items-center gap-2"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V3"
                            />
                          </svg>
                          {t.downloadFile}
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
}
