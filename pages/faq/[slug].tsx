import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useRecoilState } from 'recoil'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import TimeAgo from 'timeago-react'
import { FakeLink } from '../../components/link'
import { BlogNotifications } from '../../components/blog'
import { FaqPostBody } from '../../components/faqpostbody'
import { GroupNavSubheader, TableOfContentsWrap } from '../../components/groupnav'
import { getPostBySlug, getAllPosts, FaqPostData, markdownToHtml } from '../../lib/faq'
import { tocAtom } from '../../lib/recoil'
import { useIsCondensed } from '../../lib/hook'

import styles from './slug.module.scss'
import interactivity from '../../styles/interactivity.module.scss'

export interface FaqPostProps {
  post: FaqPostData;
  allPosts: FaqPostData[];
}

export default function FaqPost({ post, allPosts }: FaqPostProps) {
  const router = useRouter()
  const [_, setTOCExpanded] = useRecoilState(tocAtom)
  const condensed = useIsCondensed()

  const handleClick = (other: FaqPostData) => {
    router.push(`/faq/${other.slug}`, undefined, { scroll: false })
    setTOCExpanded(false)
  }
  return (
    <>
      <Head>
        <title>{router.isFallback ? `FAQ / CougarGrades.io` : `${post.title} / CougarGrades.io FAQ`}</title>
        <meta name="description" content="Frequently Asked Questions" />
      </Head>
      <div className="new-container">
        <BlogNotifications />
      </div>
      <main className={styles.main}>
        <aside className={styles.nav}>
          <TableOfContentsWrap condensedTitle={condensed ? 'Frequently Asked Questions' : ''}>
            <List className={styles.sidebarList} subheader={condensed ? undefined : <GroupNavSubheader>Frequently Asked Questions</GroupNavSubheader>}>
              {allPosts.map(other => (
                <React.Fragment key={other.slug}>
                  <FakeLink href={`/faq/${other.slug}`}>
                    <ListItemButton
                      selected={other.slug === post.slug}
                      onClick={() => handleClick(other)}
                      classes={{ root: `${styles.accordionRoot} ${interactivity.hoverActive}`, selected: styles.listItemSelected }}
                      dense
                      >
                      <ListItemText
                        primary={other.title}
                        primaryTypographyProps={{
                          color: (theme) => (other.slug === post.slug) ? theme.palette.text.primary : theme.palette.text.secondary,
                          fontWeight: 'unset'
                        }}
                        />
                    </ListItemButton>
                  </FakeLink>
                </React.Fragment>
              ))}
            </List>
          </TableOfContentsWrap>
        </aside>
        <article>
          <div className={styles.articleContainer}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Frequently Asked Question:
            </Typography>
            <FaqPostBody content={post.content} />
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Last modified: <TimeAgo datetime={post.date} locale={'en'} />
            </Typography>
          </div>
        </article>
      </main>
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
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug
  const allPosts = getAllPosts(['slug','title'])
  const postFound = allPosts.map(e => e.slug).includes(slug);
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
