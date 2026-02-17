
import { Hono } from 'hono'
import { cache } from 'hono/cache'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { Temporal } from 'temporal-polyfill'
import { TEMPORAL_CACHE_CONTROL } from '@cougargrades/utils/cacheControl'
import { TopOptions } from '@cougargrades/models/dto'
import { DURATION_ZERO } from '../cache'
import { getTopResults } from '../lib/getTopResults'

const app = new Hono()

app.get('/',
  zValidator('query', TopOptions),
  cache({
    cacheName: 'cougargrades-api',
    cacheControl: TEMPORAL_CACHE_CONTROL(DURATION_ZERO, Temporal.Duration.from({ days: 1 })),
  }),
  async (ctx) => {
    const { metric, topic, limit, time, hideCore } = ctx.req.valid('query');

    const results = await getTopResults({ metric, topic, limit, time, hideCore })
    return ctx.json(results);
  }
)

export default app