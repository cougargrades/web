import React, { useState } from 'react'
import Link from 'next/link'
import { TopResult } from '../lib/data/useTopResults'
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import { Badge } from './badge'
import { TopMetric } from '../lib/top_back';

import styles from './TopListItem.module.scss'
//import interactivity from '../../styles/interactivity.module.scss'
import instructorCardStyles from './instructorcard.module.scss'

interface TopListItemProps {
  data: TopResult;
  index: number;
  viewMetric: TopMetric;
}

export function TopListItem({ data: item, index, viewMetric }: TopListItemProps) {
  return (
    <Link href={item.href} passHref>
      <ListItemButton component="a" alignItems="flex-start">
        <ListItemIcon className={styles.topItemIcon}>
          <Typography variant="h5" color="primary" sx={{ paddingTop: 0 }} data-value={index + 1}>
            {
            index + 1 <= 10
            ? `#${index + 1}`
            : <span style={{ fontSize: (index + 1 < 100 ? '0.7em' : '0.6em' ) }}>#{index + 1}</span>
            }
          </Typography>
        </ListItemIcon>
        <ListItemText className={styles.topItemText} 
          primary={<>
            <Typography variant="h5" className={styles.topItemTitle}>
              {item.title}
            </Typography>
          </>}
          secondary={<>
            <Typography variant="subtitle1" color="text.secondary" className={styles.topItemSubtitle}>
              {
                item.subtitle.length <= 50
                ? `${item.subtitle}`
                : <span style={{ fontSize: item.subtitle.length <= 60 ? '0.9em' : '0.8em' }}>{item.subtitle}</span>
              }
            </Typography>
            <Box className={instructorCardStyles.badgeRow} sx={{ marginTop: '6px', fontSize: '0.8em' }}>
              { item.badges.map(b => (
                <Tooltip key={b.key} title={b.caption ?? ''}>
                  <Badge style={{ backgroundColor: b.color }} className={instructorCardStyles.badgeRowBadge}>{b.text}</Badge>
                </Tooltip>
              ))}
            </Box>
          </>}
        />
        <Typography className={styles.hintedMetric} variant="body2" color="text.secondary" noWrap>
          {item.metricFormatted}{ viewMetric === 'totalEnrolled' ? <span className={styles.hintedMetricExtended}>{' '}since {item.metricTimeSpanFormatted}</span> : null}
        </Typography>
      </ListItemButton>
    </Link>
  )
}
