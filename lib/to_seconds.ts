
const SECONDS_PER_MINUTE = 60
const MINUTES_PER_HOUR = 60
const HOURS_PER_DAY = 24
const DAYS_PER_WEEK = 7


export const minutes_to_seconds = (minutes: number) => minutes * SECONDS_PER_MINUTE;
export const hours_to_seconds = (hours: number) => hours * MINUTES_PER_HOUR * SECONDS_PER_MINUTE;
export const days_to_seconds = (days: number) => days * HOURS_PER_DAY * MINUTES_PER_HOUR * SECONDS_PER_MINUTE;
export const weeks_to_seconds = (weeks: number) => weeks * DAYS_PER_WEEK * HOURS_PER_DAY * MINUTES_PER_HOUR * SECONDS_PER_MINUTE;
