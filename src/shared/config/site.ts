export const siteConfig = {
  name: 'wookhyung.dev',
  siteName: 'WOOKHYUNG',
  url: 'https://www.wookhyung.dev',
  title: {
    default: 'WOOKHYUNG',
    template: '%s | WOOKHYUNG',
  },
  description:
    '프론트엔드 개발자 최형욱의 블로그입니다. 프론트엔드 개발과 개인적인 생각을 기록합니다.',
  author: {
    name: 'wookhyung',
    url: 'https://www.wookhyung.dev',
    email: 'hyungwookchoi.dev@gmail.com',
  },
  keywords: ['wookhyung', 'wookhyung.dev', 'blog', 'frontend', 'developer'],
  language: 'ko',
  locale: 'ko_KR',
  images: {
    opengraph: '/opengraph-image.png',
    logo: '/wookhyung.png',
  },
  icons: {
    icon: [
      {
        url: '/favicon-16x16.png',
        sizes: '16x16',
      },
      {
        url: '/favicon-32x32.png',
        sizes: '32x32',
      },
    ],
    apple: [
      {
        url: '/apple-icon.png',
        sizes: '180x180',
      },
    ],
    manifest: [
      {
        src: '/favicon.ico',
        sizes: '48x48',
        type: 'image/x-icon',
      },
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  theme: {
    color: '#0a0a0b',
    background: '#0a0a0b',
    accent: '#34d399',
  },
  verification: {
    naver: 'b0cbc49b310075ca17a6a6868dd4a9ed0ee4b99d',
  },
  feeds: {
    rss: '/rss.xml',
  },
  github: {
    repo: 'hyungwookchoi/wookhyung.dev',
    repoId: 'R_kgDOPIIAEQ',
    category: 'Comments',
    categoryId: 'DIC_kwDOPIIAEc4CtkB_',
  },
  social: {
    github: 'https://github.com/hyungwookchoi',
    linkedin: 'https://www.linkedin.com/in/hyungwookchoi',
    email: 'hyungwookchoi.dev@gmail.com',
  },
};
