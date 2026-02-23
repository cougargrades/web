import { Hono } from 'hono'
import { cache } from 'hono/cache'
import { describeRoute, resolver, validator } from 'hono-openapi'
import { z } from 'zod'
import { Temporal } from 'temporal-polyfill'
import { TEMPORAL_CACHE_CONTROL } from '@cougargrades/utils/cacheControl'
import { SearchResult } from '@cougargrades/models/dto'
import { DURATION_ZERO } from '../cache'
import { getTrendingResults } from '../lib/getTrendingResults'

export const TRENDING_CACHE_LIFETIME = Temporal.Duration.from({ days: 1 });

const app = new Hono()

const DEFAULT_LIMIT = 5;

app.get('/',
  validator('query', z.object({
    limit: z.coerce.number().int().min(1).max(10).catch(DEFAULT_LIMIT),
  })),
  describeRoute({
    responses: {
      200: {
        description: '',
        content: {
          'application/json': { schema: resolver(SearchResult.array()) }
        }
      }
    }
  }),
  cache({
    cacheName: 'cougargrades-api',
    cacheControl: TEMPORAL_CACHE_CONTROL(TRENDING_CACHE_LIFETIME, Temporal.Duration.from({ days: 1 })),
  }),
  async (ctx) => {
    const { limit } = ctx.req.valid('query');
    const data = await getTrendingResults(limit);
    return ctx.json(data);
  }
)

export default app
