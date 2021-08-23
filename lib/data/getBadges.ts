import { Enrollment, GPA } from '@cougargrades/types'
import { getGradeForGPA, getGradeForStdDev, grade2Color } from '../../components/badge'
import { SearchResultBadge } from './useSearchResults'

export const formatGPAValue = (x: number) => `${x.toFixed(2)} GPA`
export const formatSDValue = (x: number) => `${x.toFixed(3)} SD`
export const formatDropRateValue = (x: number) => `${x.toFixed(2)}% W`

export function getBadges(gpa: GPA.GPA, enrollment?: Enrollment): SearchResultBadge[] {
  try {
    return [
      ...(gpa.average !== 0 ? [
        {
          key: 'gpa',
          text: formatGPAValue(gpa.average),
          color: grade2Color.get(getGradeForGPA(gpa.average)),
          caption: 'Grade Point Average',
        }
      ] : []),
      ...(gpa.standardDeviation !== 0 ? [
        {
          key: 'sd',
          text: formatSDValue(gpa.standardDeviation),
          color: grade2Color.get(getGradeForStdDev(gpa.standardDeviation)),
          caption: 'Standard Deviation',
        }
      ] : []),
      ...(enrollment !== undefined && enrollment.totalEnrolled !== 0 ? [
        {
          key: 'droprate',
          text: formatDropRateValue(enrollment.totalW/enrollment.totalEnrolled*100),
          color: grade2Color.get('W'),
          caption: 'Drop Rate',
        }
      ] : []),
    ]
  }
  catch(err) {
    return []
  }
}