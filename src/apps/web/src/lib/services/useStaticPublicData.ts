
import { useQuery } from '@tanstack/react-query'

export function useAbbreviationMap() {
  return useQuery({
    queryKey: ['@cougargrades/publicdata/bundle/edu.uh.publications.subjects/subjects.json'],
    queryFn: async () => {
      return (await import('@cougargrades/publicdata/bundle/edu.uh.publications.subjects/subjects.json')).default
    }
  })
}

export function useCourseIndex() {
  return useQuery({
    queryKey: ['@cougargrades/publicdata/bundle/io.cougargrades.searchable/courses.json'],
    queryFn: async () => {
      return (await import('@cougargrades/publicdata/bundle/io.cougargrades.searchable/courses.json')).data
    }
  })
}
