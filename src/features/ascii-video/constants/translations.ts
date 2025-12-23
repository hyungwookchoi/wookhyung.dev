import { Locale } from '@/i18n/config';

export const translations = {
  ko: {
    title: 'ASCII 비디오 컨버터',
    subtitle: 'video_to_ascii --realtime --color',
    dropzone: {
      placeholder: 'INPUT_FILE을 드래그하거나 클릭하여 선택...',
      dragActive: 'DROP_TARGET_READY',
      size: 'SIZE',
      type: 'TYPE',
      unknown: 'UNKNOWN',
    },
    controls: {
      play: 'PLAY',
      pause: 'STOP',
      reset: 'INIT',
      record: 'REC',
      stopRecord: 'END',
      recording: 'RECORDING...',
    },
  },
  en: {
    title: 'ASCII Video Converter',
    subtitle: 'video_to_ascii --realtime --color',
    dropzone: {
      placeholder: 'Drag INPUT_FILE or click to select...',
      dragActive: 'DROP_TARGET_READY',
      size: 'SIZE',
      type: 'TYPE',
      unknown: 'UNKNOWN',
    },
    controls: {
      play: 'PLAY',
      pause: 'STOP',
      reset: 'INIT',
      record: 'REC',
      stopRecord: 'END',
      recording: 'RECORDING...',
    },
  },
} as const;

export type Translations = typeof translations;

export function getTranslations(locale: Locale) {
  return translations[locale];
}
