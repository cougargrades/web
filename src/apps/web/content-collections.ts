
import { z } from 'zod'
import { defineCollection, defineConfig } from '@content-collections/core'
import { markdownToHtml } from './src/server/markdown'

const posts = defineCollection({
  name: 'posts',
  directory: './src/content/faq', // Directory containing your .md files
  include: '*.md',
  schema: z.object({
    title: z.string(),
    date: z.iso.datetime(),
    content: z.string(),
  }),
  transform: async ({ content, ...post }) => {
    return {
      title: post.title,
      date: post.date,
      slug: post._meta.path,
      content: await markdownToHtml(content),
    }
  }
})

export default defineConfig({
  content: [posts],
})
