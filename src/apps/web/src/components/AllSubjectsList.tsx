import React, { useState } from 'react'
import { useAsync } from 'react-use'
import { Box, Divider, List, ListItemButton, ListItemText, Typography } from '@mui/material'
import { pluralize } from '@cougargrades/models'
import type { TopResult } from '@cougargrades/models/dto'
import { isNullish } from '@cougargrades/utils/nullish'
import { ErrorBoxIndeterminate, LoadingBoxIndeterminate } from './loading'
import { TopListItem } from './TopListItem'

import styles from './AllSubjectsList.module.scss'
import interactivity from '../styles/interactivity.module.scss'
import { useAbbreviationMap, useCourseIndex } from '../lib/services/useStaticPublicData'



export interface AllSubjectsListProps {
  title: string;
  caption: string;
  onlySubjects?: string[];
}



export function AllSubjectsList({ title, caption, onlySubjects }: AllSubjectsListProps) {
  const { data: abbreviationMap, isPending: isAbbrMapPending, error: abbrMapError } = useAbbreviationMap()
  const { data: courseIndex, isPending: isCourseIdxPending, error: courseIdxError } = useCourseIndex();

  const isPending = isAbbrMapPending || isCourseIdxPending;
  const error = abbrMapError ?? courseIdxError ?? null;

  const subjects: string[] = Array.from(new Set((courseIndex ?? []).map(e => e.courseName.split(' ')[0])));

  const results: TopResult[] = (
    !isNullish(abbreviationMap) && !isNullish(courseIndex)
    ? subjects
      .filter(subj => 
        Array.isArray(onlySubjects) && onlySubjects.length > 0
        ? onlySubjects.includes(subj)
        : true
      )
      .map(subj => {
        const numCoursesUnderSubject = courseIndex.filter(e => e.courseName.startsWith(`${subj} `)).length;

        return {
          metricValue: 0,
          metricFormatted: '',
          metricTimeSpanFormatted: '',
          key: subj,
          href: `/g/${subj}`,
          title: subj in abbreviationMap ? `${abbreviationMap[subj as keyof typeof abbreviationMap]} (${subj})` : `"${subj}" Subject`,
          subtitle: `${numCoursesUnderSubject} ${pluralize({ quantity: numCoursesUnderSubject, rootWord: 'course' })} in this Subject`,
          caption: '',
          badges: [],
          id: subj,
          lastInitial: '',
        }
      })
    : []
  );

  return (
    <div className={styles.articleContainer}>
      <Typography variant="h4" color="text.primary">
        {title}{/* All Subjects */}
      </Typography>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        {caption} Here, a &quot;Subject&quot; refers to the 3-4 character prefix before a course number (<em>ex: <abbr title="English">ENGL</abbr>, <abbr title="Mathematics">MATH</abbr></em>)
      </Typography>
      <List sx={{ width: '100%' }}>
        {
        !isNullish(error)
        ? <>
        <ErrorBoxIndeterminate />
        </>
        : isPending
        ? <>
        <LoadingBoxIndeterminate title="Loading..." />
        </>
        : <>
        { results.map((item, index, array) => (
          <React.Fragment key={item.href}>
            <ListItemButton component="a" href={item.href}>
                <ListItemText
                  primary={<>
                  <strong>{item.title}</strong>
                  <></>
                  </>}
                  secondary={item.subtitle}
                />
              </ListItemButton>
            {/* <TopListItem data={item} index={index} viewMetric={'activeUsers'} hidePosition /> */}
            { index < (array.length - 1) ? <Divider variant="inset" /> : null }
          </React.Fragment>
        ))}
        </>
        }
      </List>
    </div>
  )
}
