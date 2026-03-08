
import { queryOptions, useQuery } from '@tanstack/react-query'
import { TopService } from '@cougargrades/services'
import { sortObjectByKeys } from '@cougargrades/utils/object'
import type { TopOptions } from '../../../../../packages/models/src/dto/TopDto';

export function topTopicSparklineQueryOptions(itemName: string, options: Pick<TopOptions, 'metric' | 'time' | 'topic'>) {
  // Turns `options` into a unique query key that should be the same, regardless of key order
  const queryKey = new URLSearchParams(
    Object.entries(sortObjectByKeys(options))
      .map(([key, value]) => ([key, `${value}` ]))
  ).toString()

  return queryOptions({
    queryKey: ['top', 'sparkline', itemName, queryKey],
    queryFn: async () => {
      const svc = new TopService();
      return await svc.GetTopicSparkline(itemName, options)
    },
  })
}

/**
 * Query around `/api/top/sparkline/{topic}/{itemName}`
 * @param limit 
 * @returns 
 */
export function useTopSparkline(itemName: string, options: Pick<TopOptions, 'metric' | 'time' | 'topic'>) {
  const opts = topTopicSparklineQueryOptions(itemName, options);
  const query = useQuery(opts)
  return query;
}
