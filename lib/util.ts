
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
