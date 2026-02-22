
import { z } from 'zod'
import { Temporal } from 'temporal-polyfill'
import { Course, CourseThin } from '../Course'
import { Instructor, InstructorThin } from '../Instructor'
import { PopConMetric } from '../PopCon'

export type TopMetric = z.infer<typeof TopMetric>
export const TopMetric = z.enum(['totalEnrolled', 'pageView'])

export const TopMetric2PopConMetric = new Map<TopMetric, PopConMetric>([
  ['pageView', PopConMetric.PageView]
]);

export type TopTopic = z.infer<typeof TopTopic>
export const TopTopic = z.enum(['course', 'instructor'])

export type TopTime = z.infer<typeof TopTime>
export const TopTime = z.enum(['all', 'lastMonth', 'lastYear'])

export const TopTime2Duration = new Map<TopTime, Temporal.Duration>([
  ['all', Temporal.Duration.from({ years: 999 })], // RangeError: Cannot use large units
  ['lastMonth', Temporal.Duration.from({ days: 31 })],
  ['lastYear', Temporal.Duration.from({ days: 365 })]
])

export type TopOptions = z.infer<typeof TopOptions>
export const TopOptions = z.object({
  metric: TopMetric,
  topic: TopTopic,
  limit: z.coerce.number().int().min(1).max(250),
  time: TopTime,
  hideCore: z.coerce.boolean().default(false),
})

export type PlusMetrics = z.infer<typeof PlusMetrics>
export const PlusMetrics = z.object({
  activeUsers: z.number().optional(),
  screenPageViews: z.number().optional(),
})

export type CoursePlusMetrics = z.infer<typeof CoursePlusMetrics>
export const CoursePlusMetrics = z.intersection(CourseThin, PlusMetrics)
//export const CoursePlusMetrics = z.intersection(Course, PlusMetrics)

export type InstructorPlusMetrics = z.infer<typeof InstructorPlusMetrics>
export const InstructorPlusMetrics = z.intersection(InstructorThin, PlusMetrics)
//export const InstructorPlusMetrics = z.intersection(Instructor, PlusMetrics)
