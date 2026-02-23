
import { z } from 'zod'
import { CourseInstructorResult } from './CourseInstructorResult'
import { SparklineData } from '../SparklineData'

export type TopResult = z.infer<typeof TopResult>
export const TopResult = CourseInstructorResult.extend({
  metricValue: z.number(),
  metricFormatted: z.number(),
  metricTimeSpanFormatted: z.string(),
  sparklineData: SparklineData.optional(),
})
