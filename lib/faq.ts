/**
 * From: https://github.com/vercel/next.js/blob/3e78f0cb5d9644fc5af6147d96b210c6c0d308bd/examples/blog-starter/lib/api.js
 */

import fs from 'fs'
import { join } from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'
import rehypeHighlight from 'rehype-highlight'

const postsDirectory = join(process.cwd(), '_posts')

export interface FaqPostData {
  slug?: string;
  title?: string;
  date?: string;
  content?: string;
  id?: number;
}

export function getPostSlugs(): string[] {
  return fs.readdirSync(postsDirectory)
}

export function getPostBySlug(slug: string, fields: string[] = []): FaqPostData {
  const realSlug = slug.replace(/\.md$/, '')
  const fullPath = join(postsDirectory, `${realSlug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  const items: FaqPostData = {}

  // Ensure only the minimal needed data is exposed
  fields.forEach((field) => {
    if (field === 'slug') {
      items[field] = realSlug
    }
    if (field === 'content') {
      items[field] = content
    }

    if (typeof data[field] !== 'undefined') {
      items[field as keyof FaqPostData] = data[field]
    }
  })

  return items
}

export function getAllPosts(fields: string[] = []): FaqPostData[] {
  const slugs = getPostSlugs()
  const posts = slugs
    .map((slug) => getPostBySlug(slug, fields))
    // sort posts by date in descending order
    //.sort((post1, post2) => (post1.date > post2.date ? -1 : 1))
    // sort by post "id"
    .sort((a,b) => (a.id ?? 0) - (b.id ?? 0))
  return posts
}

export async function markdownToHtml(markdown: string) {
  const result = await remark()
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeHighlight)
    .use(rehypeSanitize, {
      ...defaultSchema,
      tagNames: [
        ...(defaultSchema.tagNames ?? []),
        'iframe',
      ],
      attributes: {
        ...defaultSchema.attributes,
        'iframe': [
          ...(defaultSchema.attributes?.['iframe'] ?? []),
          'src'
        ],
        code: [
          ...(defaultSchema.attributes?.['code'] ?? []),
          // List of all allowed languages:
          ['className', 'hljs', 'language-*', 'language-js', 'language-css', 'language-md', 'language-python']
        ],
        span: [
          ...(defaultSchema.attributes?.['code'] ?? []),
          ['className', 'hljs-addition', 'hljs-attr', 'hljs-attribute', 'hljs-built_in', 'hljs-bullet', 'hljs-char', 'hljs-code', 'hljs-comment', 'hljs-deletion', 'hljs-doctag', 'hljs-emphasis', 'hljs-formula', 'hljs-keyword', 'hljs-link', 'hljs-literal', 'hljs-meta', 'hljs-name', 'hljs-number', 'hljs-operator', 'hljs-params', 'hljs-property', 'hljs-punctuation', 'hljs-quote', 'hljs-regexp', 'hljs-section', 'hljs-selector-attr', 'hljs-selector-class', 'hljs-selector-id', 'hljs-selector-pseudo', 'hljs-selector-tag', 'hljs-string', 'hljs-strong', 'hljs-subst', 'hljs-symbol', 'hljs-tag', 'hljs-template-tag', 'hljs-template-variable', 'hljs-title', 'hljs-type', 'hljs-variable']
        ]
      }
    })
    .use(rehypeStringify)
    //.use(html)
    .process(markdown)
  return result.toString()
}
