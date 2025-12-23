'use client';

import { motion } from 'motion/react';
import { useCallback, useRef, useState } from 'react';

import { formatBytes } from '../utils/bytes';

interface FileDropzoneProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
  disabled?: boolean;
  t: {
    placeholder: string;
    size: string;
    type: string;
    unknown: string;
  };
}

export function FileDropzone({
  file,
  onFileSelect,
  disabled,
  t,
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (disabled) return;
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) {
        onFileSelect(droppedFile);
      }
    },
    [disabled, onFileSelect],
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) {
        setIsDragging(true);
      }
    },
    [disabled],
  );

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleClick = useCallback(() => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  }, [disabled]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        onFileSelect(selectedFile);
      }
    },
    [onFileSelect],
  );

  return (
    <motion.div
      className={`
        relative group cursor-pointer mb-8 overflow-hidden
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={handleClick}
      whileHover={disabled ? {} : { scale: 1.005 }}
      transition={{ duration: 0.2 }}
    >
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleChange}
        disabled={disabled}
      />

      {/* Main container */}
      <div
        className={`
          relative p-8 sm:p-12 border-2 transition-all duration-300
          ${
            isDragging
              ? 'border-cyan-400 bg-cyan-500/5'
              : file
                ? 'border-neutral-700 bg-neutral-900/50'
                : 'border-dashed border-neutral-700 bg-neutral-900/30 hover:border-neutral-600'
          }
        `}
      >
        {/* Grid pattern background */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, currentColor 1px, transparent 1px),
              linear-gradient(to bottom, currentColor 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
          }}
        />

        {/* Corner brackets */}
        <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-neutral-600 group-hover:border-cyan-500/50 transition-colors" />
        <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-neutral-600 group-hover:border-cyan-500/50 transition-colors" />
        <div className="absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 border-neutral-600 group-hover:border-cyan-500/50 transition-colors" />
        <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-neutral-600 group-hover:border-cyan-500/50 transition-colors" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center">
          {file ? (
            <>
              {/* File icon */}
              <div className="relative mb-6">
                <div className="w-16 h-20 border-2 border-cyan-500/50 bg-neutral-900 flex items-center justify-center">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase">
                    {file.name.split('.').pop()?.slice(0, 4) || 'FILE'}
                  </span>
                </div>
                {/* Fold corner */}
                <div className="absolute -top-[1px] -right-[1px] w-4 h-4 bg-neutral-950 border-l-2 border-b-2 border-cyan-500/50" />
                {/* Status indicator */}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500" />
              </div>

              <p className="font-mono text-sm text-neutral-200 mb-2 break-all max-w-md">
                {file.name}
              </p>

              <div className="flex items-center gap-4 text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                <span>
                  <span className="text-neutral-600">{t.size}:</span>{' '}
                  <span className="text-cyan-400">
                    {formatBytes(file.size)}
                  </span>
                </span>
                <span className="text-neutral-700">|</span>
                <span>
                  <span className="text-neutral-600">{t.type}:</span>{' '}
                  <span className="text-neutral-400">
                    {file.type || t.unknown}
                  </span>
                </span>
              </div>
            </>
          ) : (
            <>
              {/* Upload icon */}
              <div className="relative mb-6">
                <motion.div
                  className="w-16 h-16 border-2 border-dashed border-neutral-600 flex items-center justify-center"
                  animate={
                    isDragging ? { borderColor: '#22d3ee', scale: 1.1 } : {}
                  }
                  transition={{ duration: 0.2 }}
                >
                  <svg
                    className={`w-8 h-8 transition-colors ${isDragging ? 'text-cyan-400' : 'text-neutral-600'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="square"
                      strokeWidth={1.5}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </motion.div>

                {/* Animated dashes when dragging */}
                {isDragging && (
                  <motion.div
                    className="absolute inset-0 border-2 border-cyan-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </div>

              <p className="font-mono text-sm text-neutral-400 mb-2">
                {t.placeholder}
              </p>

              <p className="text-[10px] font-mono uppercase tracking-wider text-neutral-600">
                Drag & Drop / Click to browse
              </p>
            </>
          )}
        </div>

        {/* Dragging overlay */}
        {isDragging && (
          <motion.div
            className="absolute inset-0 bg-cyan-500/5 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </div>

      {/* Bottom status bar */}
      <div className="h-1 bg-neutral-900">
        {file && (
          <motion.div
            className="h-full bg-cyan-500"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        )}
      </div>
    </motion.div>
  );
}
