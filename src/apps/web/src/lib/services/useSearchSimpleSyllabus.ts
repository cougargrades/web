
import { useQuery } from '@tanstack/react-query'
import { SimpleSyllabusService } from '@cougargrades/services'

/**
 * Search the simple syllabus
 * @param query 
 * @returns 
 */
export function useSearchSimpleSyllabus(query: string) {
  return useQuery({
    queryKey: ['simplesyllabus', 'search', query],
    queryFn: async () => {
      const svc = new SimpleSyllabusService();
      return await svc.search(query)
    },
  })
}
