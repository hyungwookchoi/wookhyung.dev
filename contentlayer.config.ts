import { defineDocumentType, makeSource } from 'contentlayer2/source-files';
import rehypePresetMinify from 'rehype-preset-minify';
import rehypePrismPlus from 'rehype-prism-plus';
import remarkGfm from 'remark-gfm';

export const TechPost = defineDocumentType(() => ({
  name: 'TechPost',
  filePathPattern: 'tech/**/*.mdx',
  contentType: 'mdx',
  fields: {
    title: {
      type: 'string',
      description: 'title of the post',
      required: true,
    },
    date: {
      type: 'date',
      description: 'date of the post',
      required: true,
    },
    tags: {
      type: 'list',
      of: { type: 'string' },
      required: false,
    },
    draft: {
      type: 'boolean',
      description: 'draft of the post',
      required: false,
    },
    withClaude: {
      type: 'boolean',
      description: 'post created with Claude AI',
      required: false,
    },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (post) => {
        const slug = post._raw.flattenedPath.replace('tech/', '');
        return `/tech/${slug}`;
      },
    },
    slug: {
      type: 'string',
      resolve: (post) => post._raw.flattenedPath.replace('tech/', ''),
    },
    category: {
      type: 'string',
      resolve: () => 'tech',
    },
  },
}));

export const NotesPost = defineDocumentType(() => ({
  name: 'NotesPost',
  filePathPattern: 'notes/**/*.mdx',
  contentType: 'mdx',
  fields: {
    title: {
      type: 'string',
      description: 'title of the post',
      required: true,
    },
    date: {
      type: 'date',
      description: 'date of the post',
      required: true,
    },
    tags: {
      type: 'list',
      of: { type: 'string' },
      required: false,
    },
    draft: {
      type: 'boolean',
      description: 'draft of the post',
      required: false,
    },
    withClaude: {
      type: 'boolean',
      description: 'post created with Claude AI',
      required: false,
    },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (post) => {
        const slug = post._raw.flattenedPath.replace('notes/', '');
        return `/notes/${slug}`;
      },
    },
    slug: {
      type: 'string',
      resolve: (post) => post._raw.flattenedPath.replace('notes/', ''),
    },
    category: {
      type: 'string',
      resolve: () => 'notes',
    },
  },
}));

export default makeSource({
  contentDirPath: 'posts',
  documentTypes: [TechPost, NotesPost],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      [
        rehypePrismPlus,
        {
          defaultLanguage: 'js',
          ignoreMissing: true,
          showLineNumbers: true,
        },
      ],
      rehypePresetMinify,
    ],
  },
});
