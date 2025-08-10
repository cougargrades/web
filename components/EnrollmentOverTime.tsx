import React, { ChangeEvent, useMemo, useState } from 'react'
import { SparklineData } from "@cougargrades/types";
import { useTheme } from "@mui/material/styles";
import { areaElementClasses, LineChart } from "@mui/x-charts/LineChart";
import { BarChart, barElementClasses, BarSeries } from "@mui/x-charts/BarChart";
import { formatSeasonCode, formatTermCode } from "@/lib/util";
import { season2Color } from "./SeasonalAvailabilityInfo";
import { AreaGradient } from '@/components/TopListItem'
import { groupSparklineDataByCalendarYear } from '@/lib/data/seasonableAvailability';

export interface EnrollmentOverTimeInfoProps {
  chartTitle: string;
  enrollmentSparklineData: SparklineData;
}

export function EnrollmentOverTimeInfo({ chartTitle, enrollmentSparklineData }: EnrollmentOverTimeInfoProps) {
  const theme = useTheme();
  const dynamicPrimaryColor = theme.palette.mode === 'light' ? theme.palette.primary.light : theme.palette.primary.dark;
  const staticPrimaryColor = theme.palette.primary.main;

  const IS_Y_AXIS_ADJUSTED = useMemo(() => Math.max(...enrollmentSparklineData.data) < 0.15 * enrollmentSparklineData.yAxis.max, [enrollmentSparklineData]);
  const groupedEnrollmentSparklineData = useMemo(() => groupSparklineDataByCalendarYear(enrollmentSparklineData), [enrollmentSparklineData]);

  const [format, setFormat] = useState<'line' | 'bar' | 'barGrouped'>('line');

  return <>
    <select value={format} onChange={(e: ChangeEvent) => setFormat((e.target as any).value)}>
      <option value="line">[debug] line</option>
      <option value="bar">[debug] bar</option>
      <option value="barGrouped">[debug] barGrouped</option>
    </select>
    <h5>{chartTitle}</h5>
    {/* Grouped semesters */}
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
        // Adjust y-axis scaling it doesn't make sense for a course this niche
        max: (
          IS_Y_AXIS_ADJUSTED
          ? undefined //0.25 * data.enrollmentSparklineData.yAxis.max
          : enrollmentSparklineData.yAxis.max
        ),
      }]}
      height={450}
      grid={{ vertical: false, horizontal: true }}
      sx={{
        display: format === 'barGrouped' ? 'flex': 'none',
        [`& .${barElementClasses.root}`]: {
          //fill: `url(#sparkline-area-gradient)`,
        },
      }}
      margin={{ left: 0 }}
    >
      
    </BarChart>
    {/* Ungrouped semesters */}
    <BarChart
      series={[{
        data: enrollmentSparklineData.data,
        //label: 'Seoul rainfall'
        color: staticPrimaryColor,
        valueFormatter: (value: number | null) => value === null ? `N/A` : `${value} enrolled`
      }]}
      xAxis={[{
        data: enrollmentSparklineData.xAxis,
        label: 'Semester',
        valueFormatter: (value: any) => typeof value === 'number' ? formatTermCode(value) : value,
      }]}
      yAxis={[{
        label: 'Enrolled',
        min: enrollmentSparklineData.yAxis.min,
        // Adjust y-axis scaling it doesn't make sense for a course this niche
        max: (
          IS_Y_AXIS_ADJUSTED
          ? undefined //0.25 * data.enrollmentSparklineData.yAxis.max
          : enrollmentSparklineData.yAxis.max
        ),
      }]}
      height={450}
      grid={{ vertical: false, horizontal: true }}
      sx={{
        display: format === 'bar' ? 'flex': 'none',
        [`& .${barElementClasses.root}`]: {
          //fill: `url(#sparkline-area-gradient)`,
        },
      }}
      margin={{ left: 0 }}
    >
      <AreaGradient id="sparkline-area-gradient" color={staticPrimaryColor} opacity={[0.7, 0]} />
    </BarChart>
    {/* Line chart */}
    <LineChart
      series={[{
        data: enrollmentSparklineData.data,
        curve: 'linear',
        color: staticPrimaryColor,
        area: true,
        valueFormatter: (value: number | null) => value === null ? `N/A` : `${value} enrolled`
      }]}
      xAxis={[{
        data: enrollmentSparklineData.xAxis,
        label: 'Semester',
        scaleType: 'point',
        valueFormatter: (value) => typeof value === 'number' ? formatTermCode(value) : value,
      }]}
      yAxis={[{
        label: 'Enrolled',
        min: enrollmentSparklineData.yAxis.min,
        // Adjust y-axis scaling it doesn't make sense for a course this niche
        max: (
          IS_Y_AXIS_ADJUSTED
          ? undefined //0.25 * enrollmentSparklineData.yAxis.max
          : enrollmentSparklineData.yAxis.max
        ),
        //scaleType: 'sqrt',
        // label: 'Enrolled',
        // labelStyle: {
        //   //transform: 'rotate(45deg)'
        //   fontWeight: '500',
        //   fontSize: '1.0em',
        // },
      }]}
      height={450}
      grid={{ vertical: false, horizontal: true }}
      sx={{
        display: format === 'line' ? 'flex': 'none',
        [`& .${areaElementClasses.root}`]: {
          fill: `url(#sparkline-area-gradient)`,
        },
      }}
      margin={{ left: 0 }}
    >
      <AreaGradient id="sparkline-area-gradient" color={staticPrimaryColor} opacity={[0.7, 0]} />
    </LineChart>
  </>;
}
