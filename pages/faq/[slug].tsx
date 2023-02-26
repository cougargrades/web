import React, { useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { GetStaticPaths, GetStaticProps } from 'next'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import TimeAgo from 'timeago-react'
import { PankoRow } from '../../components/panko'
import { FaqPostBody } from '../../components/faqpostbody'
import { getPostBySlug, getAllPosts, FaqPostData, markdownToHtml } from '../../lib/faq'
import { SidebarContainer, SidebarItem } from '../../components/sidebarcontainer'

import styles from './slug.module.scss'
import interactivity from '../../styles/interactivity.module.scss'

export interface FaqPostProps {
  post: FaqPostData;
  allPosts: FaqPostData[];
}

export default function FaqPost({ post, allPosts }: FaqPostProps) {
  const router = useRouter()

  const sidebarItems: SidebarItem[] = Array.isArray(allPosts) ? allPosts.map(post => ({
    key: post.slug,
    categoryName: 'Frequently Asked Questions',
    title: post.title,
    href: `/faq/${post.slug}`,
  })) : []

  useEffect(() => {
    for(let item of sidebarItems) {
      if (item.href) {
        router.prefetch(item.href)
      }
    }
  },[sidebarItems])

  return (
    <>
      <Head>
        <title>{router.isFallback ? `FAQ / CougarGrades.io` : `${post.title} / CougarGrades.io FAQ`}</title>
        <meta name="description" content="Frequently Asked Questions" />
      </Head>
      <Container>
        <PankoRow />
      </Container>
      <SidebarContainer condensedTitle="Frequently Asked Questions" sidebarItems={sidebarItems}>
        <div className={styles.articleContainer}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Frequently Asked Question:
          </Typography>
          <FaqPostBody content={post.content ?? ''} />
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Last modified: <TimeAgo datetime={post.date ?? ''} locale={'en'} />
          </Typography>
        </div>
      </SidebarContainer>
    </>
  );
}

// See: https://nextjs.org/docs/basic-features/data-fetching#fallback-true
export const getStaticPaths: GetStaticPaths = async () => {
  const posts = getAllPosts(['slug']);

  return {
    paths: posts.map(post => ({
      params: {
        slug: post.slug
      }
    })),
    fallback: false
  }
}

export const getStaticProps: GetStaticProps<FaqPostProps> = async ({ params }) => {
  const slug = Array.isArray(params?.slug) ? params?.slug[0] : params?.slug
  const allPosts = getAllPosts(['slug','title'])
  const postFound = allPosts.map(e => e.slug).includes(slug) && slug !== undefined;
  const post = postFound ? getPostBySlug(slug, ['slug','title', 'date','content']) : {};
  if(postFound) {
    post.content = await markdownToHtml(post.content || '')
  }

  return { 
    props: { 
      post: {
        ...post,
      },
      allPosts: [
        ...getAllPosts(['slug','title'])
      ]
    }
  };
}
