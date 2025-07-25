import React from 'react'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import { LinearProgressWithLabel } from './uploader/progress'

import styles from './loading.module.scss'


export interface LoadingBoxLinearProgressProps {
  title: string;
  progress: number;
}

export function LoadingBoxLinearProgress({ title, progress }: LoadingBoxLinearProgressProps) {
  return (
    <Box className={styles.loadingFlex} height={150}>
      <strong>{title}</strong>
      <div style={{ width: '80%' }}>
        <LinearProgressWithLabel value={Math.round(progress)} />
      </div>
    </Box>
  )
}

export interface LoadingBoxIndeterminateProps {
  title: string;
}

export function LoadingBoxIndeterminate({ title }: LoadingBoxIndeterminateProps) {
  return (
    <Box className={styles.loadingFlex} height={150}>
      <strong>{title}</strong>
      <CircularProgress color="primary" />
    </Box>
  )
}

export interface ErrorBoxIndeterminateProps {
  errorMessage?: string;
}

export function ErrorBoxIndeterminate({ errorMessage }: ErrorBoxIndeterminateProps) {
  return (
    <Box className={styles.loadingFlex} height={150} sx={{ rowGap: '5px!important' }}>
      <strong>An unexpected error occurred</strong>
      <Typography variant="caption" color="text.secondary" sx={{ paddingTop: 0 }}>
        {errorMessage ?? 'Please try again later'}
      </Typography>
      <Typography variant="h3" color="text.primary" sx={{ paddingTop: 0, border: 'none', userSelect: 'none' }}>
        ⚠️
      </Typography>
    </Box>
  )
}
