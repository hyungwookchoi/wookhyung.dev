'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import {
  AsciiCell,
  calculateDimensions,
  imageDataToColorAscii,
} from '../utils/ascii';

interface UseImageAsciiRendererResult {
  asciiFrame: AsciiCell[][];
  isLoading: boolean;
  processImage: (file: File) => void;
  reset: () => void;
}

export function useImageAsciiRenderer(): UseImageAsciiRendererResult {
  const [asciiFrame, setAsciiFrame] = useState<AsciiCell[][]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const processImage = useCallback((file: File) => {
    setIsLoading(true);

    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      if (!canvasRef.current) {
        canvasRef.current = document.createElement('canvas');
      }
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) {
        setIsLoading(false);
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const dimensions = calculateDimensions(img.width, img.height, 120);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const ascii = imageDataToColorAscii(
        imageData,
        dimensions.cols,
        dimensions.rows,
      );

      setAsciiFrame(ascii);
      setIsLoading(false);
      URL.revokeObjectURL(url);
    };

    img.onerror = () => {
      setIsLoading(false);
      URL.revokeObjectURL(url);
    };

    img.src = url;
  }, []);

  const reset = useCallback(() => {
    setAsciiFrame([]);
  }, []);

  useEffect(() => {
    return () => {
      if (canvasRef.current) {
        canvasRef.current = null;
      }
    };
  }, []);

  return { asciiFrame, isLoading, processImage, reset };
}
