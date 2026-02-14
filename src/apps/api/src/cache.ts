
import { Temporal } from 'temporal-polyfill'

export const DEFAULT_CLIENT_CACHE_LIFETIME: Temporal.Duration = Temporal.Duration.from({ hours: 1 });
