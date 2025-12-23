'use client';

import { motion } from 'motion/react';
import { useMemo, useState } from 'react';

import { useLocale } from '@/i18n/context';

import { getTranslations } from '../../constants/translations';

type InterpretationMode = 'ascii' | 'rgb' | 'integer' | 'float';

export function ByteInterpretationDemo() {
  const locale = useLocale();
  const t = getTranslations(locale).byteInterpreter;
  const [bytes, setBytes] = useState<number[]>([0x48, 0x65, 0x6c, 0x6c, 0x6f]);
  const [mode, setMode] = useState<InterpretationMode>('ascii');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const interpretations = useMemo(() => {
    const ascii = bytes
      .map((b) => (b >= 32 && b <= 126 ? String.fromCharCode(b) : '.'))
      .join('');

    const rgb =
      bytes.length >= 3
        ? { r: bytes[0], g: bytes[1], b: bytes[2] }
        : { r: 0, g: 0, b: 0 };
    const rgbHex = `#${rgb.r.toString(16).padStart(2, '0')}${rgb.g.toString(16).padStart(2, '0')}${rgb.b.toString(16).padStart(2, '0')}`;

    let integer = 0;
    for (let i = 0; i < Math.min(bytes.length, 4); i++) {
      integer = (integer << 8) | bytes[i];
    }

    let float = 0;
    if (bytes.length >= 4) {
      const buffer = new ArrayBuffer(4);
      const view = new DataView(buffer);
      bytes.slice(0, 4).forEach((b, i) => view.setUint8(i, b));
      float = view.getFloat32(0, false);
    }

    return { ascii, rgb, rgbHex, integer, float };
  }, [bytes]);

  const handleByteChange = (index: number, value: string) => {
    const num = parseInt(value, 16);
    if (!isNaN(num) && num >= 0 && num <= 255) {
      const newBytes = [...bytes];
      newBytes[index] = num;
      setBytes(newBytes);
    }
  };

  const modeButtons: { mode: InterpretationMode; label: string }[] = [
    { mode: 'ascii', label: t.asAscii },
    { mode: 'rgb', label: t.asRgb },
    { mode: 'integer', label: t.asInteger },
    { mode: 'float', label: t.asFloat },
  ];

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

      {/* Main visualization */}
      <div className="bg-neutral-950 border border-neutral-800 overflow-hidden">
        {/* Byte input */}
        <div className="p-6 border-b border-neutral-800">
          <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider mb-3">
            {t.inputBytes}
          </div>
          <div className="flex flex-wrap gap-2">
            {bytes.map((byte, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
                {editingIndex === i ? (
                  <input
                    type="text"
                    defaultValue={byte.toString(16).padStart(2, '0')}
                    className="w-14 h-14 bg-neutral-900 border-2 border-cyan-500 text-center font-mono text-lg text-cyan-400 uppercase focus:outline-none"
                    maxLength={2}
                    autoFocus
                    onBlur={(e) => {
                      handleByteChange(i, e.target.value);
                      setEditingIndex(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleByteChange(i, e.currentTarget.value);
                        setEditingIndex(null);
                      }
                    }}
                  />
                ) : (
                  <button
                    onClick={() => setEditingIndex(i)}
                    className="w-14 h-14 bg-neutral-900 border border-neutral-700 hover:border-cyan-500/50
                             font-mono text-lg text-cyan-400 uppercase transition-colors"
                  >
                    {byte.toString(16).padStart(2, '0')}
                  </button>
                )}
                <div className="absolute -bottom-4 left-0 right-0 text-center text-[8px] text-neutral-600">
                  {byte}
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-6 text-[10px] text-neutral-600">{t.editHint}</div>
        </div>

        {/* Mode selector */}
        <div className="flex border-b border-neutral-800">
          {modeButtons.map(({ mode: m, label }) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 py-3 px-4 text-[10px] font-mono uppercase tracking-wider transition-colors ${
                mode === m
                  ? 'bg-purple-500/10 text-purple-400 border-b-2 border-purple-400'
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Interpretation result */}
        <div className="p-6 min-h-[140px]">
          <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider mb-4">
            {t.interpretation}
          </div>

          {mode === 'ascii' && (
            <motion.div
              key="ascii"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center"
            >
              <div className="text-4xl font-mono text-emerald-400 tracking-wider">
                &quot;{interpretations.ascii}&quot;
              </div>
              <div className="mt-2 text-xs text-neutral-500">
                {bytes.map((b) => String.fromCharCode(b)).join(' + ')} ={' '}
                <span className="text-emerald-400">
                  &quot;{interpretations.ascii}&quot;
                </span>
              </div>
            </motion.div>
          )}

          {mode === 'rgb' && (
            <motion.div
              key="rgb"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center"
            >
              <div className="flex items-center gap-6">
                <div
                  className="w-20 h-20 border-2 border-neutral-700"
                  style={{ backgroundColor: interpretations.rgbHex }}
                />
                <div className="space-y-1 font-mono text-sm">
                  <div>
                    <span className="text-red-400">R:</span>{' '}
                    <span className="text-neutral-300">
                      {interpretations.rgb.r}
                    </span>
                  </div>
                  <div>
                    <span className="text-green-400">G:</span>{' '}
                    <span className="text-neutral-300">
                      {interpretations.rgb.g}
                    </span>
                  </div>
                  <div>
                    <span className="text-blue-400">B:</span>{' '}
                    <span className="text-neutral-300">
                      {interpretations.rgb.b}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-3 text-xs text-neutral-500">
                {t.colorPreview}:{' '}
                <span className="text-cyan-400">{interpretations.rgbHex}</span>
              </div>
            </motion.div>
          )}

          {mode === 'integer' && (
            <motion.div
              key="integer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center"
            >
              <div className="text-4xl font-mono text-amber-400">
                {interpretations.integer.toLocaleString()}
              </div>
              <div className="mt-2 text-xs text-neutral-500 font-mono">
                {bytes
                  .slice(0, 4)
                  .map((b) => b.toString(16).padStart(2, '0'))
                  .join(' ')}{' '}
                ={' '}
                <span className="text-amber-400">
                  {interpretations.integer}
                </span>
              </div>
            </motion.div>
          )}

          {mode === 'float' && (
            <motion.div
              key="float"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center"
            >
              <div className="text-4xl font-mono text-rose-400">
                {bytes.length >= 4
                  ? interpretations.float.toExponential(4)
                  : t.invalidBytes}
              </div>
              {bytes.length >= 4 && (
                <div className="mt-2 text-xs text-neutral-500">
                  IEEE 754 Single Precision (32-bit)
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Preset buttons */}
        <div className="border-t border-neutral-800 p-4 flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setBytes([0x48, 0x65, 0x6c, 0x6c, 0x6f])}
            className="px-3 py-1.5 bg-neutral-800 text-neutral-400 text-[10px] font-mono
                     hover:bg-neutral-700 transition-colors"
          >
            &quot;Hello&quot;
          </button>
          <button
            onClick={() => setBytes([0xff, 0x00, 0x00])}
            className="px-3 py-1.5 bg-neutral-800 text-neutral-400 text-[10px] font-mono
                     hover:bg-neutral-700 transition-colors"
          >
            Red (RGB)
          </button>
          <button
            onClick={() => setBytes([0x00, 0xff, 0x00])}
            className="px-3 py-1.5 bg-neutral-800 text-neutral-400 text-[10px] font-mono
                     hover:bg-neutral-700 transition-colors"
          >
            Green (RGB)
          </button>
          <button
            onClick={() => setBytes([0x42, 0x28, 0x00, 0x00])}
            className="px-3 py-1.5 bg-neutral-800 text-neutral-400 text-[10px] font-mono
                     hover:bg-neutral-700 transition-colors"
          >
            42.0 (Float)
          </button>
        </div>
      </div>
    </div>
  );
}
