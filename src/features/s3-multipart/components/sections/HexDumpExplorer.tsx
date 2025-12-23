'use client';

import { motion } from 'motion/react';
import { useCallback, useMemo, useRef, useState } from 'react';

import { useLocale } from '@/i18n/context';

import { getTranslations } from '../../constants/translations';
import { useOptionalSharedFile } from '../../contexts/FileContext';
import { formatBytes } from '../../utils/bytes';

const BYTES_PER_ROW = 16;
const INITIAL_ROWS = 8;
const LOAD_MORE_ROWS = 8;

export function HexDumpExplorer() {
  const locale = useLocale();
  const t = getTranslations(locale).hexExplorer;
  const sharedFile = useOptionalSharedFile();

  const [localFile, setLocalFile] = useState<File | null>(null);
  const [localBytes, setLocalBytes] = useState<Uint8Array | null>(null);
  const [visibleRows, setVisibleRows] = useState(INITIAL_ROWS);
  const [selectedByte, setSelectedByte] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const file = sharedFile?.file ?? localFile;
  const fileBytes = sharedFile?.fileBytes ?? localBytes;
  const isLoading = sharedFile?.isLoading ?? false;

  const handleLocalFile = useCallback(async (selectedFile: File) => {
    setLocalFile(selectedFile);
    const buffer = await selectedFile.arrayBuffer();
    setLocalBytes(new Uint8Array(buffer));
    setVisibleRows(INITIAL_ROWS);
  }, []);

  const handleFileSelect = useCallback(
    (newFile: File | null) => {
      if (!newFile) return;

      if (sharedFile) {
        sharedFile.setFile(newFile);
      } else {
        handleLocalFile(newFile);
      }
    },
    [sharedFile, handleLocalFile],
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

  const rows = useMemo(() => {
    if (!fileBytes) return [];

    const result = [];
    const maxBytes = visibleRows * BYTES_PER_ROW;

    for (
      let i = 0;
      i < Math.min(fileBytes.length, maxBytes);
      i += BYTES_PER_ROW
    ) {
      const rowBytes = fileBytes.slice(
        i,
        Math.min(i + BYTES_PER_ROW, fileBytes.length),
      );
      result.push({
        offset: i,
        bytes: Array.from(rowBytes),
      });
    }

    return result;
  }, [fileBytes, visibleRows]);

  const totalBytes = fileBytes?.length ?? 0;
  const visibleBytes = Math.min(visibleRows * BYTES_PER_ROW, totalBytes);
  const hasMore = visibleBytes < totalBytes;

  const loadMore = () => {
    setVisibleRows((v) => v + LOAD_MORE_ROWS);
  };

  const byteToAscii = (byte: number): string => {
    return byte >= 32 && byte <= 126 ? String.fromCharCode(byte) : '.';
  };

  return (
    <div className="not-prose my-8 relative">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-2 h-6 bg-emerald-400" />
        <div>
          <h3 className="text-sm font-mono uppercase tracking-wider text-foreground">
            {t.title}
          </h3>
          <p className="text-xs text-muted-foreground">{t.subtitle}</p>
        </div>
      </div>

      <div className="bg-card border border-border overflow-hidden">
        {/* File dropzone or info */}
        {!file ? (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onClick={() => fileInputRef.current?.click()}
            className={`p-8 cursor-pointer transition-colors ${
              isDragging ? 'bg-emerald-500/10' : 'hover:bg-muted'
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
            <div className="flex flex-col items-center gap-3 text-center">
              <div
                className={`w-16 h-16 border-2 border-dashed flex items-center justify-center transition-colors ${
                  isDragging ? 'border-emerald-400' : 'border-border'
                }`}
              >
                <svg
                  className={`w-8 h-8 ${isDragging ? 'text-emerald-400' : 'text-muted-foreground/60'}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <div className="text-sm text-muted-foreground">
                {t.selectFile}
              </div>
              <div className="text-[10px] text-muted-foreground/60">
                {t.dropHere}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* File info bar */}
            <div className="px-4 py-3 bg-muted/50 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-emerald-500 animate-pulse" />
                <span className="text-sm text-foreground font-mono">
                  {file.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatBytes(file.size)}
                </span>
              </div>
              <button
                onClick={() => {
                  if (sharedFile) {
                    sharedFile.setFile(null);
                  } else {
                    setLocalFile(null);
                    setLocalBytes(null);
                  }
                }}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {locale === 'ko' ? '다른 파일' : 'Change'}
              </button>
            </div>

            {/* Hex dump table */}
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground">
                {locale === 'ko' ? '로딩 중...' : 'Loading...'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                {/* Header row */}
                <div className="flex items-center px-4 py-2 bg-muted/30 border-b border-border text-[9px] font-mono text-muted-foreground/60 uppercase tracking-wider">
                  <div className="w-20 shrink-0">{t.offset}</div>
                  <div className="flex-1">{t.hexValues}</div>
                  <div className="w-36 shrink-0 text-right">{t.ascii}</div>
                </div>

                {/* Data rows */}
                <div className="divide-y divide-border/50">
                  {rows.map((row, rowIndex) => (
                    <motion.div
                      key={row.offset}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: rowIndex * 0.02 }}
                      className="flex items-center px-4 py-1.5 hover:bg-muted/30"
                    >
                      {/* Offset */}
                      <div className="w-20 shrink-0 font-mono text-[10px] text-muted-foreground/60">
                        {row.offset.toString(16).padStart(8, '0')}
                      </div>

                      {/* Hex values */}
                      <div className="flex-1 flex flex-wrap gap-x-1 gap-y-0.5">
                        {row.bytes.map((byte, i) => {
                          const globalIndex = row.offset + i;
                          const isSelected = selectedByte === globalIndex;
                          return (
                            <button
                              key={i}
                              onMouseEnter={() => setSelectedByte(globalIndex)}
                              onMouseLeave={() => setSelectedByte(null)}
                              className={`font-mono text-[10px] px-1 py-0.5 transition-colors ${
                                isSelected
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : 'text-cyan-400 hover:bg-border'
                              }`}
                            >
                              {byte.toString(16).padStart(2, '0')}
                            </button>
                          );
                        })}
                        {/* Padding for incomplete rows */}
                        {row.bytes.length < BYTES_PER_ROW &&
                          Array(BYTES_PER_ROW - row.bytes.length)
                            .fill(0)
                            .map((_, i) => (
                              <span
                                key={`pad-${i}`}
                                className="font-mono text-[10px] px-1 py-0.5 text-transparent"
                              >
                                00
                              </span>
                            ))}
                      </div>

                      {/* ASCII */}
                      <div className="w-36 shrink-0 text-right font-mono text-[10px] text-muted-foreground">
                        {row.bytes.map((byte, i) => {
                          const globalIndex = row.offset + i;
                          const isSelected = selectedByte === globalIndex;
                          return (
                            <span
                              key={i}
                              className={isSelected ? 'text-emerald-400' : ''}
                            >
                              {byteToAscii(byte)}
                            </span>
                          );
                        })}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Load more / status */}
                <div className="px-4 py-3 bg-muted/30 border-t border-border flex items-center justify-between">
                  <div className="text-[10px] text-muted-foreground font-mono">
                    {t.showingBytes} {visibleBytes.toLocaleString()} {t.of}{' '}
                    {totalBytes.toLocaleString()} {t.bytes}
                  </div>
                  {hasMore && (
                    <button
                      onClick={loadMore}
                      className="px-3 py-1.5 bg-border text-muted-foreground text-[10px] font-mono
                               hover:bg-muted transition-colors"
                    >
                      {t.loadMore}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Selected byte details */}
            {selectedByte !== null &&
              fileBytes &&
              fileBytes[selectedByte] !== undefined && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="px-4 py-3 bg-emerald-500/5 border-t border-emerald-500/20"
                >
                  <div className="flex flex-wrap items-center gap-4 text-[10px] font-mono">
                    <div>
                      <span className="text-muted-foreground">
                        {t.offset}:{' '}
                      </span>
                      <span className="text-emerald-400">
                        0x{selectedByte.toString(16).padStart(8, '0')}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        {t.hexValues}:{' '}
                      </span>
                      <span className="text-cyan-400">
                        0x
                        {fileBytes[selectedByte].toString(16).padStart(2, '0')}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        {t.decimal}:{' '}
                      </span>
                      <span className="text-amber-400">
                        {fileBytes[selectedByte]}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        {t.binary}:{' '}
                      </span>
                      <span className="text-rose-400">
                        {fileBytes[selectedByte].toString(2).padStart(8, '0')}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">{t.ascii}: </span>
                      <span className="text-foreground">
                        &apos;{byteToAscii(fileBytes[selectedByte])}&apos;
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
          </>
        )}
      </div>
    </div>
  );
}
