import React from 'react';
import { createFileRoute, notFound, useNavigate, useRouter } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import type { TopMetric, TopTime, TopTopic } from '@cougargrades/models/dto';
import { isNullish } from '@cougargrades/utils/nullish';
import { Box, Container, Divider, FormControl, FormControlLabel, InputLabel, List, MenuItem, Select, Switch, Tooltip, Typography } from '@mui/material'

import { useTopResults } from '../../lib/services/useTopResults';
import { POPULAR_TABS } from '../../lib/top';
import { PankoRow } from '../../components/panko';
import { ErrorBoxIndeterminate, LoadingBoxIndeterminate } from '../../components/loading';
import { TopListItem } from '../../components/TopListItem';


import styles from './slug.module.scss'
import { SidebarContainer } from '../../components/sidebarcontainer';


function getPostData(slug: string) {
  const allPosts = POPULAR_TABS;
  const post = POPULAR_TABS.find(p => p.slug === slug);
  return {
    allPosts,
    post,
  }
}

export const Route = createFileRoute('/top/$slug')({
  head(ctx) {
    const slug = ctx.params.slug;
    const { post, allPosts } = getPostData(slug);
    return {
      meta: [
        { title: isNullish(post) ? `Popular / CougarGrades.io` : `${post.title} / CougarGrades.io Popular` },
        { name: 'description', content: post?.content ?? 'Popular content on CougarGrades' }
      ]
    }
  },
  loader(ctx) {
    const { post } = getPostData(ctx.params.slug);
    if (isNullish(post)) {
      throw notFound();
    }
    //ctx.context.queryClient.ensureQueryData();
  },
  validateSearch: z.object({
    viewLimit: z.coerce.number().default(10),
    viewTime: z.enum(['all', 'lastMonth', 'lastYear']).default('all'),
    //hideCore: z.stringbool().optional().default(false),
    hideCore: z.coerce.boolean().default(false),
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter();
  const { slug } = Route.useParams();
  const { post, allPosts } = getPostData(slug);
  const searchParams = Route.useSearch();
  const { viewLimit, viewTime, hideCore } = searchParams
  
  // Example updating search params:
  // 
  const navigate = useNavigate({ from: Route.fullPath })

  const setSearchParams = (opt: Partial<typeof searchParams>) => navigate({ search: (prev) => ({ ...prev, ...opt }), replace: true, resetScroll: false })
  const setViewLimit = (x: number) => setSearchParams({ viewLimit: x })
  const setViewTime = (x: TopTime) => setSearchParams({ viewTime: x })
  const setHideCore = (x: boolean) => setSearchParams({  hideCore: x });

  const viewMetric: TopMetric = slug.includes('viewed') ? 'pageView' : 'totalEnrolled'
  const viewTopic: TopTopic = slug.includes('instructor') ? 'instructor' : 'course'

  const { data, status, error } = useTopResults({ metric: viewMetric, topic: viewTopic, limit: viewLimit, time: viewTime, hideCore: hideCore });
  
  //router.preloadRoute()
  
  
  return (
    <>
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
        <Typography variant="h4" color="text.primary">
          {post?.title ?? '(Unknown)'}
        </Typography>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          {post?.content ?? '(Unknown)'}
        </Typography>
        <Box className={styles.controlBox}>
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel>Count</InputLabel>
            <Select label="Count" value={viewLimit} onChange={(e) => setViewLimit(e.target.value)}>
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
                control={<Switch checked={hideCore} onChange={e => setHideCore(e.target.checked)} slotProps={{ input: { 'aria-label': 'controlled' }}} />}
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
            status === 'success' && Array.isArray(data)
            ? (
              <>
              {
                data
                .map((item, index, array) => (
                  <React.Fragment key={item.key}>
                    <TopListItem data={item} index={index} viewMetric={viewMetric} />
                    { index < (array.length - 1) ? <Divider variant="inset" component="li" /> : null }
                  </React.Fragment>
                ))
              }
              {
                data.length === 0
                ? (
                  <Typography sx={{ textAlign: 'center' }} variant="body2" color="text.secondary">
                    There are no results with the current filters. You may need to expand the Count to a larger number.
                  </Typography>
                )
                : null
              }
              </>
            )
            : status === 'pending' 
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
  )
}
