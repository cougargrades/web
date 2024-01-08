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

// Not direct dependencies, use with caution
import type { Plugin, Transformer } from 'unified'
import type { Root, Element } from 'hast'
import { common } from 'lowlight'
import HighlightJs from 'highlight.js/lib/core'
import {visit} from 'unist-util-visit'

/* Turn `js` into `JavaScript`, etc */
function getFormattedLanguageName(name: string): string | undefined {
  return common[name]?.(HighlightJs.newInstance())['name'];
}

/**
 * On code blocks like ```js, put the language name in a "rel" attribute on the <pre>
 * 
 * Reference:
 * - https://github.com/rehypejs/rehype-highlight/blob/8fbc0ebd3a0c488e7f024ef5af6983c4b49686d1/lib/index.js
 * - https://github.com/highlightjs/highlight.js/blob/6a52185d9b855130b5acaccef143a7bd602e7885/src/languages/cpp.js#L554
 */
export const annotateProgrammingLanguageName: Plugin<any[], Root, Root> = () => async (root, file) => {
  /* Determines the language used based on the CSS class */
  const getLanguageFromCssClass = (node: Element): string | undefined => {
    const classes = node.properties?.className;
    if (!Array.isArray(classes)) return;

    let name: string | undefined;

    for(let clazz of classes) {
      const value = String(clazz)

      if (value === 'no-highlight' || value === 'nohighlight') {
        return undefined;
      }

      if (!name && value.slice(0, 5) === 'lang-') {
        name = value.slice(5)
      }

      if (!name && value.slice(0, 9) === 'language-') {
        name = value.slice(9)
      }
    }

    return name;
  };

  /* Recursively visits all the nodes by some criteria, much cleaner. */
  visit(root, 'element', (node, _, parent) => {
    // Must be a specific arrangement of <pre> > <code> nodes
    if (
      node.tagName !== 'code' ||
      !parent ||
      parent.type !== 'element' ||
      parent.tagName !== 'pre'
    ) {
      return;
    }

    // Must be able to determine the language
    const lang = getLanguageFromCssClass(node);
    if (!lang) return;

    // Get the formatted name (fallback to codename) and write the "rel" attribute
    const formattedLang = getFormattedLanguageName(lang) ?? lang;
    parent.properties = {
      ...(parent.properties ?? {}),
      'rel': formattedLang,
    };
  });
  
  return;
}

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
    .use(annotateProgrammingLanguageName)
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
        pre: [
          ...(defaultSchema.attributes?.['pre'] ?? []),
          'rel',
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
