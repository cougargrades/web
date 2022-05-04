/**
 * From: https://github.com/vercel/next.js/blob/3e78f0cb5d9644fc5af6147d96b210c6c0d308bd/examples/blog-starter/lib/api.js
 */

import fs from 'fs'
import { join } from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const postsDirectory = join(process.cwd(), '_posts')

// title: 'Learn How to Pre-render Pages Using Static Generation with Next.js'
// excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Praesent elementum facilisis leo vel fringilla est ullamcorper eget. At imperdiet dui accumsan sit amet nulla facilities morbi tempus.'
// coverImage: '/assets/blog/hello-world/cover.jpg'
// date: '2020-03-16T05:35:07.322Z'
// author:
//   name: Tim Neutkens
//   picture: '/assets/blog/authors/tim.jpeg'
// ogImage:
//   url: '/assets/blog/hello-world/cover.jpg'

export interface FaqPostData {
  slug?: string;
  title?: string;
  date?: string;
  content?: string;
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
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1))
  return posts
}

export async function markdownToHtml(markdown) {
  const result = await remark().use(html).process(markdown)
  return result.toString()
}
