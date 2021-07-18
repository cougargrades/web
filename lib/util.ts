
export const randRange = (min: number, max: number) => Math.random() * (max - min) + min;

// https://getbootstrap.com/docs/5.0/layout/breakpoints/
export const isMobile = document.body.clientWidth < 576;
