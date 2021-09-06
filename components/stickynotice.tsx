import React from 'react'
import Container from '@material-ui/core/Container'
import Alert from '@material-ui/core/Alert'
import AlertTitle from '@material-ui/core/AlertTitle'

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
