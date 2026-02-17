
import { Temporal } from 'temporal-polyfill'

export const DURATION_ZERO = Temporal.Duration.from({ seconds: 0 });
export const DEFAULT_CLIENT_CACHE_LIFETIME: Temporal.Duration = Temporal.Duration.from({ hours: 1 });
