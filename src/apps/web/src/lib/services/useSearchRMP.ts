
import { useQuery } from '@tanstack/react-query'
import { RmpService } from '@cougargrades/services'
import { isNullishOrWhitespace } from '@cougargrades/utils/nullish';


/**
 * Search RMP
 * @param query 
 * @returns 
 */
export function useSearchRMP(query: string) {
  return useQuery({
    queryKey: ['rmp', 'search', query],
    // Only perform the query when enough information is provided
    enabled: !isNullishOrWhitespace(query),
    queryFn: async () => {
      const svc = new RmpService();
      return await svc.search(query)
    },
  })
}
