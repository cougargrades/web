import React, { useState } from 'react'
import Link from 'next/link'
import { useTheme } from '@mui/material/styles'
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import { areaElementClasses } from '@mui/x-charts/LineChart';
import { Badge } from './badge'
import { TopResult } from '../lib/data/useTopResults'
import { arrayLastEntries, formatTermCode } from '@/lib/util'
import type { TopMetric } from '../lib/data/back/getTopResults'


import styles from './TopListItem.module.scss'
//import interactivity from '../../styles/interactivity.module.scss'
import instructorCardStyles from './instructorcard.module.scss'

interface TopListItemProps {
  data: TopResult;
  index: number;
  viewMetric: TopMetric;
  hidePosition?: boolean;
}

function AreaGradient({ id, color }: { id: string, color: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.3} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}

export function TopListItem({ data: item, index, viewMetric, hidePosition }: TopListItemProps) {
  const theme = useTheme();
  const primaryColor = theme.palette.mode === 'light' ? theme.palette.primary.light : theme.palette.primary.dark;
  //console.log('item?', item);
  return (
    <Link href={item.href} passHref legacyBehavior>
      <ListItemButton component="a" alignItems="flex-start">
        <ListItemIcon className={styles.topItemIcon}>
          <Typography variant="h5" color="primary" sx={{ paddingTop: 0 }} data-value={index + 1}>
            {
              hidePosition ? null :
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
            {
              item.caption?.length > 0
              ? <>
              <Typography variant="body2" color="text.secondary">{item.caption}</Typography>
              </>
              : null
            }
          </>}
        />
        <div className={styles.metricSparklineContainer}>
          <Typography className={styles.hintedMetric} variant="body2" color="text.secondary" noWrap>
            {item.metricFormatted}{ viewMetric === 'totalEnrolled' ? <span className={styles.hintedMetricExtended}>{' '}since {item.metricTimeSpanFormatted}</span> : null}
          </Typography>
          {
            item.sparklineData !== undefined
            ? <>
              <SparkLineChart
                //data={item.sparklineData.data} // all data
                data={arrayLastEntries(item.sparklineData.data, 3 * 10)} // last 10 years
                height={100}
                area
                color={primaryColor}
                curve="linear"
                showHighlight
                showTooltip
                valueFormatter={(value: number | null) => value === null ? `N/A` : `${value} enrolled`}
                xAxis={{
                  scaleType: 'point',
                  //data: item.sparklineData.xAxis, // all data
                  data: arrayLastEntries(item.sparklineData.xAxis, 3 * 10), // last 10 years
                  valueFormatter: (value) => typeof value === 'number' ? formatTermCode(value) : value,
                }}
                yAxis={{
                  // min: undefined,
                  // max: undefined,
                  min: item.sparklineData.yAxis.min,
                  max: item.sparklineData.yAxis.max,
                  // min: item.href.startsWith('/c/') ? item.sparklineData.yAxis.min : undefined,
                  // max: item.href.startsWith('/c/') ? item.sparklineData.yAxis.max : undefined,
                }}
                sx={{
                  maxWidth: '150px',
                  [`& .${areaElementClasses.root}`]: {
                    fill: `url(#sparkline-area-gradient)`,
                  },
                }}
                >
                <AreaGradient id="sparkline-area-gradient" color={primaryColor} />
              </SparkLineChart>
            </>
            : <>
            {/* 📉 */}
            </>
          }
        </div>
      </ListItemButton>
    </Link>
  )
}
