export interface VideoProcessorState {
  videoFile: File | null;
  isLoaded: boolean;
  isPlaying: boolean;
  duration: number;
  currentTime: number;
}

export interface AsciiDimensions {
  cols: number;
  rows: number;
}

export interface TranslationStrings {
  title: string;
  subtitle: string;
  dropzone: {
    placeholder: string;
    dragActive: string;
    size: string;
    type: string;
    unknown: string;
  };
  controls: {
    play: string;
    pause: string;
    reset: string;
  };
}
