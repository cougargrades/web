import { z } from 'zod'
//import { v4 as uuidv4 } from 'uuid'
import { Temporal } from 'temporal-polyfill';
import { TopTopic } from './dto/TopDto';

// export type PopConMetric = z.infer<typeof PopConMetric>
// export const PopConMetric = z.enum(['page_view'])

// export type PopConMetricID = z.infer<typeof PopConMetric>
// export const PopConMetricID = z.enum([1])

export enum PopConMetric {
  PageView = 1,
  // TODO: Others?
}

export type PopCon = z.infer<typeof PopCon>
export const PopCon = z.object({
  /**
   * The ID of the object
   */
  id: z.number().int(),
  /**
   * The location on the site being tracked
   * Ex: `/c/CHEM%202323`
   */
  pathname: z.string(),
  /**
   * When the measurement was taken, as a timestamp, in the integer number seconds since the Unix epoch in the UTC timezone.
   */
  //timestamp: z.coerce.date(),
  timestamp_epoch_seconds: z.number().int(),
  /**
   * What metric was being measured
   */
  type: z.number(),
})

export type PopConOptions = z.infer<typeof PopConOptions>
export const PopConOptions = z.object({
  metric: z.enum(PopConMetric),
  limit: z.coerce.number().int(),
  offset: z.coerce.number().int().default(0),
  /**
   * [0] = Lower Bound (After)
   * [1] = Upper Bound (Before)
   */
  timeRange: z.tuple([z.instanceof(Temporal.ZonedDateTime), z.instanceof(Temporal.ZonedDateTime)]).optional(),
  topic: TopTopic,
})

export function EpochSecondsToTemporal(epoch_seconds: number | bigint): Temporal.ZonedDateTime {
  if (typeof epoch_seconds === 'number') {
    return Temporal.Instant.fromEpochMilliseconds(epoch_seconds * 1000).toZonedDateTimeISO(Temporal.Now.timeZoneId())
  }
  else {
    return Temporal.Instant.fromEpochNanoseconds(epoch_seconds * 1000n * 1000000n).toZonedDateTimeISO(Temporal.Now.timeZoneId());
  }
}

export function ToEpochSeconds(instant: Temporal.Instant | Temporal.ZonedDateTime | Date): number {
  if (instant instanceof Temporal.Instant || instant instanceof Temporal.ZonedDateTime) {
    return instant.epochMilliseconds / 1000
  }
  return instant.valueOf() / 1000;
}

// export function createPopCon(options: Pick<PopCon, 'pathname' | 'type'>): PopCon {
//   return {
//     ...options,
//     _id: uuidv4(),
//     timestamp: new Date(),
//   }
// }

