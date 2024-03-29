import { Enrollment, GPA } from '@cougargrades/types'
import { getGradeForGPA, getGradeForStdDev, grade2Color } from '../../components/badge'
import { SearchResultBadge } from './useSearchResults'

export const notNullishOrZero = (x: number | undefined | null): x is number => !(x === null || x === undefined || x === 0.0)
export const formatGPAValue = (x: number | undefined) => `${notNullishOrZero(x) ? x.toFixed(2) : '???'} GPA`
export const formatSDValue = (x: number | undefined) => `${notNullishOrZero(x) ? x.toFixed(3) : '???'} SD`
export const formatDropRateValue = (x: number) => `${x.toFixed(2)}% W`

export function getBadges(gpa: GPA.GPA, enrollment?: Enrollment): SearchResultBadge[] {
  try {
    return [
      {
        key: 'gpa',
        text: formatGPAValue(gpa.average),
        color: grade2Color[getGradeForGPA(gpa.average)],
        caption: 'Grade Point Average',
      },
      {
        key: 'sd',
        text: formatSDValue(gpa.standardDeviation),
        color: grade2Color[getGradeForStdDev(gpa.standardDeviation)],
        caption: 'Standard Deviation',
      },
      ...(enrollment !== undefined && enrollment.totalEnrolled !== 0 ? [
        {
          key: 'droprate',
          text: formatDropRateValue(enrollment.totalW/enrollment.totalEnrolled*100),
          color: grade2Color['W'],
          caption: 'Drop Rate',
        }
      ] : []),
    ]
  }
  catch(err) {
    return []
  }
}