
import { Hono } from 'hono'
import { cache } from 'hono/cache'
import { describeRoute, resolver, validator } from 'hono-openapi'
import { z } from 'zod'
import { Temporal } from 'temporal-polyfill'
import { TEMPORAL_CACHE_CONTROL } from '@cougargrades/utils/cacheControl'
import { AllGroupsResult } from '@cougargrades/models/dto'
import { DURATION_ZERO } from '../cache'
import { getAllGroups } from '../lib/getAllGroups'

const app = new Hono()

app.get('/',
  describeRoute({
    responses: {
      200: {
        description: '',
        content: {
          'application/json': { schema: resolver(AllGroupsResult) }
        }
      }
    }
  }),
  cache({
    cacheName: 'cougargrades-api',
    cacheControl: TEMPORAL_CACHE_CONTROL(DURATION_ZERO, Temporal.Duration.from({ days: 1 })),
  }),
  async (ctx) => {
    const results = await getAllGroups();
    return ctx.json(results);
  }
)
app.get('/:groupId',
  validator('param', z.object({
    groupId: z.string()
  })),
  cache({
    cacheName: 'cougargrades-api',
    cacheControl: TEMPORAL_CACHE_CONTROL(DURATION_ZERO, Temporal.Duration.from({ days: 1 })),
  }),
  async (ctx) => {
    const { groupId } = ctx.req.valid('param');
    console.log('groupId?', groupId);

    // TODO:

    //const results = await getTopResults({ metric, topic, limit, time, hideCore })
    return ctx.json('hello one group');
  }
)
app.get('/:groupId/sections',
  validator('param', z.object({
    groupId: z.string()
  })),
  cache({
    cacheName: 'cougargrades-api',
    // TODO: use real cache time
    cacheControl: TEMPORAL_CACHE_CONTROL(DURATION_ZERO, Temporal.Duration.from({ days: 1 })),
  }),
  async (ctx) => {
    const { groupId } = ctx.req.valid('param');
    console.log('groupId?', groupId);

    // TODO:

    //const results = await getTopResults({ metric, topic, limit, time, hideCore })
    return ctx.json('hello sections in one group');
  }
)

export default app