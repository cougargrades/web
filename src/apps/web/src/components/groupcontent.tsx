import { Link } from '@tanstack/react-router'
import { Chip, Skeleton, Tooltip, Typography, useMediaQuery } from '@mui/material'
import type { CoursePlus, PopulatedGroupResult } from '@cougargrades/models/dto'
import { isNullish } from '@cougargrades/utils/nullish'
import Tilty from 'react-tilty'
import { InstructorCard, InstructorCardShowMore, InstructorCardSkeleton } from './instructorcard'
import { useGroupData } from '../lib/services/useGroupData'
import { Carousel } from './carousel'
import { EnhancedTable } from './datatable'

import styles from './groupcontent.module.scss'
import interactivity from '../styles/interactivity.module.scss'


interface GroupContentProps {
  data: PopulatedGroupResult;
}

export function GroupContent({ data }: GroupContentProps) {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const { topEnrolled, dataGrid } = useGroupData(data)
  const RELATED_COURSE_LIMIT = 4;
  const REMAINING_COURSES = (
    !isNullish(topEnrolled)
    ? topEnrolled!.length - RELATED_COURSE_LIMIT
    : data.courses.length - RELATED_COURSE_LIMIT
  );
  const LINK_TEXT = (
    REMAINING_COURSES <= 0 || isNaN(REMAINING_COURSES)
    ? 'Show All'
    : `Show ${REMAINING_COURSES.toLocaleString()} More`
  );
  const isCoreGroup = data.categories.includes('#UHCoreCurriculum')

  return (
    <section className={styles.groupSection}>
      <Typography variant="h1">
        {data.name}
      </Typography>
      <Typography gutterBottom variant="body1" color="text.secondary">
        {data.description}
      </Typography>
      {
        data.relatedGroups.length > 0
        ? (
          <>
          <h4>Related Groups:</h4>
          {
            data.relatedGroups.map(e => (
              <Tooltip key={e.identifier} title={e.description}>
                <Link to={e.href} className="nostyle" preload="intent">
                  <Chip label={e.shortName ?? e.name} className={`${styles.chip} ${interactivity.hoverActive}`} clickable />
                </Link>
              </Tooltip>
            ))
          }
          </>
        )
        : null
      }
      {
        isCoreGroup
        ? <>
        <h6>Sources:</h6> 
        {data.sources.slice(0, 2).map(e => (
          <Chip key={e.url} label={e.title} className={`${styles.chip} ${interactivity.hoverActive}`} component="a" href={e.url} clickable />
        ))}
        </>
        : null
      }
      <h3>Most Enrolled</h3>
      <Carousel>
        {
          topEnrolled.length
          ? (
            topEnrolled
              .slice(0, RELATED_COURSE_LIMIT)
              .map(e => 
                <Tilty key={e.key} max={25}>
                  <InstructorCard data={e} elevation={prefersDarkMode ? 4 : 1} />
                </Tilty>
              )
          )
          : Array.from(new Array(RELATED_COURSE_LIMIT).keys()).map(e => <InstructorCardSkeleton key={e} />)
        }
        {
          topEnrolled.length > RELATED_COURSE_LIMIT
          ? <InstructorCardShowMore
              cardTitle={`View all courses`}
              modalTitle={`Courses from ${data.shortName ?? data.name}`}
              data={topEnrolled} 
            />
          : null
        }
      </Carousel>
      <h3 style={{ marginBottom: 'calc(8px * 2)' }}>Data</h3>
      <EnhancedTable<CoursePlus>
        title="Courses"
        columns={dataGrid.columns}
        rows={dataGrid.rows}
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
