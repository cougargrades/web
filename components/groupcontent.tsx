import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import Tilty from 'react-tilty'
import Grid from '@material-ui/core/Grid'
import Chip from '@material-ui/core/Chip'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'
import Skeleton from '@material-ui/core/Skeleton'
import Typography from '@material-ui/core/Typography'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { InstructorCard, InstructorCardSkeleton } from './instructorcard'
import { GroupResult } from '../lib/data/useAllGroups'
import { CoursePlus, useGroupData } from '../lib/data/useGroupData'
import { Carousel } from './carousel'

import styles from './groupcontent.module.scss'
import interactivity from '../styles/interactivity.module.scss'
import { EnhancedTable } from './datatable'


interface GroupContentProps {
  data: GroupResult;
}

export function GroupContent({ data }: GroupContentProps) {
  const router = useRouter()
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const { data: { topEnrolled, dataGrid }, status } = useGroupData(data)
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
        { status === 'success' ? topEnrolled.slice(0,RELATED_COURSE_LIMIT).map(e => <Grid key={e.key} item><Tilty max={25}><InstructorCard data={e} fitSubtitle elevation={prefersDarkMode ? 4 : 1} /></Tilty></Grid>
        ) : Array.from(new Array(RELATED_COURSE_LIMIT).keys()).map(e => <InstructorCardSkeleton key={e} />)}
      </Carousel>
      <h3>Data</h3>
      <EnhancedTable<CoursePlus>
        title="Past Sections"
        columns={status === 'success' ? dataGrid.columns : []}
        rows={status === 'success' ? dataGrid.rows : []}
        defaultOrderBy="id"
      />
      <Divider className={styles.groupSectionDivider}>
        <Button variant="text" size="large" onClick={() => alert('hi')}>
          {LINK_TEXT}
        </Button>
      </Divider>
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
        title="Past Sections"
        columns={[]}
        rows={[]}
        defaultOrderBy="id"
      />
      <Divider className={styles.groupSectionDivider}>
        <Button variant="text" size="large" disabled>
          Show All
        </Button>
      </Divider>
    </section>
  )
}
