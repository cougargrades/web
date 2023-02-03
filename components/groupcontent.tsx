import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Chip from '@mui/material/Chip'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import Tilty from '@au5ton/react-tilty'
import { Chart } from 'react-google-charts'
import { InstructorCard, InstructorCardSkeleton } from './instructorcard'
import { GroupResult, PopulatedGroupResult } from '../lib/data/useAllGroups'
import { CoursePlus, useGroupData } from '../lib/data/useGroupData'
import { Carousel } from './carousel'
import { EnhancedTable } from './datatable'
import { CustomSkeleton } from './skeleton'
import { LoadingBoxIndeterminate } from './loading'

import styles from './groupcontent.module.scss'
import interactivity from '../styles/interactivity.module.scss'


interface GroupContentProps {
  data: PopulatedGroupResult;
}

// This can be expensive to run, so here's a simple toggle
export const ENABLE_GROUP_SECTIONS: boolean = false

export function GroupContent({ data }: GroupContentProps) {
  const router = useRouter()
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const { data: data2, status } = useGroupData(data)
  const { topEnrolled, dataGrid, dataChart, sectionLoadingProgress } = data2 ?? {};
  const RELATED_COURSE_LIMIT = 4 < data.courses.length ? 4 : data.courses.length;
  const REMAINING_COURSES = status === 'success' ? topEnrolled!.length - RELATED_COURSE_LIMIT : data.courses.length - RELATED_COURSE_LIMIT;
  const LINK_TEXT = REMAINING_COURSES <= 0 || isNaN(REMAINING_COURSES) ? 'Show All' : `Show ${REMAINING_COURSES.toLocaleString()} More`;
  const isCoreGroup = data.categories.includes('#UHCoreCurriculum')

  // Used for prefetching all options which are presented
  useEffect(() => {
    for(let item of topEnrolled!) {
      router.prefetch(item.href);
    }
  }, [topEnrolled]);

  return (
    <section className={styles.groupSection}>
      <Typography variant="h1">
        {data.title}
      </Typography>
      <Typography gutterBottom variant="body1" color="text.secondary">
        {data.description}
      </Typography>
      { ! isCoreGroup ? <></> : <>
        <h6>Sources:</h6> 
        { status === 'success' ? data.sources.map(e => (
          <Chip key={e.url} label={e.title} className={`${styles.chip} ${interactivity.hoverActive}`} component="a" href={e.url} clickable />
        )) : [1,2].map(e => <CustomSkeleton key={e} width={230} height={32} />)}
      </>}
      <h3>Most Enrolled</h3>
      <Carousel>
        { topEnrolled!.length > 0 ? topEnrolled!.slice(0,RELATED_COURSE_LIMIT).map(e => <Grid key={e.key} item><Tilty max={25}><InstructorCard data={e} fitSubtitle elevation={prefersDarkMode ? 4 : 1} /></Tilty></Grid>
        ) : Array.from(new Array(RELATED_COURSE_LIMIT).keys()).map(e => <InstructorCardSkeleton key={e} />)}
      </Carousel>
      <h3 style={{ marginBottom: 'calc(8px * 2)' }}>Data</h3>
      {
        ENABLE_GROUP_SECTIONS ?
        (status === 'success' && dataChart!.data.length > 1) ?
        <div className={styles.chartWrap}>
          <Chart
            width={'100%'}
            height={450}
            chartType="LineChart"
            loader={<CustomSkeleton width={'100%'} height={350} />}
            data={dataChart!.data}
            options={dataChart!.options}
            // prevent ugly red box when there's no data yet on first-mount
            chartEvents={[{ eventName: 'error', callback: (event) => event.google.visualization.errors.removeError(event.eventArgs[0].id) }]}
          />
        </div>
        :
        <LoadingBoxIndeterminate title="Loading sections..." />
        : null
      }
      <EnhancedTable<CoursePlus>
        title="Courses"
        columns={status === 'success' ? dataGrid!.columns : []}
        rows={status === 'success' ? dataGrid!.rows : []}
        defaultOrderBy="id"
      />
    </section>
  )
}

export function GroupContentSkeleton() {
  return (
    <section className={styles.groupSection}> 
      <Typography variant="h3">
        <Skeleton variant="text" />
      </Typography>
      <Typography gutterBottom variant="body1" color="text.secondary">
        <Skeleton variant="text" />
      </Typography>
      <h3>Most Enrolled</h3>
      <Carousel>
        { [1,2,3].map(e => <InstructorCardSkeleton key={e} />)}
      </Carousel>
      <h3>Data</h3>
      <EnhancedTable<CoursePlus>
        title="Courses"
        columns={[]}
        rows={[]}
        defaultOrderBy="id"
      />
    </section>
  )
}
