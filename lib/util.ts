import type { Enrollment, Section } from '@cougargrades/types'
import { getRosetta } from './i18n'

export const randRange = (min: number, max: number) => Math.random() * (max - min) + min;

// https://getbootstrap.com/docs/5.0/layout/breakpoints/
export const isMobile = () => typeof window !== 'undefined' ? window && window.document ? window.document.body.clientWidth < 576 : false : false

export type SeasonCode = '01' | '02' | '03';

export const seasonCode = (termCode: number): SeasonCode => {
  const second = termCode % 10
  termCode = Math.floor(termCode / 10)
  const first = termCode % 10
  return `${first}${second}` as SeasonCode
}

export function formatTermCode(termCode: number): string {
  const stone = getRosetta()
  return `${stone.t(`season.${seasonCode(termCode)}`)} ${getYear(termCode)}`
}

export function formatSeasonCode(seasonCode: SeasonCode): string {
  const stone = getRosetta()
  return stone.t(`season.${seasonCode}`);
}

export const getYear = (termCode: number) => Math.floor(termCode / 100)

export const sum = (x: number[]) => x.reduce((a, b) => a + b, 0)

export const average = (x: number[]) => sum(x) / x.length

/**
 * Normalizes one element of a list
 * @param x 
 * @param of 
 * @returns 
 */
export const normalizeOne = (x: number, of: number[]) => (
  // prevent division by zero
  Math.min(...of) === Math.max(...of)
  ? 1 / of.length
  : ((x - Math.min(...of)) / (Math.max(...of) - Math.min(...of)))
)

export const scaleToRange = (x: number, [min, max]: [number, number]) => x * (max - min) + min

/**
 * When provided a list of weights (`of`) and an individual weight (`x`), computes the percentage of weight that `x` occupies
 * @param x 
 * @param of 
 * @returns 
 */
export const shareOf = (x: number, of: number[]) => x / sum(of) * 100

export function isOverNDaysOld(d: Date, n: number): boolean {
  let n_days_ago = new Date()
  n_days_ago.setDate(n_days_ago.getDate() - n);

  return d.valueOf() < n_days_ago.valueOf();
}

export const extract = (x: string | string[] | undefined): string => x === undefined ? '' : Array.isArray(x) ? x[0] : x;

export const truncateWithEllipsis = (x: string, maxLength: number): string => x.length <= maxLength ? x : `${x.slice(0,maxLength-1)}\u2026`

export function notNullish<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined
}

export const parseIntOrUndefined = (x: string | undefined): number | undefined => x === undefined ? undefined : isNaN(parseInt(x)) ? undefined : parseInt(x)

export function getRandomIndexes(length: number, count: number = 5): number[] {
  const result: number[] = []
  // loop `count` times
  for(let i = 0; i < count; i++) {
    let attempt = -1
    // loop until attempt hasn't been done before
    do {
      attempt = Math.floor(Math.random() * length)
    }
    while(result.includes(attempt));
    // add to results
    result.push(attempt);
  }

  return result
}

export const getTotalEnrolled = (sec: Section) => sec.A + sec.B + sec.C + sec.D + sec.F + sec.NCR + sec.S + sec.W;

/**
 * May return `-1` if there were zero "occupied" sections
 * @param enrollment 
 * @param allSections 
 * @returns 
 */
export const estimateClassSize = (enrollment: Enrollment, allSections: Section[]) => {
  const numOccupiedSections = allSections.filter(sec => getTotalEnrolled(sec) > 0).length;
  const classSize = numOccupiedSections === 0 ? -1 : enrollment.totalEnrolled / numOccupiedSections
  return classSize
}

/**
 * See: https://www.bauer.uh.edu/UHGPACalculator/
 * See: https://publications.uh.edu/content.php?catoid=34&navoid=12493
 */
const GPA_WEIGHTS = {
  'A': 4.0,
  'A-': 3.67,
  'B+': 3.33,
  'B': 3.00,
  'B-': 2.67,
  'C+': 2.33,
  'C': 2.00,
  'C-': 1.67,
  'D+': 1.33,
  'D': 1.00,
  'D-': 0.67,
  'F': 0.00,
} as const;

/**
 * Estimates GPA based on the formula that UH has defined.
 * Used for comparing against the values that UH provides.
 */
export function estimateGPA(section: Section): number {
  const { A, B, C, D, F, W, S, NCR } = section;
  const totalEnrolled = getTotalEnrolled(section);

  let points = 0.0;
  points += GPA_WEIGHTS['A'] * A;
  points += GPA_WEIGHTS['B'] * B;
  points += GPA_WEIGHTS['C'] * C;
  points += GPA_WEIGHTS['D'] * D;
  points += GPA_WEIGHTS['F'] * F;
  return points / (totalEnrolled - (W + S + NCR));
}

export function stringContainsOneOf(value: string, ...candidates: string[]): boolean {
  return candidates.some(c => value.toLowerCase().includes(c.toLowerCase()))
}

export function arrayLastEntries<T>(array: T[], numberOfEntries: number): T[] {
  //arr.slice(Math.max(arr.length - 5, 0))
  return array.slice(Math.max(array.length - numberOfEntries, 0));
}
