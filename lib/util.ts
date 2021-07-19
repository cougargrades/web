
export const randRange = (min: number, max: number) => Math.random() * (max - min) + min;

// https://getbootstrap.com/docs/5.0/layout/breakpoints/
export const isMobile = () => typeof window !== 'undefined' ? window && window.document ? window.document.body.clientWidth < 576 : false : false
