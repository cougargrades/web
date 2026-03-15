
import { z } from 'zod'


export type SeasonCode = z.infer<typeof SeasonCode>;
export const SeasonCode = z.enum(['01', '02', '03']);

export const FormattedSeasonCode: Record<SeasonCode, string> = {
  '01': 'Spring',
  '02': 'Summer',
  '03': 'Fall'
}

export function seasonCode(termCode: number): SeasonCode {
  const second = termCode % 10
  termCode = Math.floor(termCode / 10)
  const first = termCode % 10
  return `${first}${second}` as SeasonCode
}

export const getYear = (termCode: number) => Math.floor(termCode / 100);

export function formatSeasonCode(seasonCode: SeasonCode) {
  return FormattedSeasonCode[seasonCode];
}

export function formatTermCode(termCode: number) {
  const season = seasonCode(termCode);
  const year = getYear(termCode);

  return `${FormattedSeasonCode[season]} ${year}`
}

export function parseTermStringAsTermCode(termString: string): number {
  const [seasonStr, yearStr] = termString.split(' ')
  const seasonStr2SeasonCode = new Map<string, SeasonCode>(
    Object.entries(FormattedSeasonCode).map<[string, SeasonCode]>(([code, str]) => ([str.toLowerCase().trim(), code as SeasonCode]))
  )
  return parseInt(`${yearStr}${seasonStr2SeasonCode.get(seasonStr.toLowerCase().trim())}`)
  //return parseInt(`${termString.split(' ')[1]}${seasonCodes.get(termString.split(' ')[0])}`);
}

export const END_OF_SEASON_DATES: Record<SeasonCode, `${number}-${number}`> = {
  '01': '05-12', // Deadline for faculty to post Spring grade data (May 12)
  '02': '08-19', // Deadline for faculty to post Summer grade data (August 19)
  '03': '12-16', // Deadline for faculty to post Fall grade data (December 16)
}

export function getCurrentSeason(date = new Date()): SeasonCode {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const monthDay = `${month}-${day}`;

  // Return the first season whose end date is >= today
  for (const [code, endDate] of Object.entries(END_OF_SEASON_DATES)) {
    if (monthDay <= endDate) return code as SeasonCode;
  }

  // We're past all end dates (after Dec 16) — wrap around to Spring of next year
  return '01';
}
