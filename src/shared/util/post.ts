import { allNotesPosts, allTechPosts } from 'contentlayer/generated';

import { Locale } from '@/i18n/config';

export const allPosts = [...allTechPosts, ...allNotesPosts]
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .filter((post) => !post.draft);

export const techPosts = allTechPosts
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .filter((post) => !post.draft);

export const notesPosts = allNotesPosts
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .filter((post) => !post.draft);

export const getTechPostsByLocale = (locale: Locale) =>
  techPosts.filter((post) => post.locale === locale);

export const getNotesPostsByLocale = (locale: Locale) =>
  notesPosts.filter((post) => post.locale === locale);

export const getTechPostBySlugAndLocale = (slug: string, locale: Locale) =>
  techPosts.find((post) => post.slug === slug && post.locale === locale);

export const getNotesPostBySlugAndLocale = (slug: string, locale: Locale) =>
  notesPosts.find((post) => post.slug === slug && post.locale === locale);
