'use client';

import { motion } from 'motion/react';
import { useCallback, useRef, useState } from 'react';

interface VideoDropzoneProps {
  onFileSelect: (file: File | null) => void;
  t: {
    placeholder: string;
    dragActive: string;
  };
}

export function VideoDropzone({ onFileSelect, t }: VideoDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile && droppedFile.type.startsWith('video/')) {
        onFileSelect(droppedFile);
      }
    },
    [onFileSelect],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

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
      className="relative group cursor-pointer"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={handleClick}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.2 }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={handleChange}
      />

      {/* Terminal Style Border Frame */}
      <div
        className={`
          relative transition-all duration-300 border border-[#00ff41]/60
          ${isDragging ? 'opacity-100 border-[#00ff41]' : 'opacity-80 hover:opacity-100'}
        `}
      >
        {/* Corner Decorations */}
        <div className="absolute -top-px -left-px text-[#00ff41] text-[10px] sm:text-xs leading-none">
          ┌
        </div>
        <div className="absolute -top-px -right-px text-[#00ff41] text-[10px] sm:text-xs leading-none">
          ┐
        </div>
        <div className="absolute -bottom-px -left-px text-[#00ff41] text-[10px] sm:text-xs leading-none">
          └
        </div>
        <div className="absolute -bottom-px -right-px text-[#00ff41] text-[10px] sm:text-xs leading-none">
          ┘
        </div>

        {/* Content Area */}
        <div
          className={`
            relative py-12 sm:py-16 px-4 transition-all duration-300
            ${isDragging ? 'bg-[#00ff41]/5' : 'bg-transparent'}
          `}
        >
          {/* Center Content */}
          <div className="relative z-10 flex flex-col items-center text-center px-8">
            {/* ASCII Upload Icon */}
            <motion.pre
              className={`text-[10px] sm:text-xs leading-tight mb-6 transition-colors duration-300 ${
                isDragging ? 'text-[#00ff41]' : 'text-[#00ff41]/50'
              }`}
              animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              {`┌─────────┐
│  ▲▲▲▲▲  │
│  █████  │
│    █    │
│    █    │
│ ─────── │
└─────────┘`}
            </motion.pre>

            {/* Command Line Style Text */}
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2">
                <span className="text-[#00ff41]">{'>'}</span>
                <motion.span
                  className={`text-sm transition-colors duration-300 ${
                    isDragging ? 'text-[#00ff41]' : 'text-[#00ff41]/60'
                  }`}
                >
                  {isDragging ? t.dragActive : t.placeholder}
                </motion.span>
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                  className="text-[#00ff41]"
                >
                  _
                </motion.span>
              </div>

              {/* File Types */}
              <div className="text-[10px] text-[#00ff41]/40 tracking-[0.15em] uppercase">
                [ SUPPORTED: .MP4 | .WEBM | .MOV | .AVI ]
              </div>
            </div>

            {/* Drag Indicator Animation */}
            {isDragging && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="text-[#00ff41] text-6xl opacity-20">⬇</div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Glowing Effect on Drag */}
        {isDragging && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              boxShadow: 'inset 0 0 60px rgba(0, 255, 65, 0.1)',
            }}
          />
        )}
      </div>
    </motion.div>
  );
}
