
import { useQuery } from '@tanstack/react-query'
import { RmpService } from '@cougargrades/services'


/**
 * Search RMP
 * @param query 
 * @returns 
 */
export function useSearchRMP(query: string) {
  return useQuery({
    queryKey: ['rmp', 'search', query],
    queryFn: async () => {
      const svc = new RmpService();
      return await svc.search(query)
    },
  })
}
