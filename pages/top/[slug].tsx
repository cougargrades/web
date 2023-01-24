import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { GetStaticPaths, GetStaticProps } from 'next'
import useSWR from 'swr/immutable'
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
import { POPULAR_TABS, TopLimit, TopMetric, TopTime, TopTopic } from '../../lib/top_front'
import { Badge, grade2Color } from '../../components/badge'
import { ErrorBoxIndeterminate, LoadingBoxIndeterminate } from '../../components/loading'
import type { CoursePlusMetrics, InstructorPlusMetrics } from '../../lib/trending'
import { ObservableStatus } from '../../lib/data/Observable'
import { useTopResults } from '../../lib/data/useTopResults'

import styles from './slug.module.scss'
import interactivity from '../../styles/interactivity.module.scss'
import instructorCardStyles from '../../components/instructorcard.module.scss'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'


export interface FaqPostProps {
  post: FaqPostData;
  allPosts: FaqPostData[];
}

const parseInt2 = (x: string | number) => typeof x === 'number' ? x : parseInt(x)

export default function TopPage({ post, allPosts }: FaqPostProps) {
  const router = useRouter()
  const [_, setTOCExpanded] = useRecoilState(tocAtom)
  const condensed = useIsCondensed()

  const viewMetric: TopMetric = post?.slug?.includes('viewed') ? 'screenPageViews' : 'totalEnrolled'
  const viewTopic: TopTopic = post?.slug?.includes('instructor') ? 'instructor' : 'course'
  const [viewLimit, setViewLimit] = useState<TopLimit>(10)
  const [viewTime, setViewTime] = useState<TopTime>('all')

  const { data, status, error } = useTopResults({ metric: viewMetric, topic: viewTopic, limit: viewLimit, time: viewTime })

  const handleClick = (other: FaqPostData) => {
    router.push(`/top/${other.slug}`, undefined, { scroll: false })
    setTOCExpanded(false)
  }

  useEffect(() => {
    if (viewMetric === 'totalEnrolled') {
      setViewTime('all')
    }
    else {
      setViewTime('lastMonth')
    }
  }, [viewMetric])

  return (
    <>
      <Head>
        <title>{router.isFallback ? `Popular / CougarGrades.io` : `${post.title} / CougarGrades.io Popular`}</title>
        <meta name="description" content={post.content ?? "Popular courses on CougarGrades"} />
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
            <Typography variant="h4" color="text.primary">
              {post.title}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {post.content}
            </Typography>
            <Box className={styles.controlBox}>
              <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                <InputLabel>Count</InputLabel>
                <Select label="Count" value={viewLimit} onChange={(e) => setViewLimit(parseInt2(e.target.value))}>
                  <MenuItem value={10}>Top 10</MenuItem>
                  <MenuItem value={25}>Top 25</MenuItem>
                  <MenuItem value={50}>Top 50</MenuItem>
                  <MenuItem value={100}>Top 100</MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                <InputLabel>Time Span</InputLabel>
                <Select label="Time Span" value={viewTime} onChange={(e) => setViewLimit(parseInt2(e.target.value))}>
                  <MenuItem value="lastMonth" disabled={viewMetric === 'totalEnrolled'}>Last Month</MenuItem>
                  <MenuItem value="all">All Time</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <List sx={{ width: '100%' }}>
              {
              status === 'error'
              ? <>
              <ErrorBoxIndeterminate />
              </>
              : status === 'loading'
              ? <>
              <LoadingBoxIndeterminate title="Loading..." />
              </>
              : <>
              { data.map((item, index, array) => (
                <React.Fragment key={item.key}>
                  <ListItemButton alignItems="flex-start">
                    <ListItemIcon className={styles.topItemIcon}>
                      <Typography variant="h5" color="primary" sx={{ paddingTop: 0 }} data-value={index + 1}>
                        {
                        index + 1 <= 10
                        ? `#${index + 1}`
                        : <span style={{ fontSize: (index + 1 < 100 ? '0.7em' : '0.6em' ) }}>#{index + 1}</span>
                        }
                      </Typography>
                    </ListItemIcon>
                    <ListItemText className={styles.topItemText} 
                      primary={<>
                        <Typography variant="h5" className={styles.topItemTitle}>
                          {item.title}
                        </Typography>
                      </>}
                      secondary={<>
                        <Typography variant="subtitle1" color="text.secondary" className={styles.topItemSubtitle}>
                          {
                            item.subtitle.length <= 50
                            ? `${item.subtitle}`
                            : <span style={{ fontSize: item.subtitle.length <= 60 ? '0.9em' : '0.8em' }}>{item.subtitle}</span>
                          }
                        </Typography>
                        <Box className={instructorCardStyles.badgeRow} sx={{ marginTop: '6px', fontSize: '0.8em' }}>
                          { item.badges.map(b => (
                            <Tooltip key={b.key} title={b.caption}>
                              <Badge style={{ backgroundColor: b.color }} className={instructorCardStyles.badgeRowBadge}>{b.text}</Badge>
                            </Tooltip>
                          ))}
                        </Box>
                      </>}
                    />
                    <Typography className={styles.hintedMetric} variant="body2" color="text.secondary" noWrap>
                      {item.metricFormatted}<span className={styles.hintedMetricExtended}>{' '}since {item.metricTimeSpanFormatted}</span>
                    </Typography>
                  </ListItemButton>
                  { index < (array.length - 1) ? <Divider variant="inset" component="li" /> : null }
                </React.Fragment>
              ))}
              </>
              }
            </List>
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