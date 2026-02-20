
export function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  return b[orderBy] < a[orderBy] ? -1 : b[orderBy] > a[orderBy] ? 1 : 0;
}
