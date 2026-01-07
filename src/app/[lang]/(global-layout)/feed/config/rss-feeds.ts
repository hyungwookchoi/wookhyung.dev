export interface RssFeed {
  name: string;
  url: string;
}

export const RSS_FEEDS: RssFeed[] = [
  {
    name: 'Dan Abramov',
    url: 'https://overreacted.io/rss.xml',
  },
  {
    name: 'Kent C. Dodds',
    url: 'https://kentcdodds.com/blog/rss.xml',
  },
  {
    name: 'Josh W Comeau',
    url: 'https://www.joshwcomeau.com/rss.xml',
  },
  {
    name: 'TKDodo',
    url: 'https://tkdodo.eu/blog/rss.xml',
  },
];
