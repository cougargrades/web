import useSWR from 'swr/immutable'
import { Observable, ObservableStatus } from './Observable'
import { useRosetta } from '../i18n'
import { getYear, seasonCode } from '../util'
import type { LatestTermResult } from '../../pages/api/latest_term'

export type LatestTermResultExtra = LatestTermResult & {
  latestTermFormatted: string | null;
}

/**
 * React hook for accessing the course data client-side
 * @param courseName 
 * @returns 
 */
export function useLatestTerm(): Observable<LatestTermResultExtra> {
  const stone = useRosetta()
  const { data, error, isLoading } = useSWR<LatestTermResult>(`/api/latest_term`)
  const status: ObservableStatus = error ? 'error' : (isLoading || !data) ? 'loading' : 'success';

  try {
    return {
      data: {
        latestTerm: data?.latestTerm ?? null,
        latestTermFormatted: typeof data?.latestTerm === 'number' ? `${stone.t(`season.${seasonCode(data.latestTerm)}`)} ${getYear(data.latestTerm)}` : null,
      },
      error,
      status,
    }
  }
  catch(error) {
    console.error(`[useLatestTerm] Error:`, error)
    return {
      data: undefined,
      error: error as any,
      status: 'error',
    }
  }
}

