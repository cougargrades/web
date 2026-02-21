
export function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  return b[orderBy] < a[orderBy] ? -1 : b[orderBy] > a[orderBy] ? 1 : 0;
}

export const defaultComparator = (a: string | number, b: string | number) => b < a ? -1 : b > a ? 1 : 0;
