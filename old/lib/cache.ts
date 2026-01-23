import { buildArgs } from './environment';
import { days_to_seconds, hours_to_seconds, minutes_to_seconds } from './to_seconds'
import { Temporal } from 'temporal-polyfill'

export const PROD_CACHE_LIFETIME = Temporal.Duration.from({ days: 180 });

/**
 * Server cache can be busted with a new commit (if the shape of the response changes),
 * but a browser's cache for HTTP responses can't be busted manually.
 */
export const PROD_CACHE_CONTROL =    `public, must-revalidate, max-age=${hours_to_seconds(1)}, s-maxage=${PROD_CACHE_LIFETIME.total('seconds')}`;
export const PREVIEW_CACHE_CONTROL = `public, must-revalidate, max-age=${minutes_to_seconds(5)}, s-maxage=${hours_to_seconds(1)}, stale-while-revalidate=${days_to_seconds(3)}`;
export const LIVE_CACHE_CONTROL =    `public, must-revalidate, max-age=${15}, stale-while-revalidate=${minutes_to_seconds(60)}`;
/**
 * Creates a `Cache-Control` header from the provided temporal
 */
export const TEMPORAL_CACHE_CONTROL = (serverDuration: Temporal.Duration, clientDuration?: Temporal.Duration) => {
  const maxAge = clientDuration?.total('seconds') ?? hours_to_seconds(1);
  const sMaxAge = serverDuration.total('seconds');

  return `public, must-revalidate, max-age=${maxAge}, s-maxage=${sMaxAge}`
}
export const OFF_MAINTENANCE_CACHE_CONTROL = `public, must-revalidate, max-age=${0}, stale-while-revalidate=${minutes_to_seconds(5)}`;
export const ON_MAINTENANCE_CACHE_CONTROL = `public, must-revalidate, max-age=${0}, stale-while-revalidate=${minutes_to_seconds(1)}`;
export const LATEST_TERM_CACHE_LIFETIME = Temporal.Duration.from({ days: 1 });
export const TRENDING_CACHE_LIFETIME = Temporal.Duration.from({ days: 1 });
export const TOP_RECENT_CACHE_LIFETIME = Temporal.Duration.from({ days: 7 });

const vercelEnv = buildArgs.vercelEnv
export const CACHE_CONTROL = vercelEnv === 'preview' ? PREVIEW_CACHE_CONTROL : PROD_CACHE_CONTROL;
