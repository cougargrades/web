import React, { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useAsync } from 'react-use'
import { Box, Chip, Divider, List, ListItemButton, ListItemText, Typography } from '@mui/material'
import { pluralize } from '@cougargrades/models'
import type { PopulatedGroupResult, TopResult } from '@cougargrades/models/dto'
import { isNullish } from '@cougargrades/utils/nullish'
import { ErrorBoxIndeterminate, LoadingBoxIndeterminate } from './loading'
import { TopListItem } from './TopListItem'
import { useAbbreviationMap, useCourseIndex } from '../lib/services/useStaticPublicData'
import { useGroupData } from '../lib/services/useGroupData'

import styles from './RelatedGroupList.module.scss'
import interactivity from '../styles/interactivity.module.scss'




export interface RelatedGroupListProps {
  data: PopulatedGroupResult;
  showDescription?: boolean;
}



export function RelatedGroupList({ data, showDescription }: RelatedGroupListProps) {
  //const { topEnrolled, dataGrid } = useGroupData(data)
  // const { data: abbreviationMap, isPending: isAbbrMapPending, error: abbrMapError } = useAbbreviationMap()
  // const { data: courseIndex, isPending: isCourseIdxPending, error: courseIdxError } = useCourseIndex();

  // const isPending = isAbbrMapPending || isCourseIdxPending;
  // const error = abbrMapError ?? courseIdxError ?? null;

  // const subjects: string[] = Array.from(new Set((courseIndex ?? []).map(e => e.courseName.split(' ')[0])));

  // const results: TopResult[] = (
  //   !isNullish(abbreviationMap) && !isNullish(courseIndex)
  //   ? subjects
  //     .filter(subj => 
  //       Array.isArray(onlySubjects) && onlySubjects.length > 0
  //       ? onlySubjects.includes(subj)
  //       : true
  //     )
  //     .map(subj => {
  //       const numCoursesUnderSubject = courseIndex.filter(e => e.courseName.startsWith(`${subj} `)).length;

  //       return {
  //         metricValue: 0,
  //         metricFormatted: '',
  //         metricTimeSpanFormatted: '',
  //         key: subj,
  //         href: `/g/${subj}`,
  //         title: subj in abbreviationMap ? `${abbreviationMap[subj as keyof typeof abbreviationMap]} (${subj})` : `"${subj}" Subject`,
  //         subtitle: `${numCoursesUnderSubject} ${pluralize({ quantity: numCoursesUnderSubject, rootWord: 'course' })} in this Subject`,
  //         caption: '',
  //         badges: [],
  //         id: subj,
  //         lastInitial: '',
  //       }
  //     })
  //   : []
  // );

  console.log(data.relatedGroups);

  return (
    <div>
      <Typography variant="h4" className={styles.h1}>
        {data.name}
      </Typography>
      <Typography gutterBottom variant="body1" color="text.secondary" className={styles.p}>
        {data.description}
      </Typography>
      {
        data.sources.length > 0
        ? <>
        <h6>Sources:</h6> 
        {data.sources.map(e => (
          <Chip key={e.url} label={e.title} className={`${styles.chip} ${interactivity.hoverActive}`} component="a" href={e.url} clickable />
        ))}
        </>
        : null
      }
      {/* <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Here, a &quot;Subject&quot; refers to the 3-4 character prefix before a course number (<em>ex: <abbr title="English">ENGL</abbr>, <abbr title="Mathematics">MATH</abbr></em>)
      </Typography> */}
      <List sx={{ width: '100%' }}>
        { data.relatedGroups.map((item, index, array) => (
          <React.Fragment key={item.identifier}>
            <Link to={item.href} preload="intent" className="nostyle">
              <ListItemButton>
                {/* <ListItemText
                  primary={<>
                  <strong>{item.name}</strong>
                  <></>
                  </>}
                  secondary={`${item.courseCount} courses in this Subject`}
                /> */}
                <ListItemText
                  slotProps={{
                    secondary: {
                      component: 'div',
                    }
                  }}
                  primary={<>
                  <Typography component="span" variant="inherit" sx={{ fontWeight: 700 }}>
                    {item.name}
                  </Typography>
                  </>}
                  secondary={<>
                  <div className={styles.listItemSecondaryFlex}>
                    {
                      showDescription
                      ? <>
                      <Typography component="span" variant="inherit" className={styles.listItemSecondarySubtitle}>
                        {item.description}
                      </Typography>
                      <Typography component="span" variant="inherit" color="text.disabled">
                        {item.courseCount} courses {/* &bull; {item.sectionCount} sections */}
                      </Typography>
                      </>
                      : <>
                        <Typography component="span" variant="inherit" className={styles.listItemSecondarySubtitle}>
                          {item.courseCount} courses &bull; {item.sectionCount} sections
                        </Typography>
                      </>
                    }
                  </div>
                  </>}
                />
              </ListItemButton>
            </Link>
            {/* <TopListItem data={item} index={index} viewMetric={'activeUsers'} hidePosition /> */}
            { index < (array.length - 1) ? <Divider variant="inset" /> : null }
          </React.Fragment>
        ))}
      </List>
    </div>
  )
}
