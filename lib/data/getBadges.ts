import { Enrollment, GPA } from '@cougargrades/types'
import { getGradeForGPA, getGradeForStdDev, grade2Color } from '../../components/badge'
import { SearchResultBadge } from './useSearchResults'

export function getBadges(gpa: GPA.GPA, enrollment?: Enrollment): SearchResultBadge[] {
  try {
    return [
      ...(gpa.average !== 0 ? [
        {
          key: 'gpa',
          text: `${gpa.average.toFixed(2)} GPA`,
          color: grade2Color.get(getGradeForGPA(gpa.average)),
          caption: 'Grade Point Average',
        }
      ] : []),
      ...(gpa.standardDeviation !== 0 ? [
        {
          key: 'sd',
          text: `${gpa.standardDeviation.toFixed(3)} SD`,
          color: grade2Color.get(getGradeForStdDev(gpa.standardDeviation)),
          caption: 'Standard Deviation',
        }
      ] : []),
      ...(enrollment !== undefined && enrollment.totalEnrolled !== 0 ? [
        {
          key: 'droprate',
          text: `${(enrollment.totalW/enrollment.totalEnrolled*100).toFixed(2)}% W`,
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