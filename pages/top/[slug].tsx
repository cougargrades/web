import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useAsync } from 'react-use'
import { z } from 'zod'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import Tooltip from '@mui/material/Tooltip'
import { PankoRow } from '../../components/panko'
import { FaqPostData } from '../../lib/faq'
import { POPULAR_TABS, TopLimit, TopMetric, TopTime, TopTopic } from '../../lib/top'
import { ErrorBoxIndeterminate, LoadingBoxIndeterminate } from '../../components/loading'
import { TopResult, useTopResults } from '../../lib/data/useTopResults'
import { TopListItem } from '../../components/TopListItem'
import { SidebarContainer } from '../../components/sidebarcontainer'
import { useSearchParams } from '@/lib/useSearchParams'

import styles from './slug.module.scss'
import interactivity from '../../styles/interactivity.module.scss'
import { useTypedSearchParams } from '@/lib/useTypedSearchParams'


export interface FaqPostProps {
  post: FaqPostData;
  allPosts: FaqPostData[];
}

const parseInt2 = (x: string | number) => typeof x === 'number' ? x : parseInt(x)

const TopQueryParams = z.object({
  viewLimit: z.coerce.number(),
  viewTime: z.enum(['all', 'lastMonth', 'lastYear']),
  hideCore: z.coerce.boolean(),
});
type TopQueryParams = z.infer<typeof TopQueryParams>

export default function TopPage({ post, allPosts }: FaqPostProps) {
  const router = useRouter()
  // const { query, ...router } = useTypedRouter(MySchema);
  // console.log('query?', query, 'router?', router);

  //const [searchParams, setSearchParams] = useSearchParams({ age: '99', foo: 'false' });
  const [searchParams, setSearchParams] = useTypedSearchParams(TopQueryParams, { viewLimit: 10, viewTime: 'all', hideCore: false });
  const { viewLimit, viewTime, hideCore } = searchParams
  const setViewLimit = (x: number) => setSearchParams({ ...searchParams, viewLimit: x })
  const setViewTime = (x: TopTime) => setSearchParams({ ...searchParams, viewTime: x })
  const setHideCore = (x: boolean) => setSearchParams({ ...searchParams, hideCore: x });
  
  useEffect(() => {
    console.log('searchParams changed?', searchParams);
  }, [searchParams]);

  const viewMetric: TopMetric = post?.slug?.includes('viewed') ? 'screenPageViews' : 'totalEnrolled'
  const viewTopic: TopTopic = post?.slug?.includes('instructor') ? 'instructor' : 'course'
  // const [viewLimit, setViewLimit] = useState<TopLimit>(10)
  // const [viewTime, setViewTime] = useState<TopTime>('all')
  //const [hideCore, setHideCore] = useState(false)

  const { data, status, error } = useTopResults({ metric: viewMetric, topic: viewTopic, limit: viewLimit, time: viewTime, hideCore: hideCore })
  const coreCurriculum = useAsync(async () => {
    const jsonData = await (await import('@cougargrades/publicdata/bundle/edu.uh.publications.core/core_curriculum.json')).default
    return new Set(jsonData.map(row => `${row.department} ${row.catalogNumber}`))
  }, [])

  useEffect(() => {
    if(status === 'success') {
      // preload referenced areas
      for(let item of data!) {
        router.prefetch(item.href)
      }
    }
  },[status,data,allPosts])

  useEffect(() => {
    if (viewMetric === 'totalEnrolled') {
      setViewTime('all')
    }
    else {
      setViewTime('lastMonth')
      setHideCore(false)
    }
  }, [viewMetric])

  useEffect(() => {
    // Doesn't actually do anything?
    if (viewTopic === 'instructor') {
      setHideCore(false)
    }
  }, [viewTopic])

  // useEffect(() => {
  //   if (hideCore === true && viewLimit === 10) {
  //     setViewLimit(25)
  //   }
  // }, [hideCore])

  return (
    <>
      <Head>
        <title>{router.isFallback ? `Popular / CougarGrades.io` : `${post.title} / CougarGrades.io Popular`}</title>
        <meta name="description" content={post.content ?? 'Popular content on CougarGrades'} />
      </Head>
      <Container>
        <PankoRow />
      </Container>
      <SidebarContainer condensedTitle="Popular" sidebarItems={allPosts.map(post => ({
        key: post.slug,
        categoryName: 'Popular',
        title: post.title,
        href: `/top/${post.slug}`,
        //disabled: post.slug?.endsWith('instructors')
      }))}>
        <div className={styles.articleContainer}>
          {/* <button onClick={() => {
            setSearchParams((prev) => {
              prev.set('age', `${parseInt(prev.get('age') ?? '0') + 1}`);
              return prev;
            }, { replace: true })
          }}>
            +1 Age ({searchParams.get('age')})
          </button> */}
          {/* <button onClick={() => {
            setSearchParams(prev => {
              prev.age = (prev.age ?? 0) + 1;
              return prev;
            }, { replace: true });
          }}>
            +1 Age ({searchParams.age})
          </button> */}
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
                <MenuItem value={250}>Top 250</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
              <InputLabel>Time Span</InputLabel>
              <Select label="Time Span" value={viewTime} onChange={(e) => setViewTime(e.target.value as any)}>
                <MenuItem value="lastMonth" disabled={viewMetric === 'totalEnrolled'}>Last Month</MenuItem>
                <MenuItem value="lastYear" disabled={viewMetric === 'totalEnrolled'}>Last Year</MenuItem>
                <MenuItem value="all">All Time</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
              <Tooltip title={viewTopic !== 'course' ? 'This option is not applicable to this page.' : ''}>
                <FormControlLabel
                  control={<Switch value={hideCore} onChange={e => setHideCore(e.target.checked)} />}
                  label={
                    <b className="dense">{`Hide "Core Curriculum" Courses`}</b>
                  }
                  labelPlacement="start"
                  disabled={viewTopic !== 'course'}
                  />
              </Tooltip>
            </FormControl>
          </Box>
          <List sx={{ width: '100%' }}>
            {
              status === 'success' && Array.isArray(data) && coreCurriculum.value !== undefined
              ? (
                <>
                {
                  data
                  .filter(item => hideCore ? !coreCurriculum.value?.has(item.id) : true)
                  .map((item, index, array) => (
                    <React.Fragment key={item.key}>
                      <TopListItem data={item} index={index} viewMetric={viewMetric} />
                      { index < (array.length - 1) ? <Divider variant="inset" component="li" /> : null }
                    </React.Fragment>
                  ))
                }
                {
                  data.filter(item => hideCore ? !coreCurriculum.value?.has(item.id) : true).length === 0
                  ? (
                    <Typography sx={{ textAlign: 'center' }} variant="body2" color="text.secondary">
                      There are no results with the current filters. You may need to expand the Count to a larger number.
                    </Typography>
                  )
                  : null
                }
                </>
              )
              : status === 'loading' 
              ? (
                <LoadingBoxIndeterminate title="Loading..." />
              )
              : (
                <ErrorBoxIndeterminate />
              )
            }
          </List>
        </div>
      </SidebarContainer>
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
  const slug = Array.isArray(params?.slug) ? params?.slug[0] : params?.slug
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
