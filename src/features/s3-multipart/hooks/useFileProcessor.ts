'use client';

import { useCallback, useState } from 'react';

import { bytesToHex, calculateHash } from '../utils/bytes';

export interface FilePart {
  partNumber: number;
  start: number;
  end: number;
  size: number;
  data: Uint8Array;
  etag: string;
  hexDump: string;
}

interface FileProcessorState {
  file: File | null;
  parts: FilePart[];
  originalHash: string;
  reconstructedHash: string;
  reconstructedFile: Blob | null;
  isProcessing: boolean;
}

export function useFileProcessor() {
  const [state, setState] = useState<FileProcessorState>({
    file: null,
    parts: [],
    originalHash: '',
    reconstructedHash: '',
    reconstructedFile: null,
    isProcessing: false,
  });

  const handleFile = useCallback(async (selectedFile: File | null) => {
    if (!selectedFile) return;

    setState((prev) => ({
      ...prev,
      isProcessing: true,
      file: selectedFile,
      parts: [],
      reconstructedFile: null,
      reconstructedHash: '',
    }));

    const arrayBuffer = await selectedFile.arrayBuffer();
    const hash = await calculateHash(arrayBuffer);

    setState((prev) => ({
      ...prev,
      originalHash: hash,
      isProcessing: false,
    }));
  }, []);

  const splitFile = useCallback(
    async (partCount: number) => {
      if (!state.file) return;

      setState((prev) => ({ ...prev, isProcessing: true }));

      const arrayBuffer = await state.file.arrayBuffer();
      const fileBytes = new Uint8Array(arrayBuffer);
      const totalSize = fileBytes.length;
      const partSize = Math.ceil(totalSize / partCount);

      const newParts: FilePart[] = [];

      for (let i = 0; i < partCount; i++) {
        const start = i * partSize;
        const end = Math.min(start + partSize, totalSize);
        const partData = fileBytes.slice(start, end);

        const partHash = await calculateHash(partData.buffer);

        const previewBytes = partData.slice(0, Math.min(32, partData.length));
        const hexDump = bytesToHex(previewBytes);

        newParts.push({
          partNumber: i + 1,
          start,
          end: end - 1,
          size: partData.length,
          data: partData,
          etag: partHash.substring(0, 32),
          hexDump,
        });
      }

      setState((prev) => ({
        ...prev,
        parts: newParts,
        isProcessing: false,
      }));
    },
    [state.file],
  );

  const mergeParts = useCallback(async () => {
    if (state.parts.length === 0 || !state.file) return;

    setState((prev) => ({ ...prev, isProcessing: true }));

    const totalSize = state.parts.reduce((sum, part) => sum + part.size, 0);
    const merged = new Uint8Array(totalSize);

    let offset = 0;
    for (const part of state.parts) {
      merged.set(part.data, offset);
      offset += part.size;
    }

    const hash = await calculateHash(merged.buffer);
    const blob = new Blob([merged], { type: state.file.type });

    setState((prev) => ({
      ...prev,
      reconstructedHash: hash,
      reconstructedFile: blob,
      isProcessing: false,
    }));
  }, [state.parts, state.file]);

  const downloadReconstructed = useCallback(() => {
    if (!state.reconstructedFile || !state.file) return;

    const url = URL.createObjectURL(state.reconstructedFile);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reconstructed_${state.file.name}`;
    a.click();
    URL.revokeObjectURL(url);
  }, [state.reconstructedFile, state.file]);

  const reset = useCallback(() => {
    setState({
      file: null,
      parts: [],
      originalHash: '',
      reconstructedHash: '',
      reconstructedFile: null,
      isProcessing: false,
    });
  }, []);

  return {
    ...state,
    handleFile,
    splitFile,
    mergeParts,
    downloadReconstructed,
    reset,
  };
}
