'use client';

import { useCallback, useRef, useState } from 'react';

import { VideoProcessorState } from '../types';

export function useVideoProcessor() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState<VideoProcessorState>({
    videoFile: null,
    isLoaded: false,
    isPlaying: false,
    duration: 0,
    currentTime: 0,
  });

  const setVideoFile = useCallback((file: File | null) => {
    if (!file || !videoRef.current) return;

    // 이전 URL 해제
    if (videoRef.current.src) {
      URL.revokeObjectURL(videoRef.current.src);
    }

    const url = URL.createObjectURL(file);
    videoRef.current.src = url;
    videoRef.current.load();

    videoRef.current.onloadedmetadata = () => {
      setState((prev) => ({
        ...prev,
        videoFile: file,
        isLoaded: true,
        duration: videoRef.current?.duration || 0,
      }));

      // 자동 재생
      videoRef.current?.play();
      setState((prev) => ({ ...prev, isPlaying: true }));
    };

    videoRef.current.onended = () => {
      setState((prev) => ({ ...prev, isPlaying: false }));
    };

    videoRef.current.ontimeupdate = () => {
      setState((prev) => ({
        ...prev,
        currentTime: videoRef.current?.currentTime || 0,
      }));
    };

    setState((prev) => ({ ...prev, videoFile: file }));
  }, []);

  const play = useCallback(() => {
    videoRef.current?.play();
    setState((prev) => ({ ...prev, isPlaying: true }));
  }, []);

  const pause = useCallback(() => {
    videoRef.current?.pause();
    setState((prev) => ({ ...prev, isPlaying: false }));
  }, []);

  const reset = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      URL.revokeObjectURL(videoRef.current.src);
      videoRef.current.src = '';
    }
    setState({
      videoFile: null,
      isLoaded: false,
      isPlaying: false,
      duration: 0,
      currentTime: 0,
    });
  }, []);

  return {
    ...state,
    videoRef,
    setVideoFile,
    play,
    pause,
    reset,
  };
}
