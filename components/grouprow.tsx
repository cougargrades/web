import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Tilty from 'react-tilty'
import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { InstructorCard, InstructorCardEmpty, InstructorCardSkeleton } from '../components/instructorcard'
import { GroupResult, useGroupCoursesData } from '../lib/data/useAllGroups'
import { Carousel } from './carousel'

import styles from './grouprow.module.scss'

interface GroupRowProps {
  data: GroupResult;
}

export function GroupRow({ data }: GroupRowProps) {
  const router = useRouter()
  const { data: courses, status } = useGroupCoursesData(data.courses)
  const RELATED_COURSE_LIMIT = 4 < data.courses.length ? 4 : data.courses.length;
  const REMAINING_COURSES = status === 'success' ? courses.length - RELATED_COURSE_LIMIT : data.courses.length - RELATED_COURSE_LIMIT;
  const LINK_TEXT = REMAINING_COURSES <= 0 || isNaN(REMAINING_COURSES) ? 'Show All' : `Show ${REMAINING_COURSES.toLocaleString()} More`;

  return (
    <section className={styles.groupSection}> 
      <Typography variant="h3">
        {data.title}
      </Typography>
      <Typography gutterBottom variant="body1" color="text.secondary">
        {data.description}
      </Typography>
      <Carousel>
        { status === 'success' ? courses.slice(0,RELATED_COURSE_LIMIT).map(e => <Grid key={e.key} item><Tilty max={25}><InstructorCard data={e} fitSubtitle /></Tilty></Grid>
        ) : Array.from(new Array(RELATED_COURSE_LIMIT).keys()).map(e => <InstructorCardSkeleton key={e} />)}
        { status === 'success' && REMAINING_COURSES > 0 ? <InstructorCardEmpty text={LINK_TEXT} onClick={() => router.push(data.href)} /> : ''}
      </Carousel>
      <Divider className={styles.groupSectionDivider}>
        <Link href={data.href} passHref>
          <Button variant="text">
            {LINK_TEXT}
          </Button>
        </Link>
      </Divider>
    </section>
  )
}
