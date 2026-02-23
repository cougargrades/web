
import { Hono } from 'hono'
import { cache } from 'hono/cache'
import { describeRoute, resolver, validator } from 'hono-openapi'
import { z } from 'zod'
import { Temporal } from 'temporal-polyfill'
import { TEMPORAL_CACHE_CONTROL } from '@cougargrades/utils/cacheControl'
import { AllGroupsResult, PopulatedGroupResult } from '@cougargrades/models/dto'
import { PROD_CACHE_LIFETIME } from '../cache'
import { getAllGroups } from '../lib/getAllGroups'
import { getOneGroup } from '../lib/getOneGroup'
import { isNullish } from '@cougargrades/utils/nullish'

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
    cacheControl: TEMPORAL_CACHE_CONTROL(PROD_CACHE_LIFETIME, Temporal.Duration.from({ days: 1 })),
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
  describeRoute({
    responses: {
      200: {
        description: '',
        content: {
          'application/json': { schema: resolver(PopulatedGroupResult) }
        }
      }
    }
  }),
  cache({
    cacheName: 'cougargrades-api',
    cacheControl: TEMPORAL_CACHE_CONTROL(PROD_CACHE_LIFETIME, Temporal.Duration.from({ days: 1 })),
  }),
  async (ctx) => {
    const { groupId } = ctx.req.valid('param');
    const results = await getOneGroup(groupId);
    if (isNullish(results)) return ctx.status(404);

    return ctx.json(results);
  }
)
app.get('/:groupId/sections',
  validator('param', z.object({
    groupId: z.string()
  })),
  cache({
    cacheName: 'cougargrades-api',
    // TODO: use real cache time
    cacheControl: TEMPORAL_CACHE_CONTROL(PROD_CACHE_LIFETIME, Temporal.Duration.from({ days: 1 })),
  }),
  async (ctx) => {
    const { groupId } = ctx.req.valid('param');

    return ctx.newResponse('Temporarily disabled', 400);

    // const results = await getOneGroup(groupId, true);
    // if (isNullish(results)) return ctx.status(404);

    // return ctx.json(results);
  }
)

export default app