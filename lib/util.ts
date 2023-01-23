
export const randRange = (min: number, max: number) => Math.random() * (max - min) + min;

// https://getbootstrap.com/docs/5.0/layout/breakpoints/
export const isMobile = () => typeof window !== 'undefined' ? window && window.document ? window.document.body.clientWidth < 576 : false : false

export const seasonCode = (termCode: number): string => {
  const second = termCode % 10
  termCode = Math.floor(termCode / 10)
  const first = termCode % 10
  return `${first}${second}`
}

export const getYear = (termCode: number) => Math.floor(termCode / 100)

export const sum = (x: number[]) => x.reduce((a, b) => a + b, 0)

export function isOverNDaysOld(d: Date, n: number): boolean {
  let n_days_ago = new Date()
  n_days_ago.setDate(n_days_ago.getDate() - n);

  return d.valueOf() < n_days_ago.valueOf();
}

export const extract = (x: string | string[]): string => Array.isArray(x) ? x[0] : x;
