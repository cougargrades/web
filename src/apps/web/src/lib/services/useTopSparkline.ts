
import { queryOptions, useQuery } from '@tanstack/react-query'
import { TopService } from '@cougargrades/services'
import { sortObjectByKeys } from '@cougargrades/utils/object'
import type { TopOptions } from '../../../../../packages/models/src/dto/TopDto';


/**
 * Query around `/api/top/sparkline/{topic}/{itemName}`
 * @param limit 
 * @returns 
 */
export function useTopSparkline(itemName: string, options: Pick<TopOptions, 'metric' | 'time' | 'topic'> & { enabled?: boolean }) {
  // Turns `options` into a unique query key that should be the same, regardless of key order
  const queryKey = new URLSearchParams(
    Object.entries(sortObjectByKeys(options))
      .map(([key, value]) => ([key, `${value}` ]))
  ).toString()

  const query = useQuery({
    queryKey: ['top', 'sparkline', itemName, queryKey],
    enabled: options.enabled,
    queryFn: async () => {
      const svc = new TopService();
      return await svc.GetTopicSparkline(itemName, options)
    },
  })
  return query;
}
