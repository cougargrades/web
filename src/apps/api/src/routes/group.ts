
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
  cache({
    cacheName: 'cougargrades-api',
    cacheControl: TEMPORAL_CACHE_CONTROL(DURATION_ZERO, Temporal.Duration.from({ days: 1 })),
  }),
  async (ctx) => {

    //const results = await getTopResults({ metric, topic, limit, time, hideCore })
    return ctx.json('hello all groups');
  }
)
app.get('/:groupId',
  zValidator('param', z.object({
    groupId: z.string()
  })),
  cache({
    cacheName: 'cougargrades-api',
    cacheControl: TEMPORAL_CACHE_CONTROL(DURATION_ZERO, Temporal.Duration.from({ days: 1 })),
  }),
  async (ctx) => {
    const { groupId } = ctx.req.valid('param');
    console.log('groupId?', groupId);

    //const results = await getTopResults({ metric, topic, limit, time, hideCore })
    return ctx.json('hello one group');
  }
)
app.get('/:groupId/sections',
  zValidator('param', z.object({
    groupId: z.string()
  })),
  cache({
    cacheName: 'cougargrades-api',
    cacheControl: TEMPORAL_CACHE_CONTROL(DURATION_ZERO, Temporal.Duration.from({ days: 1 })),
  }),
  async (ctx) => {
    const { groupId } = ctx.req.valid('param');
    console.log('groupId?', groupId);

    //const results = await getTopResults({ metric, topic, limit, time, hideCore })
    return ctx.json('hello sections in one group');
  }
)

export default app