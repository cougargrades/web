
import { Temporal } from 'temporal-polyfill'

export const UTC_TIMEZONE_ID: Temporal.TimeZoneLike = 'Etc/UTC';

export function GetTimeRangeFromDurationBeforeNow(endTime: Temporal.ZonedDateTime, relativeDuration: Temporal.Duration): [Temporal.ZonedDateTime, Temporal.ZonedDateTime] {
  return [
    endTime.subtract(relativeDuration),
    endTime
  ]
}

export function IsABeforeB(a: Temporal.ZonedDateTime, b: Temporal.ZonedDateTime): boolean {
  return Temporal.ZonedDateTime.compare(a, b) < 0;
}

/**
 * For the current time, get the "date_epoch_seconds" equivalent value
 * @param instant 
 * @returns 
 */
export function GetNowDateEpochSeconds(): Temporal.ZonedDateTime {
  return Temporal.Now.instant().toZonedDateTimeISO(UTC_TIMEZONE_ID).startOfDay();
}

export function ToEpochSeconds(instant: Temporal.Instant | Temporal.ZonedDateTime | Date): number {
  if (instant instanceof Temporal.Instant || instant instanceof Temporal.ZonedDateTime) {
    return Math.trunc(instant.epochMilliseconds / 1000);
  }
  return Math.trunc(instant.valueOf() / 1000);
}

export function EpochSecondsToTemporal(epoch_seconds: number | bigint): Temporal.Instant {
  if (typeof epoch_seconds === 'number') {
    return Temporal.Instant.fromEpochMilliseconds(epoch_seconds * 1000);//.toZonedDateTimeISO(Temporal.Now.timeZoneId())
  }
  else {
    return Temporal.Instant.fromEpochNanoseconds(epoch_seconds * 1000n * 1000000n);//.toZonedDateTimeISO(Temporal.Now.timeZoneId());
  }
}

export function EpochSecondsToDate(epoch_seconds: number): Date {
  return new Date(epoch_seconds * 1000);
}

