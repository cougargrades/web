import React from 'react'
import { Box, CircularProgress, LinearProgress, Slider, Typography, type LinearProgressProps, type SliderProps } from '@mui/material'

import styles from './loading.module.scss'


/**
 * ## ARIA
 *
 * If the progress bar is describing the loading progress of a particular region of a page,
 * you should use `aria-describedby` to point to the progress bar, and set the `aria-busy`
 * attribute to `true` on that region until it has finished loading.
 *
 * Demos:
 *
 * - [Progress](https://material-ui.com/components/progress/)
 *
 * API:
 *
 * - [LinearProgress API](https://material-ui.com/api/linear-progress/)
 */
export function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 45 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.floor(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

export function SliderWithLabel(props: SliderProps & { label: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ minWidth: 100 }}>
        <Typography variant="body2" color="text.secondary">{props.label}</Typography>
      </Box>
      <Box sx={{ width: '100%', mr: 1 }}>
        <Slider {...props} />
      </Box>
    </Box>
  );
}


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
