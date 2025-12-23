'use client';

import { motion } from 'motion/react';
import { useCallback, useRef } from 'react';

import { useLocale } from '@/i18n/context';

import { getTranslations } from '../constants/translations';
import { useAsciiRenderer } from '../hooks/useAsciiRenderer';
import { useVideoProcessor } from '../hooks/useVideoProcessor';
import { useVideoRecorder } from '../hooks/useVideoRecorder';
import { AsciiCanvas, AsciiCanvasHandle } from './AsciiCanvas';
import { PlaybackControls } from './PlaybackControls';
import { VideoDropzone } from './VideoDropzone';

const DEFAULT_VIDEO_URL = '/videos/reze-dance.mp4';

export function AsciiVideoConverter() {
  const locale = useLocale();
  const t = getTranslations(locale);

  const asciiCanvasRef = useRef<AsciiCanvasHandle>(null);

  const {
    videoFile,
    isLoaded,
    isPlaying,
    videoRef,
    videoSrc,
    setVideoFile,
    play,
    pause,
    reset,
  } = useVideoProcessor(DEFAULT_VIDEO_URL);

  const { asciiFrame } = useAsciiRenderer(videoRef, isPlaying);
  const { isRecording, startRecording, stopRecording } = useVideoRecorder();

  const handleRecord = useCallback(() => {
    const canvas = asciiCanvasRef.current?.getCanvas();
    if (canvas) {
      startRecording(canvas);
      play();
    }
  }, [startRecording, play]);

  const handleStopRecord = useCallback(() => {
    stopRecording();
    pause();
  }, [stopRecording, pause]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      className="not-prose my-12 relative"
      style={{ fontFamily: "'JetBrains Mono', monospace" }}
    >
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&display=swap"
        rel="stylesheet"
      />

      {/* Main Terminal Window */}
      <div className="relative bg-[#0a0a0a] border border-[#00ff41]/30 overflow-hidden">
        {/* Noise Texture Overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03] z-50"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Scanline Effect */}
        <div
          className="absolute inset-0 pointer-events-none z-40 opacity-[0.04]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.1) 2px, rgba(0,255,65,0.1) 4px)',
          }}
        />

        {/* Terminal Header Bar */}
        <div className="relative z-10 flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 border-b border-[#00ff41]/20 bg-[#0a0a0a]">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Terminal Dots */}
            <div className="flex gap-1.5 sm:gap-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#ff5f56] opacity-80" />
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#ffbd2e] opacity-80" />
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#27ca40] opacity-80" />
            </div>
            {/* Title */}
            <span className="text-[#00ff41]/60 text-[10px] sm:text-xs tracking-[0.1em] sm:tracking-[0.2em] uppercase ml-1 sm:ml-2">
              <span className="hidden sm:inline">ascii_converter.exe</span>
              <span className="sm:hidden">ascii.exe</span>
            </span>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {isRecording && (
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="flex items-center gap-1 sm:gap-2 text-[#ff3e3e] text-[10px] sm:text-xs"
              >
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#ff3e3e]" />
                REC
              </motion.div>
            )}
            <span className="text-[#00ff41]/40 text-[10px] sm:text-xs">
              {isPlaying ? '▶' : '■'}
              <span className="hidden sm:inline">
                {' '}
                {isPlaying ? 'PLAYING' : 'READY'}
              </span>
            </span>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="relative z-10 p-4 sm:p-6 md:p-8">
          {/* ASCII Art Header */}
          <header className="mb-6 sm:mb-8">
            {/* Mobile: Simple Title */}
            <div className="sm:hidden mb-4">
              <h1 className="text-[#00ff41] text-lg font-bold tracking-wider">
                ASCII VIDEO
              </h1>
            </div>

            {/* Desktop: ASCII Art Title */}
            <div className="hidden sm:block overflow-x-auto">
              <pre className="text-[#00ff41] text-[8px] md:text-[10px] leading-tight mb-4 opacity-80 inline-block">
                {`╔═══════════════════════════════════════════════════════════════════════╗
║  █████╗ ███████╗ ██████╗██╗██╗  ██╗   ██╗██╗██████╗ ███████╗ ██████╗  ║
║ ██╔══██╗██╔════╝██╔════╝██║██║  ██║   ██║██║██╔══██╗██╔════╝██╔═══██╗ ║
║ ███████║███████╗██║     ██║██║  ██║   ██║██║██║  ██║█████╗  ██║   ██║ ║
║ ██╔══██║╚════██║██║     ██║██║  ╚██╗ ██╔╝██║██║  ██║██╔══╝  ██║   ██║ ║
║ ██║  ██║███████║╚██████╗██║██║   ╚████╔╝ ██║██████╔╝███████╗╚██████╔╝ ║
║ ╚═╝  ╚═╝╚══════╝ ╚═════╝╚═╝╚═╝    ╚═══╝  ╚═╝╚═════╝ ╚══════╝ ╚═════╝  ║
╚═══════════════════════════════════════════════════════════════════════╝`}
              </pre>
            </div>

            <div className="flex items-center gap-2 text-[#00ff41]/60 text-[10px] sm:text-xs">
              <span className="text-[#00ff41]">$</span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="truncate"
              >
                {t.subtitle}
              </motion.span>
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="text-[#00ff41]"
              >
                █
              </motion.span>
            </div>
          </header>

          {/* Dropzone 또는 ASCII 출력 */}
          {!videoFile ? (
            <VideoDropzone onFileSelect={setVideoFile} t={t.dropzone} />
          ) : (
            <div className="space-y-6">
              <AsciiCanvas ref={asciiCanvasRef} asciiFrame={asciiFrame} />
              {isLoaded && (
                <PlaybackControls
                  isPlaying={isPlaying}
                  isRecording={isRecording}
                  onPlay={play}
                  onPause={pause}
                  onReset={reset}
                  onRecord={handleRecord}
                  onStopRecord={handleStopRecord}
                  t={t.controls}
                />
              )}
            </div>
          )}
        </div>

        {/* Bottom Status Bar */}
        <div className="relative z-10 flex items-center justify-between px-3 sm:px-4 py-2 border-t border-[#00ff41]/20 bg-[#050505] text-[8px] sm:text-[10px] text-[#00ff41]/40 gap-2">
          <span className="hidden sm:inline">MODE: REALTIME</span>
          <span className="sm:hidden">REALTIME</span>
          <span className="hidden sm:inline">OUTPUT: WEBM</span>
          <span className="sm:hidden">WEBM</span>
          <span>
            {new Date().toLocaleTimeString('en-US', { hour12: false })}
          </span>
        </div>
      </div>

      {/* Hidden video element for processing */}
      <video
        ref={videoRef}
        src={videoSrc}
        className="hidden"
        playsInline
        muted
      />
    </motion.div>
  );
}
