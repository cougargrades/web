import Box, { BoxProps } from '@material-ui/core/Box'
import Tooltip from '@material-ui/core/Tooltip'
import CircleIcon from '@material-ui/icons/Circle'
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
}

export function EnrollmentInfo(props: EnrollmentInfoProps & BoxProps) {
  const { data, barHeight } = props
  return (
    <Box component="div" {...props}>
      <span className={`Progress ${styles.progressWrap}`} style={{ height: barHeight }}>
        { data.map(e => (
          e.percentage === 0 ? <React.Fragment key={e.key}></React.Fragment> : 
          <Tooltip key={e.key} placement="top" arrow title={e.value === -1 ? '' : `${e.value.toLocaleString()} total students have received ${e.title}s`}>
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
