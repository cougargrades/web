import * as React from 'react'
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Slider, { SliderProps } from '@mui/material/Slider';

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
