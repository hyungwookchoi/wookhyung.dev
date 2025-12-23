'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { VideoProcessorState } from '../types';

interface ExtendedState extends VideoProcessorState {
  videoSrc: string;
}

export function useVideoProcessor(defaultVideoUrl: string) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState<ExtendedState>({
    videoFile: null,
    isLoaded: false,
    isPlaying: false,
    duration: 0,
    currentTime: 0,
    videoSrc: defaultVideoUrl,
  });

  // 사용자가 파일을 업로드했을 때
  const setVideoFile = useCallback((file: File | null) => {
    if (!file) return;

    // 이전 blob URL 해제
    setState((prev) => {
      if (prev.videoSrc.startsWith('blob:')) {
        URL.revokeObjectURL(prev.videoSrc);
      }
      return prev;
    });

    const url = URL.createObjectURL(file);
    setState((prev) => ({
      ...prev,
      videoFile: file,
      videoSrc: url,
      isLoaded: false,
    }));
  }, []);

  // 비디오 이벤트 핸들러 설정
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setState((prev) => ({
        ...prev,
        videoFile: prev.videoFile || ({ name: 'default.mp4' } as File),
        isLoaded: true,
        duration: video.duration || 0,
      }));
    };

    const handleCanPlay = () => {
      // 자동 재생 없이 준비 완료 상태만 유지
    };

    const handleEnded = () => {
      setState((prev) => ({ ...prev, isPlaying: false }));
    };

    const handleTimeUpdate = () => {
      setState((prev) => ({
        ...prev,
        currentTime: video.currentTime || 0,
      }));
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('timeupdate', handleTimeUpdate);

    // 이미 로드된 상태라면 수동으로 이벤트 트리거
    if (video.readyState >= 1) {
      handleLoadedMetadata();
    }

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [state.videoSrc]);

  const play = useCallback(() => {
    videoRef.current?.play();
    setState((prev) => ({ ...prev, isPlaying: true }));
  }, []);

  const pause = useCallback(() => {
    videoRef.current?.pause();
    setState((prev) => ({ ...prev, isPlaying: false }));
  }, []);

  const reset = useCallback(() => {
    // blob URL 해제
    setState((prev) => {
      if (prev.videoSrc.startsWith('blob:')) {
        URL.revokeObjectURL(prev.videoSrc);
      }
      return {
        videoFile: null,
        isLoaded: false,
        isPlaying: false,
        duration: 0,
        currentTime: 0,
        videoSrc: defaultVideoUrl,
      };
    });
  }, [defaultVideoUrl]);

  return {
    ...state,
    videoRef,
    setVideoFile,
    play,
    pause,
    reset,
  };
}
