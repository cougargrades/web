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
      items[field] = data[field]
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
    .sort((a,b) => a.id - b.id)
  return posts
}

export async function markdownToHtml(markdown: string) {
  const schema = defaultSchema
  schema.tagNames.push('iframe')
  if(!Array.isArray(schema.attributes['iframe']))
    schema.attributes['iframe'] = []
  schema.attributes['iframe'].push('src')
  const result = await remark()
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSanitize, schema)
    .use(rehypeStringify)
    //.use(html)
    .process(markdown)
  return result.toString()
}
