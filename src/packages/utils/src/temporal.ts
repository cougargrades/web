
import { Temporal } from 'temporal-polyfill'

export const UTC_TIMEZONE_ID: Temporal.TimeZoneLike = 'Etc/UTC';

export function GetTimeRangeFromDurationBeforeNow(endTime: Temporal.ZonedDateTime, relativeDuration: Temporal.Duration): [Temporal.ZonedDateTime, Temporal.ZonedDateTime] {
  return [
    endTime.subtract(relativeDuration),
    endTime
  ]
}
