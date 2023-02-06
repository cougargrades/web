import { getRosetta } from './i18n';

export const randRange = (min: number, max: number) => Math.random() * (max - min) + min;

// https://getbootstrap.com/docs/5.0/layout/breakpoints/
export const isMobile = () => typeof window !== 'undefined' ? window && window.document ? window.document.body.clientWidth < 576 : false : false

export const seasonCode = (termCode: number): string => {
  const second = termCode % 10
  termCode = Math.floor(termCode / 10)
  const first = termCode % 10
  return `${first}${second}`
}

export function formatTermCode(termCode: number): string {
  const stone = getRosetta()
  return `${stone.t(`season.${seasonCode(termCode)}`)} ${getYear(termCode)}`
}

export const getYear = (termCode: number) => Math.floor(termCode / 100)

export const sum = (x: number[]) => x.reduce((a, b) => a + b, 0)

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
