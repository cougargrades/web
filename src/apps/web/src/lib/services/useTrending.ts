
import { useQuery } from '@tanstack/react-query'
import { TrendingService } from '@cougargrades/services'


/**
 * Query around `/api/trending`
 * @param limit 
 * @returns 
 */
export function useTrending(limit: number = 5) {
  const query = useQuery({
    queryKey: ['trending'],
    queryFn: async () => {
      const svc = new TrendingService();
      return await svc.GetTrending(limit);
    },
  })
  return query;
}
