
import { queryOptions, useQuery } from '@tanstack/react-query'
import { TopService } from '@cougargrades/services'
import { sortObjectByKeys } from '@cougargrades/utils/object'
import type { TopOptions } from '../../../../../packages/models/src/dto/TopDto';

export function topResultsQueryOptions(options: TopOptions) {
  // Turns `options` into a unique query key that should be the same, regardless of key order
  const queryKey = new URLSearchParams(
    Object.entries(sortObjectByKeys(options))
      .map(([key, value]) => ([key, `${value}` ]))
  ).toString()


  return queryOptions({
    queryKey: ['top', queryKey],
    queryFn: async () => {
      const svc = new TopService();
      return await svc.GetTopResults(options)
    },
  })
}

/**
 * Query around `/api/top`
 * @param limit 
 * @returns 
 */
export function useTopResults(options: TopOptions) {
  const opts = topResultsQueryOptions(options);
  const query = useQuery(opts)
  return query;
}
