import React from 'react'
import Link from 'next/link'
import Stack from '@material-ui/core/Stack'
import Button from '@material-ui/core/Button'
import FlagIcon from '@material-ui/icons/Flag'
import HelpIcon from '@material-ui/icons/Help'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import { TCCNSUpdateInfo } from '@cougargrades/types'

import styles from './tccnsupdatenotice.module.scss'
import interactivity from '../styles/interactivity.module.scss'

interface TCCNSUpdateNoticeProps {
  data: TCCNSUpdateInfo;
}


export function TCCNSUpdateNotice({ data }: TCCNSUpdateNoticeProps) {
  return (
    <Link href={data.courseHref} passHref>
      <Tooltip title={<TCCNSUpdateTooltip data={data} />} placement="right">
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
      <a href={data.sourceHref} className={styles.tooltipLink}>
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
