// books.ts
import { Hono } from 'hono'
import { cache } from 'hono/cache'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import * as simplesyllabus from '@cougargrades/vendor/simplesyllabus'
import { TEMPORAL_CACHE_CONTROL } from '@cougargrades/utils/cacheControl'
import { Temporal } from 'temporal-polyfill'
import { DEFAULT_CLIENT_CACHE_LIFETIME } from '../cache'

export const SYLLABUS_CACHE_LIFETIME: Temporal.Duration = Temporal.Duration.from({ days: 7 });

const app = new Hono()

app.get('/search',
  zValidator('query', z.object({
    query: z.string().nonempty(),
    strict: z.coerce.boolean().optional(),
  })),
  cache({
    cacheName: 'cougargrades-api',
    cacheControl: TEMPORAL_CACHE_CONTROL(SYLLABUS_CACHE_LIFETIME, DEFAULT_CLIENT_CACHE_LIFETIME),
  }),
  async (ctx) => {
    const { query, strict } = ctx.req.valid('query');

    let result = await simplesyllabus.search(query);
    if (strict === true && result?.sys.success === true && result.items) {
      result.items = result.items.filter(r => r.title.toLowerCase().includes(query.toLowerCase()));
    }
    
    return ctx.json(result);
  }
)

export default app