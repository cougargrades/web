import React from 'react'
import Container from '@mui/material/Container'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

import styles from './stickynotice.module.scss'

interface StickyNoticeProps {
  resourcePath: string;
}

export function StickyNotice({ resourcePath }: StickyNoticeProps) {
  return (
    <Container className={styles.stickyTop}>
      <Alert severity="success" >
        <AlertTitle>Sticky Notice</AlertTitle>
        Course {resourcePath} could not be found.
      </Alert>
    </Container>
  )
}
