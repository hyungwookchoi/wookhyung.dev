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
  relatedPost?: string;
}

export const PLAYGROUNDS: Playground[] = [
  // Example:
  // {
  //   slug: 'ethereum-pos-simulator',
  //   title: {
  //     ko: 'Ethereum PoS 시뮬레이터',
  //     en: 'Ethereum PoS Simulator',
  //   },
  //   description: {
  //     ko: 'Ethereum의 지분 증명(PoS) 합의 메커니즘을 시각적으로 이해해보세요.',
  //     en: 'Visually understand Ethereum\'s Proof of Stake consensus mechanism.',
  //   },
  //   category: 'Blockchain',
  //   relatedPost: '/tech/ethereum-pos',
  // },
];
