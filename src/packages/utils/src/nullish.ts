
export type Nullish = null | undefined | ''

export const isNullish = (x: unknown): x is Nullish => x === '' || x === null || x === undefined;

export const isNullishOrWhitespace = (x: unknown): x is Nullish => x === null || x === undefined || (typeof(x) === 'string' && x.trim().length === 0);

export const nanAsNullable = (x: number) => isNaN(x) ? null : x;
