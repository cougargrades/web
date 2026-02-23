
import { Temporal } from 'temporal-polyfill'

export function GetTimeRangeFromDurationBeforeNow(relativeDuration: Temporal.Duration): [Temporal.ZonedDateTime, Temporal.ZonedDateTime] {
  return [
    Temporal.Now.zonedDateTimeISO().subtract(relativeDuration),
    Temporal.Now.zonedDateTimeISO()
  ]
}
