import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useRecoilState } from 'recoil'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import Container from '@mui/material/Container'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import ListItem from '@mui/material/ListItem'
import Divider from '@mui/material/Divider'
import ListItemIcon from '@mui/material/ListItemIcon'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import TimeAgo from 'timeago-react'
import { FakeLink } from '../../components/link'
import { PankoRow } from '../../components/panko'
import { FaqPostBody } from '../../components/faqpostbody'
import { GroupNavSubheader, TableOfContentsWrap } from '../../components/groupnav'
import { getPostBySlug, getAllPosts, FaqPostData, markdownToHtml } from '../../lib/faq'
import { tocAtom } from '../../lib/recoil'
import { useIsCondensed } from '../../lib/hook'
import { POPULAR_TABS } from '../../lib/top'

import styles from './slug.module.scss'
import interactivity from '../../styles/interactivity.module.scss'
import instructorCardStyles from '../../components/instructorcard.module.scss'
import { Badge, grade2Color } from '../../components/badge'



export interface FaqPostProps {
  post: FaqPostData;
  allPosts: FaqPostData[];
}

export default function TopPage({ post, allPosts }: FaqPostProps) {
  const router = useRouter()
  const [_, setTOCExpanded] = useRecoilState(tocAtom)
  const condensed = useIsCondensed()

  const handleClick = (other: FaqPostData) => {
    router.push(`/top/${other.slug}`, undefined, { scroll: false })
    setTOCExpanded(false)
  }
  return (
    <>
      <Head>
        <title>{router.isFallback ? `Popular / CougarGrades.io` : `${post.title} / CougarGrades.io Popular`}</title>
        <meta name="description" content="Frequently Asked Questions" />
      </Head>
      <Container>
        <PankoRow />
      </Container>
      <main className={styles.main}>
        <aside className={styles.nav}>
          <TableOfContentsWrap condensedTitle={condensed ? 'Popular' : ''}>
            <List className={styles.sidebarList} subheader={condensed ? undefined : <GroupNavSubheader>Popular</GroupNavSubheader>}>
              {allPosts.map(other => (
                <React.Fragment key={other.slug}>
                  <FakeLink href={`/top/${other.slug}`}>
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
            {/* <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Frequently Asked Question:
            </Typography> */}
            <Typography variant="h4" color="text.primary">
              {post.title}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {post.content}
            </Typography>
            <List sx={{ width: '100%' }}>
              <ListItemButton alignItems="flex-start">
                <ListItemIcon sx={{ minWidth: '35px', marginTop: '7px' }}>
                  <Typography variant="h5" color="primary" sx={{ paddingTop: 0 }}>
                    #1
                  </Typography>
                </ListItemIcon>
                <ListItemText 
                  primary={<>
                    <Typography variant="h5" sx={{ paddingTop: 0 }}>
                      COSC 3320
                    </Typography>
                  </>}
                  secondary={<>
                    <Typography variant="subtitle1" color="text.secondary" sx={{ paddingTop: 0 }}>
                      Algorithms and Data Structures
                    </Typography>
                    <Box className={instructorCardStyles.badgeRow} sx={{ marginTop: '6px', fontSize: '0.8em' }}>
                      <Badge className={instructorCardStyles.badgeRowBadge} style={{ backgroundColor: grade2Color.get('B') }}>3.33 GPA</Badge>
                      <Badge className={instructorCardStyles.badgeRowBadge} style={{ backgroundColor: grade2Color.get('D') }}>0.430 SD</Badge>
                      <Badge className={instructorCardStyles.badgeRowBadge} style={{ backgroundColor: grade2Color.get('W') }}>12.3% W</Badge>
                    </Box>
                  </>}
                />
                <Typography sx={{ fontStyle: 'italic', padding: '4px' }} variant="body2" color="text.secondary" noWrap>
                  12.7k enrolled
                </Typography>
              </ListItemButton>
              <Divider variant="inset" component="li" />
              <ListItemButton alignItems="flex-start">
                <ListItemIcon sx={{ minWidth: '35px', marginTop: '7px' }}>
                  <Typography variant="h5" color="primary" sx={{ paddingTop: 0 }}>
                    #2
                  </Typography>
                </ListItemIcon>
                <ListItemText 
                  primary={<>
                    <Typography variant="h5" sx={{ paddingTop: 0 }}>
                      ENGL 1301
                    </Typography>
                  </>}
                  secondary={<>
                    <Typography variant="subtitle1" color="text.secondary" sx={{ paddingTop: 0 }}>
                      First Year Writing I
                    </Typography>
                    <Box className={instructorCardStyles.badgeRow} sx={{ marginTop: '6px', fontSize: '0.8em' }}>
                      <Badge className={instructorCardStyles.badgeRowBadge} style={{ backgroundColor: grade2Color.get('C') }}>2.92 GPA</Badge>
                      <Badge className={instructorCardStyles.badgeRowBadge} style={{ backgroundColor: grade2Color.get('D') }}>0.534 SD</Badge>
                      <Badge className={instructorCardStyles.badgeRowBadge} style={{ backgroundColor: grade2Color.get('W') }}>7.05% W</Badge>
                    </Box>
                  </>}
                />
                <Typography sx={{ fontStyle: 'italic', padding: '4px' }} variant="body2" color="text.secondary" noWrap>
                  9.2k enrolled
                </Typography>
              </ListItemButton>
              <Divider variant="inset" component="li" />
              <ListItemButton alignItems="flex-start">
                <ListItemIcon sx={{ minWidth: '35px', marginTop: '7px' }}>
                  <Typography variant="h5" color="primary" sx={{ paddingTop: 0 }}>
                    #3
                  </Typography>
                </ListItemIcon>
                <ListItemText 
                  primary={<>
                    <Typography variant="h5" sx={{ paddingTop: 0 }}>
                      HIST 1378
                    </Typography>
                  </>}
                  secondary={<>
                    <Typography variant="subtitle1" color="text.secondary" sx={{ paddingTop: 0 }}>
                      The U S Since 1877
                    </Typography>
                    <Box className={instructorCardStyles.badgeRow} sx={{ marginTop: '6px', fontSize: '0.8em' }}>
                      <Badge className={instructorCardStyles.badgeRowBadge} style={{ backgroundColor: grade2Color.get('C') }}>2.4 GPA</Badge>
                      <Badge className={instructorCardStyles.badgeRowBadge} style={{ backgroundColor: grade2Color.get('D') }}>0.503 SD</Badge>
                      <Badge className={instructorCardStyles.badgeRowBadge} style={{ backgroundColor: grade2Color.get('W') }}>22% W</Badge>
                    </Box>
                  </>}
                />
                <Typography sx={{ fontStyle: 'italic', padding: '4px' }} variant="body2" color="text.secondary" noWrap>
                  5.9k enrolled
                </Typography>
              </ListItemButton>
            </List>
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
  return {
    paths: POPULAR_TABS.map(post => ({
      params: {
        slug: post.slug
      }
    })),
    fallback: false
  }
}

export const getStaticProps: GetStaticProps<FaqPostProps> = async ({ params }) => {
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug
  const post = POPULAR_TABS.find(post => post.slug === slug)

  return {
    props: {
      post: {
        ...(post ?? { id: -1 }),
      },
      allPosts: [
        ...POPULAR_TABS,
      ]
    }
  };
}
