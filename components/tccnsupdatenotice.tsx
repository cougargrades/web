import React from 'react'
import Link from 'next/link'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import FlagIcon from '@mui/icons-material/Flag'
import HelpIcon from '@mui/icons-material/Help'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import { TCCNSUpdateInfo } from '@cougargrades/types'

import styles from './tccnsupdatenotice.module.scss'
import interactivity from '../styles/interactivity.module.scss'

interface TCCNSUpdateNoticeProps {
  data: TCCNSUpdateInfo;
}


export function TCCNSUpdateNotice({ data }: TCCNSUpdateNoticeProps) {
  return (
    <Link href={data.courseHref} passHref>
      <Tooltip title={<TCCNSUpdateTooltip data={data} />} placement="bottom">
        <Button variant="text" size="small" color="warning" className={interactivity.hoverActive} style={{ marginRight: '0.35rem', marginBottom: '0.35rem' }} startIcon={<FlagIcon />}>
          {data.shortMessage}
        </Button>
      </Tooltip>
    </Link>
  )
}

function TCCNSUpdateTooltip({ data }: TCCNSUpdateNoticeProps) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={0}
    >
      <div>
        <Typography variant="caption" color="inherit">{data.longMessage}</Typography>
      </div>
      <a href={data.sourceHref} target="_blank" rel="noreferrer" className={styles.tooltipLink}>
        <IconButton
          size="small"
          color="inherit"
        >
          <HelpIcon fontSize="small" />
        </IconButton>
      </a>
    </Stack>
  )
}
