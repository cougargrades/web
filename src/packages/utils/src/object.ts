


/**
 * Returns a shallow copy of `input` with its keys sorted
 * @param input 
 * @returns 
 */
export function sortObjectByKeys(input: Record<string, unknown>): Record<string, unknown> {
  return Object
    .entries(input)
    .toSorted((a, b) => a[0].localeCompare(b[0]))
    .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {} as Record<string, unknown>
    );
}
