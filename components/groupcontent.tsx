import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Chip from '@material-ui/core/Chip'
import Skeleton from '@material-ui/core/Skeleton'
import Typography from '@material-ui/core/Typography'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import Tilty from 'react-tilty'
import { Chart } from 'react-google-charts'
import { InstructorCard, InstructorCardSkeleton } from './instructorcard'
import { GroupResult } from '../lib/data/useAllGroups'
import { CoursePlus, useGroupData } from '../lib/data/useGroupData'
import { Carousel } from './carousel'
import { EnhancedTable } from './datatable'
import { CustomSkeleton } from './skeleton'

import styles from './groupcontent.module.scss'
import interactivity from '../styles/interactivity.module.scss'
import { LinearProgressWithLabel } from './uploader/progress'


interface GroupContentProps {
  data: GroupResult;
}

export function GroupContent({ data }: GroupContentProps) {
  const router = useRouter()
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const { data: { topEnrolled, dataGrid, dataChart, sectionLoadingProgress }, status } = useGroupData(data)
  const RELATED_COURSE_LIMIT = 4 < data.courses.length ? 4 : data.courses.length;
  const REMAINING_COURSES = status === 'success' ? topEnrolled.length - RELATED_COURSE_LIMIT : data.courses.length - RELATED_COURSE_LIMIT;
  const LINK_TEXT = REMAINING_COURSES <= 0 || isNaN(REMAINING_COURSES) ? 'Show All' : `Show ${REMAINING_COURSES.toLocaleString()} More`;
  const isCoreGroup = data.categories.includes('UH Core Curriculum')

  // Used for prefetching all options which are presented
  useEffect(() => {
    for(let item of topEnrolled) {
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
        <h6>Source:</h6>
        <Chip label="UH Core Curriculum 2020-2021 " component="a" href="http://publications.uh.edu/content.php?catoid=36&navoid=13119" className={interactivity.hoverActive} clickable />
      </>}
      <h3>Most Enrolled</h3>
      <Carousel>
        { topEnrolled.length > 0 ? topEnrolled.slice(0,RELATED_COURSE_LIMIT).map(e => <Grid key={e.key} item><Tilty max={25}><InstructorCard data={e} fitSubtitle elevation={prefersDarkMode ? 4 : 1} /></Tilty></Grid>
        ) : Array.from(new Array(RELATED_COURSE_LIMIT).keys()).map(e => <InstructorCardSkeleton key={e} />)}
      </Carousel>
      <h3>Data</h3>
      {/* {
        (status !== 'error' && dataChart.data.length > 1) ?
        <div className={styles.chartWrap}>
          <Chart
            width={'100%'}
            height={450}
            chartType="LineChart"
            loader={<CustomSkeleton width={'100%'} height={350} />}
            data={dataChart.data}
            options={dataChart.options}
            // prevent ugly red box when there's no data yet on first-mount
            chartEvents={[{ eventName: 'error', callback: (event) => event.google.visualization.errors.removeError(event.eventArgs[0].id) }]}
          />
        </div>
        :
        <Box className={styles.loadingFlex} height={150}>
          <strong>Loading {data.sections.length.toLocaleString()} sections...</strong>
          <div style={{ width: '80%' }}>
            <LinearProgressWithLabel value={Math.round(sectionLoadingProgress)} />
          </div>
        </Box>
      } */}
      <EnhancedTable<CoursePlus>
        title="Courses"
        columns={status !== 'error' ? dataGrid.columns : []}
        rows={status !== 'error' ? dataGrid.rows : []}
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
