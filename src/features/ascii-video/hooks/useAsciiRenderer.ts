'use client';

import { RefObject, useCallback, useEffect, useRef, useState } from 'react';

import { AsciiDimensions } from '../types';
import {
  AsciiCell,
  calculateDimensions,
  imageDataToColorAscii,
} from '../utils/ascii';

interface UseAsciiRendererResult {
  asciiFrame: AsciiCell[][];
  dimensions: AsciiDimensions;
}

export function useAsciiRenderer(
  videoRef: RefObject<HTMLVideoElement | null>,
  isPlaying: boolean,
): UseAsciiRendererResult {
  const [asciiFrame, setAsciiFrame] = useState<AsciiCell[][]>([]);
  const [dimensions, setDimensions] = useState<AsciiDimensions>({
    cols: 80,
    rows: 40,
  });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number>(0);

  const renderFrame = useCallback(() => {
    const video = videoRef.current;
    if (!video || video.paused || video.ended) {
      return;
    }

    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
    }
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const ascii = imageDataToColorAscii(
      imageData,
      dimensions.cols,
      dimensions.rows,
    );
    setAsciiFrame(ascii);

    animationRef.current = requestAnimationFrame(renderFrame);
  }, [videoRef, dimensions]);

  useEffect(() => {
    if (isPlaying) {
      renderFrame();
    }

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, renderFrame]);

  // 비디오 로드 시 dimensions 계산 및 첫 프레임 렌더링
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      const newDimensions = calculateDimensions(
        video.videoWidth,
        video.videoHeight,
        120, // maxRows - 고화질
      );
      setDimensions(newDimensions);
    };

    const handleLoadedData = () => {
      if (!canvasRef.current) {
        canvasRef.current = document.createElement('canvas');
      }
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);

      const currentDims = calculateDimensions(
        video.videoWidth,
        video.videoHeight,
        120, // maxRows - 고화질
      );
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const ascii = imageDataToColorAscii(
        imageData,
        currentDims.cols,
        currentDims.rows,
      );
      setAsciiFrame(ascii);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('loadeddata', handleLoadedData);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('loadeddata', handleLoadedData);
    };
  }, [videoRef]);

  return { asciiFrame, dimensions };
}
