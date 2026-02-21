import { Hono } from 'hono'
import { cache } from 'hono/cache'
import { zValidator } from '@hono/zod-validator'
import { describeRoute, resolver } from 'hono-openapi'
import { z } from 'zod'
import { Temporal } from 'temporal-polyfill'
import { TEMPORAL_CACHE_CONTROL } from '@cougargrades/utils/cacheControl'
import { TopOptions } from '@cougargrades/models/dto'
import { DURATION_ZERO } from '../cache'
import { getTopResults } from '../lib/getTopResults'

const app = new Hono()

const DEFAULT_LIMIT = 5;

app.get('/',
  zValidator('query', z.object({
    limit: z.coerce.number().int().min(1).max(10).catch(DEFAULT_LIMIT),
  })),
  cache({
    cacheName: 'cougargrades-api',
    // TODO: use real cache time
    cacheControl: TEMPORAL_CACHE_CONTROL(DURATION_ZERO, Temporal.Duration.from({ days: 1 })),
  }),
  async (ctx) => {
    const { limit } = ctx.req.valid('query');
    console.log('trending limit?', limit);

    //const data = await getTrendingResults(limit);
    return ctx.json(`hello trending, limit=${limit}`);
  }
)

export default app
