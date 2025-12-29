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
      ko: '동영상을 실시간으로 ASCII 아트로 변환해보세요',
      en: 'Transform video into ASCII art in real-time',
    },
    category: 'Media',
    thumbnail: '/images/video-to-ascii-thumbnail.png',
  },
  {
    slug: 'blockchain-viz',
    title: {
      ko: '블록체인 이해하기',
      en: 'Understanding Blockchain',
    },
    description: {
      ko: '직접 블록을 만들고 연결하며 블록체인의 핵심 원리를 배워보세요',
      en: 'Create and connect blocks yourself to learn the core principles of blockchain',
    },
    category: 'Crypto',
    thumbnail: '/images/blockchain-core-principles.png',
  },
];
