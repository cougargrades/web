import React, { useState } from 'react'
import { useAsync } from 'react-use'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemButton from '@mui/material/ListItemButton'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { TopResult } from '../lib/data/useTopResults'
import { ObservableStatus } from '../lib/data/Observable'
import { ErrorBoxIndeterminate, LoadingBoxIndeterminate } from './loading'
import { TopListItem } from './TopListItem'
import { pluralize } from '../lib/i18n'

import styles from './AllSubjectsList.module.scss'
import interactivity from '../../styles/interactivity.module.scss'

export interface AllSubjectsListProps {
  title: string;
  caption: string;
  onlySubjects?: string[];
}

export function AllSubjectsList({ title, caption, onlySubjects }: AllSubjectsListProps) {
  const abbr = useAsync(async () => {
    const abbreviationMap = await (await import('@cougargrades/publicdata/bundle/edu.uh.publications.subjects/subjects.json')).default
    return abbreviationMap
  }, [])
  const abbreviationMap = abbr.value ?? null;
  const state = useAsync(async () => {
    const courseIndex = await (await import('@cougargrades/publicdata/bundle/io.cougargrades.searchable/courses.json')).data
    return courseIndex
  }, [])
  const status: ObservableStatus = state.error ? 'error' : state.loading ? 'loading' : state.value === undefined ? 'loading' : 'success'
  
  const subjects: string[] = status === 'success' ? Array.from(new Set(state.value!.map(e => e.courseName.split(' ')[0]))) : []

  // const results: TopResult[] = status === 'success' ? state.value!.filter(e => e.courseName.split(' ')[0] === currentSubject).map(e => ({
  //   metricValue: 0,
  //   metricFormatted: '',
  //   metricTimeSpanFormatted: '',
  //   key: e.href,
  //   href: e.href,
  //   title: e.courseName,
  //   subtitle: e.description,
  //   caption: e.publicationTextContent,
  //   badges: [],
  //   id: e.href,
  //   lastInitial: '',
  // })) : []

  const results: TopResult[] = status === 'success' && abbreviationMap !== null ? subjects.filter(subj => Array.isArray(onlySubjects) && onlySubjects.length > 0 ? onlySubjects.includes(subj) : true).map(subj => ({
    metricValue: 0,
    metricFormatted: '',
    metricTimeSpanFormatted: '',
    key: subj,
    href: `/g/${subj}`,
    title: subj in abbreviationMap ? `${abbreviationMap[subj as keyof typeof abbreviationMap]} (${subj})` : `"${subj}" Subject`,
    subtitle: `${state.value!.filter(e => e.courseName.startsWith(`${subj} `)).length} ${pluralize({ quantity: state.value!.filter(e => e.courseName.startsWith(`${subj} `)).length, rootWord: 'course' })} in this Subject`,
    caption: '',
    badges: [],
    id: subj,
    lastInitial: '',
  })) : []

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
        status === 'error'
        ? <>
        <ErrorBoxIndeterminate />
        </>
        : status === 'loading'
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
