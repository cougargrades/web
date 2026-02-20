
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
