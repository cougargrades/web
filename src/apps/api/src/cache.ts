
import { env } from 'cloudflare:workers'
import { z } from 'zod'
import { Temporal } from 'temporal-polyfill'

export const NO_CACHE = z.stringbool().optional().default(false).parse(env.NO_CACHE);
export const NO_RATELIMIT = z.stringbool().optional().default(false).parse(env.NO_RATELIMIT);

export const DURATION_ZERO = Temporal.Duration.from({ seconds: 0 });
export const PROD_CACHE_LIFETIME = Temporal.Duration.from({ days: 180 });
export const DEFAULT_CLIENT_CACHE_LIFETIME: Temporal.Duration = Temporal.Duration.from({ hours: 1 });
