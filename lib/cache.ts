import { buildArgs } from './environment';
import { days_to_seconds, hours_to_seconds, minutes_to_seconds } from './to_seconds'

/**
 * Server cache can be busted with a new commit (if the shape of the response changes),
 * but a browser's cache for HTTP responses can't be busted manually.
 */
export const PROD_CACHE_CONTROL =    `public, must-revalidate, max-age=${hours_to_seconds(1)}, s-maxage=${days_to_seconds(1)}, stale-while-revalidate=${days_to_seconds(7)}`;
export const PREVIEW_CACHE_CONTROL = `public, must-revalidate, max-age=${minutes_to_seconds(5)}, s-maxage=${hours_to_seconds(1)}, stale-while-revalidate=${days_to_seconds(3)}`;
export const LIVE_CACHE_CONTROL =    `public, must-revalidate, max-age=${15}, stale-while-revalidate=${minutes_to_seconds(60)}`;
export const OFF_MAINTENANCE_CACHE_CONTROL = `public, must-revalidate, max-age=${0}, stale-while-revalidate=${minutes_to_seconds(5)}`;
export const ON_MAINTENANCE_CACHE_CONTROL = `public, must-revalidate, max-age=${0}, stale-while-revalidate=${minutes_to_seconds(1)}`;

const vercelEnv = buildArgs.vercelEnv
export const CACHE_CONTROL = vercelEnv === 'preview' ? PREVIEW_CACHE_CONTROL : PROD_CACHE_CONTROL;
