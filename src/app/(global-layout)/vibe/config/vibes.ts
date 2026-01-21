export interface Vibe {
  slug: string;
  title: string;
  description: string;
  category: string;
  thumbnail?: string;
  relatedPost?: string;
}

export const VIBES: Vibe[] = [
  {
    slug: 'ascii-video',
    title: 'ASCII 비디오 컨버터',
    description: '동영상을 실시간으로 ASCII 아트로 변환해보세요',
    category: 'Media',
    thumbnail: '/images/video-to-ascii-thumbnail.png',
  },
  // {
  //   slug: 'blockchain-viz',
  //   title: '블록체인 이해하기',
  //   description:
  //     '직접 블록을 만들고 연결하며 블록체인의 핵심 원리를 배워보세요',
  //   category: 'Crypto',
  //   thumbnail: '/images/blockchain-core-principles.png',
  // },
];
