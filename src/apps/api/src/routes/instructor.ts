
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

app.get('/:instructorName',
  zValidator('param', z.object({
    instructorName: z.string()
  })),
  cache({
    cacheName: 'cougargrades-api',
    cacheControl: TEMPORAL_CACHE_CONTROL(DURATION_ZERO, Temporal.Duration.from({ days: 1 })),
  }),
  async (ctx) => {
    const { instructorName } = ctx.req.valid('param');
    console.log('instructorName?', instructorName);

    //const results = await getTopResults({ metric, topic, limit, time, hideCore })
    return ctx.json('hello instructor');
  }
)

export default app