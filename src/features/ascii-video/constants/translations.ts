import { Locale } from '@/i18n/config';

export const translations = {
  ko: {
    title: 'ASCII 컨버터',
    subtitle: 'media_to_ascii --realtime --color',
    tabs: {
      video: 'VIDEO',
      image: 'IMAGE',
    },
    dropzone: {
      placeholder: 'INPUT_FILE을 드래그하거나 클릭하여 선택...',
      dragActive: 'DROP_TARGET_READY',
      size: 'SIZE',
      type: 'TYPE',
      unknown: 'UNKNOWN',
    },
    imageDropzone: {
      placeholder: 'IMAGE_FILE을 드래그하거나 클릭하여 선택...',
      dragActive: 'DROP_TARGET_READY',
    },
    controls: {
      play: 'PLAY',
      pause: 'STOP',
      reset: 'INIT',
      record: 'REC',
      stopRecord: 'END',
      recording: 'RECORDING...',
    },
    imageControls: {
      download: 'DOWNLOAD',
      reset: 'RESET',
    },
  },
  en: {
    title: 'ASCII Converter',
    subtitle: 'media_to_ascii --realtime --color',
    tabs: {
      video: 'VIDEO',
      image: 'IMAGE',
    },
    dropzone: {
      placeholder: 'Drag INPUT_FILE or click to select...',
      dragActive: 'DROP_TARGET_READY',
      size: 'SIZE',
      type: 'TYPE',
      unknown: 'UNKNOWN',
    },
    imageDropzone: {
      placeholder: 'Drag IMAGE_FILE or click to select...',
      dragActive: 'DROP_TARGET_READY',
    },
    controls: {
      play: 'PLAY',
      pause: 'STOP',
      reset: 'INIT',
      record: 'REC',
      stopRecord: 'END',
      recording: 'RECORDING...',
    },
    imageControls: {
      download: 'DOWNLOAD',
      reset: 'RESET',
    },
  },
} as const;

export type Translations = typeof translations;

export function getTranslations(locale: Locale) {
  return translations[locale];
}
