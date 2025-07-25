
export const ms_to_seconds = (milliseconds: number) => milliseconds / 1000;
export const seconds_to_ms = (seconds: number) => seconds * 1000;
export const ms_to_minutes = (milliseconds: number) => ms_to_seconds(milliseconds) / 60;
export const minutes_to_ms = (minutes: number) => seconds_to_ms(minutes * 60);
export const ms_to_hours = (milliseconds: number) => ms_to_minutes(milliseconds) / 60;
export const hours_to_ms = (hours: number) => minutes_to_ms(hours * 60);
export const ms_to_days = (milliseconds: number) => ms_to_hours(milliseconds) / 24;
export const days_to_ms = (days: number) => hours_to_ms(days * 24);

export function formatDuration(milliseconds: number): string {
  //console.log('milliseconds', milliseconds)
  const fmat = (value: number, suffix: string) => value >= 1 ? `${value}${suffix} ` : ''

  let days = 0
  let hours = 0
  let minutes = 0
  let seconds = 0

  let remaining = milliseconds
  //console.log(ms_to_seconds(remaining) >= 1)
  while(ms_to_seconds(remaining) >= 1) {
    //console.log(remaining,' ms remaining')
    if (ms_to_days(remaining) >= 1) {
      days += Math.floor(ms_to_days(remaining))
      //console.log('days is ',days)
      remaining -= days_to_ms(Math.floor(ms_to_days(remaining)))
    }
    else if (ms_to_hours(remaining) >= 1) {
      hours += Math.floor(ms_to_hours(remaining))
      //console.log('hours is ',hours)
      remaining -= hours_to_ms(Math.floor(ms_to_hours(remaining)))
    }
    else if (ms_to_minutes(remaining) >= 1) {
      minutes += Math.floor(ms_to_minutes(remaining))
      //console.log('minutes is ',minutes)
      remaining -= minutes_to_ms(Math.floor(ms_to_minutes(remaining)))
    }
    else if (ms_to_seconds(remaining) >= 1) {
      seconds += Math.floor(ms_to_seconds(remaining))
      //console.log('seconds is ',seconds)
      remaining -= seconds_to_ms(Math.floor(ms_to_seconds(remaining)))
    }
  }

  const daysFormatted = fmat(days, 'd')
  const hoursFormatted = fmat(hours, 'h')
  const minutesFormatted = fmat(minutes, 'm')
  const secondsFormatted = fmat(seconds, 's')

  return `${daysFormatted}${hoursFormatted}${minutesFormatted}${secondsFormatted}`.trim()
}
