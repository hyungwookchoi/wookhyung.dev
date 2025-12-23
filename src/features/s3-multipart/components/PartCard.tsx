'use client';

import { formatBytes } from '../utils/bytes';

interface PartCardProps {
  partNumber: number;
  start: number;
  end: number;
  size: number;
  etag: string;
  hexDump: string;
  index: number;
  t: {
    partNumber: string;
    byteRange: string;
    etag: string;
    hexDump: string;
  };
}

export function PartCard({
  partNumber,
  start,
  end,
  size,
  etag,
  hexDump,
  index,
  t,
}: PartCardProps) {
  // Generate a unique hue based on part index for visual differentiation
  const hue = (index * 35 + 180) % 360;

  return (
    <div className="group relative bg-neutral-950 border border-neutral-800 hover:border-neutral-700 transition-all duration-300 overflow-hidden">
      {/* Top accent bar */}
      <div
        className="h-1 transition-all duration-300"
        style={{
          background: `linear-gradient(90deg, hsl(${hue}, 70%, 50%) 0%, hsl(${hue + 30}, 70%, 40%) 100%)`,
        }}
      />

      {/* Header */}
      <div className="p-4 border-b border-neutral-800/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Part number badge */}
            <div
              className="w-10 h-10 flex items-center justify-center font-mono text-lg font-bold"
              style={{
                background: `linear-gradient(135deg, hsl(${hue}, 70%, 50%, 0.15) 0%, hsl(${hue}, 70%, 50%, 0.05) 100%)`,
                color: `hsl(${hue}, 70%, 65%)`,
              }}
            >
              {String(partNumber).padStart(2, '0')}
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-neutral-600">
                {t.partNumber}
              </span>
            </div>
          </div>

          {/* Size badge */}
          <div className="text-right">
            <span className="font-mono text-sm text-neutral-300">
              {formatBytes(size)}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Byte Range */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-600">
            {t.byteRange}
          </span>
          <div className="font-mono text-xs text-neutral-400">
            <span className="text-neutral-600">[</span>
            <span className="text-cyan-400">{start.toLocaleString()}</span>
            <span className="text-neutral-600"> → </span>
            <span className="text-cyan-400">{end.toLocaleString()}</span>
            <span className="text-neutral-600">]</span>
          </div>
        </div>

        {/* ETag */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-600">
              {t.etag}
            </span>
            <div className="flex-1 h-px bg-neutral-800" />
          </div>
          <div className="font-mono text-[10px] text-amber-400/80 break-all leading-relaxed">
            {etag}
          </div>
        </div>

        {/* Hex Dump */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-600">
              {t.hexDump}
            </span>
            <div className="flex-1 h-px bg-neutral-800" />
          </div>
          <div className="relative">
            {/* Terminal-style hex display */}
            <div className="bg-neutral-900 border border-neutral-800 p-3 overflow-x-auto">
              {/* Line numbers + hex content */}
              <div className="flex gap-3">
                <div className="font-mono text-[10px] text-neutral-700 select-none shrink-0">
                  0x00
                </div>
                <pre className="font-mono text-[10px] text-emerald-400 whitespace-pre-wrap break-all">
                  {hexDump}
                </pre>
              </div>
            </div>

            {/* Decorative corner */}
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-neutral-700" />
          </div>
        </div>
      </div>

      {/* Footer status */}
      <div className="px-4 py-2 bg-neutral-900/50 border-t border-neutral-800/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-emerald-500 animate-pulse" />
          <span className="text-[9px] font-mono uppercase tracking-wider text-neutral-600">
            Ready
          </span>
        </div>
        <span className="text-[9px] font-mono text-neutral-700">
          CHUNK_{String(partNumber).padStart(3, '0')}
        </span>
      </div>

      {/* Hover glow effect */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500"
        style={{
          background: `radial-gradient(ellipse at top, hsl(${hue}, 70%, 50%, 0.03) 0%, transparent 50%)`,
        }}
      />
    </div>
  );
}
