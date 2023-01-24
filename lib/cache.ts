import { buildArgs } from './environment';
import { days_to_seconds, hours_to_seconds, minutes_to_seconds } from './to_seconds'

export const PROD_CACHE_CONTROL = `public, must-revalidate, max-age=${days_to_seconds(1)}, s-maxage=${days_to_seconds(7)}, stale-while-revalidate=${days_to_seconds(14)}`;
export const PREVIEW_CACHE_CONTROL = `public, must-revalidate, max-age=${days_to_seconds(1)}, s-maxage=${days_to_seconds(3)}, stale-while-revalidate=${days_to_seconds(7)}`;
export const DEV_CACHE_CONTROL = `public, must-revalidate, max-age=${minutes_to_seconds(15)}, stale-while-revalidate=${hours_to_seconds(1)}`;

const vercelEnv = buildArgs.vercelEnv
export const CACHE_CONTROL = vercelEnv === 'development' ? DEV_CACHE_CONTROL : vercelEnv === 'preview' ? PREVIEW_CACHE_CONTROL : PROD_CACHE_CONTROL;