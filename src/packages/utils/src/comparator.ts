
export function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  return b[orderBy] < a[orderBy] ? -1 : b[orderBy] > a[orderBy] ? 1 : 0;
}

/**
 * Descending order
 * @param a 
 * @param b 
 * @returns 
 */
export const defaultComparator = (a: string | number, b: string | number) => b < a ? -1 : b > a ? 1 : 0;

/**
 * It should return a number where:
 * - A negative value indicates that a should come before b.
 * - A positive value indicates that a should come after b.
 * - Zero or NaN indicates that a and b are considered equal.
 */
export type Comparator<T> = (a: T, b: T) => number;
