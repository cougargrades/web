import z from 'zod'
import { Link } from '@tanstack/react-router'
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
import { arrayLastEntries, formatTermCode } from '@cougargrades/models';
import { TopMetric, type TopOptions, type TopResult, type TopTopic } from '@cougargrades/models/dto';
import { is } from '@cougargrades/utils/zod';


import styles from './TopListItem.module.scss'
//import interactivity from '../../styles/interactivity.module.scss'
import instructorCardStyles from './instructorcard.module.scss'
import { useTopSparkline } from '../lib/services/useTopSparkline';
import { useEffect } from 'react';
import { isNullish } from '@cougargrades/utils/nullish';


interface TopListItemProps {
  data: TopResult;
  index: number;
  options: Pick<TopOptions, 'metric' | 'time' | 'topic'>,
  hidePosition?: boolean;
}

export function AreaGradient({ id, color, opacity }: { id: string, color: string, opacity?: [number, number] }) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={opacity?.[0] ?? 0.3} />
        <stop offset="100%" stopColor={color} stopOpacity={opacity?.[1] ?? 0} />
      </linearGradient>
    </defs>
  );
}

const TopMetric2ValueVerb: Record<TopMetric, string> = {
  'totalEnrolled': `{0} enrolled`,
  'pageView': `{0} views`
}

export function TopListItem({ data: item, index, options, hidePosition }: TopListItemProps) {
  const { metric, time, topic } = options;
  const theme = useTheme();
  // This is used because it looks prettier with the transparency and draws less attention to it
  const dynamicPrimaryColor = theme.palette.mode === 'light' ? theme.palette.primary.light : theme.palette.primary.dark;
  const dynamicWarningColor = theme.palette.mode === 'light' ? theme.palette.warning.light : theme.palette.warning.dark;
  //console.log('item?', item);

  const TopMetric2ChartColor: Record<TopMetric, string> = {
    'totalEnrolled': dynamicPrimaryColor,
    'pageView': dynamicWarningColor,
  }

  const { data: binnedSparklineData, isPending: isPendingSparklineData } = useTopSparkline(item.id, options);

  // useEffect(() => {
  //   console.log('binnedSparklineData?', binnedSparklineData);
  // }, [binnedSparklineData]);

  return (
    <Link to={item.href} className="nostyle">
      <ListItemButton alignItems="flex-start">
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
          slotProps={{
            primary: {
              //component
            },
            secondary: {
              component: 'div'
            }
          }}
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
            {item.metricFormatted}{ metric === 'totalEnrolled' ? <span className={styles.hintedMetricExtended}>{' '}since {item.metricTimeSpanFormatted}</span> : null}
          </Typography>
          {
            isPendingSparklineData
            // Show nothing while loading
            ? null
            : (
              // If special Sparkline Data is available, use this
              !isNullish(binnedSparklineData)
              ? (
                <SparkLineChart
                  //data={item.sparklineData.data} // all data
                  data={binnedSparklineData.data} // last 10 years
                  height={100}
                  area
                  color={dynamicWarningColor}
                  curve="linear"
                  showHighlight
                  showTooltip
                  valueFormatter={(value: number | null) => (
                    isNullish(value)
                    ? `N/A`
                    : (
                      !isNullish(TopMetric2ValueVerb[metric])
                      ? TopMetric2ValueVerb[metric].replaceAll('{0}', `${value}`) 
                      : `${value}`
                    )
                  )}
                  xAxis={{
                    scaleType: 'point',
                    data: binnedSparklineData.xAxis,
                    // No formatter needed, it's preformatted
                    //valueFormatter: (value) => typeof value === 'number' ? formatTermCode(value) : value,
                  }}
                  yAxis={{
                    // min: undefined,
                    // max: undefined,
                    min: binnedSparklineData.yAxis.min,
                    max: (
                      binnedSparklineData.yAxis.max <= 0
                      ? undefined
                      : binnedSparklineData.yAxis.max
                    ),
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
                  <AreaGradient id="sparkline-area-gradient" color={dynamicWarningColor} />
                </SparkLineChart>
              )
              // Otherwise, used baked in Enrollment sparkline
              : (
                item.sparklineData !== undefined
                ? (
                  <>
                  <SparkLineChart
                    //data={item.sparklineData.data} // all data
                    data={arrayLastEntries(item.sparklineData.data, 3 * 10)} // last 10 years
                    height={100}
                    area
                    color={dynamicPrimaryColor}
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
                    <AreaGradient id="sparkline-area-gradient" color={dynamicPrimaryColor} />
                  </SparkLineChart>
                  </>
                )
                : null
              )
            )
          }
        </div>
      </ListItemButton>
    </Link>
  )
}
