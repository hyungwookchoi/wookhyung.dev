export interface Playground {
  slug: string;
  title: {
    ko: string;
    en: string;
  };
  description: {
    ko: string;
    en: string;
  };
  category: string;
  thumbnail?: string;
  relatedPost?: string;
}

export const PLAYGROUNDS: Playground[] = [
  {
    slug: 'ascii-video',
    title: {
      ko: 'ASCII 비디오 컨버터',
      en: 'ASCII Video Converter',
    },
    description: {
      ko: '동영상을 ASCII 아트로 변환하는 인터랙티브 도구',
      en: 'Convert your video to ASCII art in real-time',
    },
    category: 'Media',
    thumbnail: '/images/video-to-ascii-thumbnail.png',
  },
];
