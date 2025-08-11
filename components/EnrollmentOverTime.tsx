import React, { useMemo, useState } from 'react'
import { SparklineData } from "@cougargrades/types";
import Grid from '@mui/material/Grid';
import { BarChart, BarSeries } from "@mui/x-charts/BarChart";
import { formatSeasonCode } from "@/lib/util";
import { season2Color } from "./SeasonalAvailabilityInfo";
import { groupSparklineDataByCalendarYear } from '@/lib/data/seasonableAvailability';
import Tooltip from '@mui/material/Tooltip';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';

import styles from './EnrollmentOverTime.module.scss'


export interface EnrollmentOverTimeInfoProps {
  chartTitle: string;
  enrollmentSparklineData: SparklineData;
}

type YAxisScalingMode = 'consistent' | 'automatic'

export function EnrollmentOverTimeInfo({ chartTitle, enrollmentSparklineData }: EnrollmentOverTimeInfoProps) {
  //const Y_AXIS_ADJUST_THRESHOLD = 0.2 * enrollmentSparklineData.yAxis.max;
  //const Y_AXIS_SAMPLE_MAX_VALUE = useMemo(() => Math.max(...enrollmentSparklineData.data), [enrollmentSparklineData]);
  //const IS_Y_AXIS_ADJUSTED_BY_DEFAULT = Y_AXIS_SAMPLE_MAX_VALUE < Y_AXIS_ADJUST_THRESHOLD
  const groupedEnrollmentSparklineData = useMemo(() => groupSparklineDataByCalendarYear(enrollmentSparklineData), [enrollmentSparklineData]);

  const [yAxisScalingMode, setYAxisScalingMode] = useState<YAxisScalingMode>('consistent')

  return <>
    <Grid container spacing={0}>
      <Grid item xs={12} sm={6}>
        <h5>{chartTitle}</h5>
      </Grid>
      <Grid item xs={12} sm={6}>
        <div className={styles.yAxisScaling}>
          <b className="dense">Y-Axis Scaling:</b>
          <ToggleButtonGroup
            color="info"
            size="small"
            exclusive
            value={yAxisScalingMode}
            onChange={(e) => setYAxisScalingMode((e.target as any).value)}
          >
            <Tooltip arrow title={<span>Y-Axis range is based on <u>data from across the site</u></span>}>
              <ToggleButton value="consistent">
                Consistent
              </ToggleButton>
            </Tooltip>
            <Tooltip arrow title={<span>Y-Axis range is based on <u>only data in the chart below</u></span>}>
              <ToggleButton value="automatic">
                Automatic
              </ToggleButton>
            </Tooltip>
          </ToggleButtonGroup>
        </div>
      </Grid>
    </Grid>
    <BarChart
      series={[
        ...groupedEnrollmentSparklineData.map<BarSeries>(spark => ({
          data: spark.data,
          label: formatSeasonCode(spark.key),
          color: season2Color[spark.key],
          valueFormatter: (value: number | null) => value === null ? `N/A` : `${value} enrolled`
        })),
      ]}
      xAxis={[{
        data: groupedEnrollmentSparklineData[0].xAxis,
        label: 'Calendar Year',
        valueFormatter: (value: number) => value.toString(),
      }]}
      yAxis={[{
        label: 'Enrolled',
        min: enrollmentSparklineData.yAxis.min,
        // Adjust y-axis scaling if it doesn't make sense for a course this niche
        max: (
          yAxisScalingMode === 'automatic'
          ? undefined
          : enrollmentSparklineData.yAxis.max
        ),
      }]}
      height={450}
      grid={{ vertical: false, horizontal: true }}
      margin={{ left: 0 }}
    >
    </BarChart>
  </>;
}
