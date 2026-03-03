
import { z } from 'zod'
import { CourseInstructorResult } from './CourseInstructorResult'
import { SparklineData } from '../SparklineData'
import { CoursePlusMetrics, InstructorPlusMetrics } from './Plus'
import { course2Result } from './CourseResult'
import { instructor2Result } from './InstructorResult'
import { TopMetric, TopOptions } from './TopDto'
import { formatTermCode } from '../TermCode'

export type TopResult = z.infer<typeof TopResult>
export const TopResult = CourseInstructorResult.extend({
  metricValue: z.number(),
  metricFormatted: z.string(),
  metricTimeSpanFormatted: z.string(),
  sparklineData: SparklineData.optional(),
})

/**
 * This has nothing to do with the "metric" numbering system
 * https://en.wikipedia.org/wiki/Metric_system
 */
export function formatMetric(value: number, metric: TopMetric): string {
  const phrase = metric === 'totalEnrolled' ? 'enrolled' : 'views'
  const fmt = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumSignificantDigits: 3,
  })
  return `${fmt.format(value)} ${phrase}`;
}

export function GetTopMetricValue(model: CoursePlusMetrics | InstructorPlusMetrics, metric: TopMetric): number {
  if (metric === 'totalEnrolled') return model.enrollment.totalEnrolled;
  if (metric === 'pageView') return model.screenPageViews ?? 0;
  return 0;
}

export function ToTopResult(data: CoursePlusMetrics | InstructorPlusMetrics, options: Pick<TopOptions, 'metric'>): TopResult {
  const metricValue = GetTopMetricValue(data, options.metric);
  return {
    // set the "caption" to an empty string
    ...('catalogNumber' in data ? ({...course2Result(data), caption: ''}) : ({...instructor2Result(data), caption: ''})),
    metricValue: metricValue,
    metricFormatted: formatMetric(metricValue, options.metric),
    //metricTimeSpanFormatted: `${getYear(e.firstTaught)}`,
    metricTimeSpanFormatted: formatTermCode(data.firstTaught),
    sparklineData: data.enrollmentSparklineData ?? undefined,
  }
}
