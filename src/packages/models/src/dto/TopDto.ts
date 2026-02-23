
import { z } from 'zod'
import { Temporal } from 'temporal-polyfill'

export type TopMetric = z.infer<typeof TopMetric>
export const TopMetric = z.enum(['totalEnrolled', 'pageView'])

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

