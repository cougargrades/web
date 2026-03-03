
import { Temporal } from 'temporal-polyfill'

export const TEMPORAL_CACHE_CONTROL = (serverDuration: Temporal.Duration, clientDuration?: Temporal.Duration) => {
  const maxAge = clientDuration?.total('seconds') ?? 0;
  const sMaxAge = serverDuration.total('seconds');

  return `public, must-revalidate, max-age=${maxAge}, s-maxage=${sMaxAge}`
}
