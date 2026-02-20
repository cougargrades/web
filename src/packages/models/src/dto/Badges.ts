import { z } from 'zod'
import { Enrollment } from '../Enrollment'
import { GPA } from '../GPA'
import type { Property } from 'csstype'


export const notNullishOrZero = (x: number | undefined | null): x is number => !(x === null || x === undefined || x === 0.0)
export const formatGPAValue = (x: number | undefined) => `${notNullishOrZero(x) ? x.toFixed(2) : '???'} GPA`
export const formatSDValue = (x: number | undefined) => `${notNullishOrZero(x) ? x.toFixed(3) : '???'} SD`
export const formatDropRateValue = (x: number) => `${x.toFixed(2)}% W`

export type Grade = z.infer<typeof Grade>
export const Grade = z.enum(['A', 'B', 'C', 'D', 'F', 'I', 'W', 'S', 'U', 'NCR'])

// Based on https://github.com/cougargrades/web/blob/3d511fc56b0a90f2038883a71852245b726af7e3/src/components/instructors/GPABadge.js
export function getGradeForGPA(n: number | undefined): Grade {
  // 4.0 is rarely scored in practice
  if (n === undefined) return 'I'
  if (n === 0.0) return 'I'
  if (n > 3.5) return 'A'
  if (n > 2.5) return 'B'
  if (n > 1.5) return 'C'
  // 1.0 is rarely scored in practice
  if (n < 1.5) return 'D'
  if (n < 0.5) return 'F'
  return 'I'
}

export function getGradeForStdDev(sd: number | undefined): Grade {
  /**
   * For the standardDeviation values of all instructors (latest data: Summer 2019)
   * ===================================================
   * min: 0.0007071067811864697
   * mean: 0.28632900784232573
   * median: 0.24911322128640845
   * max: 1.6836212460051696
   * 
   * Interpretations:
   * ===============
   * - 25% likely to have stddev under 0.149
   * - 50% likely to have stddev under 0.286
   * - 75% likely to have stddev under 0.425
   * 
   * Color ranges:
   * ============
   * sigma < 0.149 
   */
  if (sd === undefined) return 'I'
  if (sd === 0.0) return 'I'
  if (sd < 0.149) return 'A'
  if (sd < 0.286) return 'B'
  if (sd < 0.425) return 'C'
  if (sd > 0.425) return 'D'
  return 'I'
}

export const grade2Color: Record<Grade, Property.Color> = {
  'A': '#87cefa',
  'B': '#90ee90',
  'C': '#ffff00',
  'D': '#ffa07a',
  'F': '#cd5c5c',
  'I': '#d3d3d3',
  'W': '#9370D8',
  'S': '#8fbc8f',
  'U': '#d87093',
  'NCR': '#d87093'
}

export function getBadges(gpa: GPA, enrollment?: Enrollment): SearchResultBadge[] {
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

export type SearchResultBadge = z.infer<typeof SearchResultBadge>
export const SearchResultBadge = z.object({
  key: z.string(),
  text: z.string(),
  color: z.string(),
  opacity: z.string().optional(),
  caption: z.string().optional(),
  title: z.string().optional(),
  suffix: z.string().optional(),
  fontSize: z.string().optional(),
})
