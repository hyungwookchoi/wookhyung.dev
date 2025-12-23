'use client';

import { motion } from 'motion/react';
import {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';

import { AsciiCell } from '../utils/ascii';

interface AsciiCanvasProps {
  asciiFrame: AsciiCell[][];
}

export interface AsciiCanvasHandle {
  getCanvas: () => HTMLCanvasElement | null;
}

export const AsciiCanvas = memo(
  forwardRef<AsciiCanvasHandle, AsciiCanvasProps>(function AsciiCanvas(
    { asciiFrame },
    ref,
  ) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas || asciiFrame.length === 0) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const rows = asciiFrame.length;
      const cols = asciiFrame[0]?.length || 0;

      const charWidth = 8;
      const charHeight = 14;

      canvas.width = cols * charWidth;
      canvas.height = rows * charHeight;

      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${charHeight}px monospace`;
      ctx.textBaseline = 'top';

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const cell = asciiFrame[row][col];
          ctx.fillStyle = `rgb(${cell.r},${cell.g},${cell.b})`;
          ctx.fillText(cell.char, col * charWidth, row * charHeight);
        }
      }
    }, [asciiFrame]);

    useImperativeHandle(ref, () => ({
      getCanvas: () => canvasRef.current,
    }));

    const content = useMemo(() => {
      if (asciiFrame.length === 0) {
        return (
          <div className="flex flex-col items-center justify-center py-20 text-[#00ff41]/40">
            <pre className="text-xs mb-4">
              {`
  ████████╗██╗   ██╗██████╗ ███╗   ██╗    ██████╗ ███╗   ██╗
  ╚══██╔══╝██║   ██║██╔══██╗████╗  ██║   ██╔═══██╗████╗  ██║
     ██║   ██║   ██║██████╔╝██╔██╗ ██║   ██║   ██║██╔██╗ ██║
     ██║   ██║   ██║██╔══██╗██║╚██╗██║   ██║   ██║██║╚██╗██║
     ██║   ╚██████╔╝██║  ██║██║ ╚████║   ╚██████╔╝██║ ╚████║
     ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝    ╚═════╝ ╚═╝  ╚═══╝
              `.trim()}
            </pre>
            <span className="text-sm">INITIALIZING...</span>
          </div>
        );
      }

      return asciiFrame.map((row, rowIndex) => (
        <div key={rowIndex} className="whitespace-pre leading-[1.15]">
          {row.map((cell, colIndex) => (
            <span
              key={colIndex}
              style={{ color: `rgb(${cell.r},${cell.g},${cell.b})` }}
            >
              {cell.char}
            </span>
          ))}
        </div>
      ));
    }, [asciiFrame]);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative"
      >
        {/* CRT Monitor Frame */}
        <div className="relative bg-[#0a0a0a] border-2 border-[#1a1a1a] rounded-sm overflow-hidden">
          {/* Inner Bezel */}
          <div className="absolute inset-0 border-4 border-[#111] pointer-events-none z-30" />

          {/* CRT Screen Area */}
          <div className="relative overflow-auto">
            {/* Scanline Effect */}
            <div
              className="absolute inset-0 pointer-events-none z-20 opacity-[0.06]"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.3) 1px, rgba(0,0,0,0.3) 2px)',
              }}
            />

            {/* CRT Curvature Vignette */}
            <div
              className="absolute inset-0 pointer-events-none z-20"
              style={{
                background:
                  'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.4) 100%)',
              }}
            />

            {/* Subtle Green Glow */}
            <div
              className="absolute inset-0 pointer-events-none z-10 opacity-30"
              style={{
                background:
                  'radial-gradient(ellipse at center, rgba(0,255,65,0.05) 0%, transparent 70%)',
              }}
            />

            {/* RGB Pixel Effect (subtle) */}
            <div
              className="absolute inset-0 pointer-events-none z-20 opacity-[0.02]"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  90deg,
                  rgba(255,0,0,0.5) 0px,
                  rgba(0,255,0,0.5) 1px,
                  rgba(0,0,255,0.5) 2px,
                  transparent 3px
                )`,
                backgroundSize: '3px 100%',
              }}
            />

            {/* Hidden Recording Canvas */}
            <canvas ref={canvasRef} className="hidden" />

            {/* ASCII Content */}
            <div
              className="relative z-10 p-3 sm:p-4 font-mono text-[4px] sm:text-[5px] md:text-[7px] select-none overflow-x-auto flex justify-center"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                textShadow: '0 0 2px currentColor',
              }}
            >
              <div>{content}</div>
            </div>
          </div>

          {/* Screen Reflection */}
          <div
            className="absolute inset-0 pointer-events-none z-30 opacity-[0.03]"
            style={{
              background:
                'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, transparent 100%)',
            }}
          />
        </div>

        {/* Monitor Stand Effect (subtle shadow) */}
        <div className="h-2 mx-auto w-3/4 bg-gradient-to-b from-[#1a1a1a] to-transparent opacity-50" />
      </motion.div>
    );
  }),
);
