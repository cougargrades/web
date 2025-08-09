import Box, { BoxProps } from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import CircleIcon from '@mui/icons-material/Circle'
import React from 'react'

import styles from './enrollment.module.scss'

interface EnrollmentInfoProps {
  data: EnrollmentInfoResult[];
  barHeight?: number | string;
}

export interface EnrollmentInfoResult {
  key: string | number;
  title: string;
  color: string;
  value: number;
  percentage: number;
  tooltip?: string;
}

export function EnrollmentInfo(props: EnrollmentInfoProps & BoxProps) {
  const { data, barHeight } = props
  return (
    <Box component="div" {...props}>
      <span className={`Progress ${styles.progressWrap}`} style={{ height: barHeight }}>
        { data.map(e => (
          e.percentage === 0 ? <React.Fragment key={e.key}></React.Fragment> : 
          <Tooltip key={e.key} placement="bottom" arrow title={e.tooltip}>
            <span className="Progress-item" style={{ width: `${e.percentage}%`, backgroundColor: e.color }}></span>
          </Tooltip>
        ))}
      </span>
      <ul className={styles.legend}>
        { data.map(e => (
          <li key={e.key}>
            <a>
              <CircleIcon htmlColor={e.color} />
              <span>{e.title}</span>
              <span>{`${e.percentage.toFixed(1)}%`}</span>
            </a>
          </li>
        ))}
      </ul>
    </Box>
  )
}
