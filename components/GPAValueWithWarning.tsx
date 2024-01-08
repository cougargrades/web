import React, { } from 'react'
import Link from 'next/link'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import ErrorIcon from '@mui/icons-material/Error'
import { SectionPlus } from '../lib/data/useCourseData';
import { estimateGPA } from '../lib/util';

interface GPAValueWithWarningProps {
  value: number | null;
  row: SectionPlus;
}

export function GPAValueWithWarning({ value, row }: GPAValueWithWarningProps) {
  return (
    /* 0.25 = median standard deviation for instructor GPAs (source: random SQLite query from a long time ago) */
    typeof(value) === 'number' && Math.abs(value - estimateGPA(row)) > 0.25
    ? (
      <span style={{ display: 'inline-flex', gap: '4px' }}>
        <span>{value}</span>
        <Tooltip placement="bottom" arrow enterTouchDelay={100} leaveTouchDelay={10_000} title={
          <>
            <Typography color="inherit" variant="subtitle1" sx={{ paddingTop: '0' }}>
              Estimated GPA: <strong>{estimateGPA(row).toFixed(3)}</strong>
            </Typography>
            <Typography color="inherit" variant="subtitle2" sx={{ paddingTop: '0' }}>
              What is this?
            </Typography>
            Some inconsistencies have been detected with this GPA value. This may be a result of incorrectly calculated data provided by UH.
            To learn more, <span className="pale"><Link href="/faq/interim-grading-theory" >read our FAQ</Link></span>.
          </>
        }>
          <ErrorIcon fontSize="small" color="warning" />
        </Tooltip>
      </span>
    )
    : <span>{value}</span>
  )
}
