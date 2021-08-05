import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import Tilty from 'react-tilty'
import Grid from '@material-ui/core/Grid'
import Chip from '@material-ui/core/Chip'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'
import Skeleton from '@material-ui/core/Skeleton'
import Typography from '@material-ui/core/Typography'
import { InstructorCard, InstructorCardEmpty, InstructorCardSkeleton } from '../components/instructorcard'
import { GroupResult, useGroupCoursesData } from '../lib/data/useAllGroups'
import { Carousel } from './carousel'

import styles from './grouprow.module.scss'
import interactivity from '../styles/interactivity.module.scss'

interface GroupRowProps {
  data: GroupResult;
}

export function GroupRow({ data }: GroupRowProps) {
  const router = useRouter()
  const { data: courses, status } = useGroupCoursesData(data)
  const RELATED_COURSE_LIMIT = 4 < data.courses.length ? 4 : data.courses.length;
  const REMAINING_COURSES = status === 'success' ? courses.length - RELATED_COURSE_LIMIT : data.courses.length - RELATED_COURSE_LIMIT;
  const LINK_TEXT = REMAINING_COURSES <= 0 || isNaN(REMAINING_COURSES) ? 'Show All' : `Show ${REMAINING_COURSES.toLocaleString()} More`;
  const isCoreGroup = data.categories.includes('UH Core Curriculum')

  // Used for prefetching all options which are presented
  useEffect(() => {
    for(let item of courses) {
      router.prefetch(item.href);
    }
  }, [courses]);

  return (
    <section className={styles.groupSection}> 
      <Typography variant="h3">
        {data.title}
      </Typography>
      <Typography gutterBottom variant="body1" color="text.secondary">
        {data.description}
      </Typography>
      { ! isCoreGroup ? <></> : <>
        <h6>Source:</h6>
        <Chip label="UH Core Curriculum 2020-2021 " component="a" href="http://publications.uh.edu/content.php?catoid=36&navoid=13119" className={interactivity.hoverActive} clickable />
      </>}
      <Carousel>
        { status === 'success' ? courses.slice(0,RELATED_COURSE_LIMIT).map(e => <Grid key={e.key} item><Tilty max={25}><InstructorCard data={e} fitSubtitle elevation={4} /></Tilty></Grid>
        ) : Array.from(new Array(RELATED_COURSE_LIMIT).keys()).map(e => <InstructorCardSkeleton key={e} />)}
        { status === 'success' && REMAINING_COURSES > 0 ? <InstructorCardEmpty text={LINK_TEXT} href={data.href} /> : <></>}
      </Carousel>
      <Divider className={styles.groupSectionDivider}>
        <Button variant="text" size="large" onClick={() => alert('hi')}>
          {LINK_TEXT}
        </Button>
      </Divider>
    </section>
  )
}

export function GroupRowSkeleton() {
  return (
    <section className={styles.groupSection}> 
      <Typography variant="h3">
        <Skeleton variant="text" />
      </Typography>
      <Typography gutterBottom variant="body1" color="text.secondary">
        <Skeleton variant="text" />
      </Typography>
      <Carousel>
        { [1,2,3].map(e => <InstructorCardSkeleton key={e} />)}
      </Carousel>
      <Divider className={styles.groupSectionDivider}>
        <Button variant="text" size="large" disabled>
          Show All
        </Button>
      </Divider>
    </section>
  )
}
